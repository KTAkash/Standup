import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditTeacher() {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    modules: [], // Now storing module names/IDs as array
    active: true
  });
  const [availableModules, setAvailableModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch teacher data and available modules
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch available modules
        const modulesResponse = await fetch("http://localhost:8000/su/modules", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!modulesResponse.ok) throw new Error("Failed to fetch modules");
        const modulesData = await modulesResponse.json();
        setAvailableModules(modulesData);

        // Fetch teacher data
        const teacherResponse = await fetch(`http://localhost:8000/su/teacher/${teacherId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!teacherResponse.ok) throw new Error("Failed to fetch teacher data");
        const teacher = await teacherResponse.json();

        // Extract module names from teacher data
        const teacherModuleNames = teacher.modules?.map(mod => 
          mod.moduleName || mod.name || mod
        ) || [];

        setFormData({
          name: teacher.name || "",
          username: teacher.username || "",
          password: "",
          modules: teacherModuleNames,
          active: teacher.active !== false // default to true if not specified
        });

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.message);
        navigate("/manage-teachers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [teacherId, navigate]);

  // Handle module selection/deselection
  const handleModuleChange = (e) => {
    const moduleName = e.target.value;
    setFormData(prev => {
      if (e.target.checked) {
        // Add module to list
        return { ...prev, modules: [...prev.modules, moduleName] };
      } else {
        // Remove module from list
        return {
          ...prev,
          modules: prev.modules.filter(mod => mod !== moduleName)
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Convert selected module names to IDs
      const moduleIds = availableModules
        .filter(mod => formData.modules.includes(mod.moduleName || mod.name))
        .map(mod => mod.id);

      const updateData = {
        name: formData.name,
        active: formData.active,
        moduleIds: moduleIds
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`http://localhost:8000/su/update-teacher/${teacherId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update teacher");
      }

      toast.success("Teacher updated successfully!");
      navigate("/manage-teacher");
    } catch (error) {
      console.error("Error updating teacher:", error);
      toast.error(error.message || "Failed to update teacher");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
    toast.info("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header remains the same */}
      <header className="bg-[#1E3A8A] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Teacher</h1>
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate("/manage-teachers")} 
              className="bg-white text-blue-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
            >
              Back to Teachers
            </button>
            <button 
              onClick={handleLogout} 
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <svg 
              className="w-16 h-16 text-blue-800 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-blue-800">Edit Teacher Profile</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name, Username, Password fields remain the same */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                New Password <span className="text-gray-500 text-sm">(leave blank to keep current)</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter new password"
              />
            </div>

            {/* Updated Modules Selection */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Assign Modules</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded-lg">
                {availableModules.length === 0 ? (
                  <p className="text-gray-500">No modules available</p>
                ) : (
                  availableModules.map((mod) => {
                    const moduleLabel = mod.moduleName || mod.name || "Unknown Module";
                    return (
                      <label
                        key={mod.id}
                        className="inline-flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={moduleLabel}
                          checked={formData.modules.includes(moduleLabel)}
                          onChange={handleModuleChange}
                          className="mr-2"
                        />
                        {moduleLabel}
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* Active checkbox remains the same */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="active"
                id="active"
                checked={formData.active}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="active" className="ml-2 text-gray-700 font-medium">
                Active Teacher
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-md ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : "Update Teacher"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}