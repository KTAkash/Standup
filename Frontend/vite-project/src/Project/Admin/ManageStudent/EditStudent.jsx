
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditStudent() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    enrollmentNumber: "",
    modules: [], // Changed from string to array
    active: true
  });
  const [availableModules, setAvailableModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch student data and available modules
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

        // Fetch student data
        const studentResponse = await fetch(`http://localhost:8000/su/student/${studentId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!studentResponse.ok) throw new Error("Failed to fetch student data");
        const student = await studentResponse.json();

        // Extract module names from student data
        const studentModuleNames = student.modules?.map(mod => 
          mod.moduleName || mod.name || mod
        ) || [];

        setFormData({
          name: student.name || "",
          username: student.username || "",
          password: "",
          enrollmentNumber: student.enrollmentNumber || "",
          modules: studentModuleNames,
          active: student.active !== false // default to true if not specified
        });

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.message);
        navigate("/manage-students");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [studentId, navigate]);

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
        enrollmentNumber: formData.enrollmentNumber,
        active: formData.active,
        moduleIds: moduleIds
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`http://localhost:8000/su/update-student/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update student");
      }

      toast.success("Student updated successfully!");
      navigate("/manage-students");
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error(error.message || "Failed to update student");
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
    <div className="min-h-screen bg-gray-50">
      {/* Dark Blue Header */}
      <header className="bg-[#1E3A8A] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Edit Student</h1>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              <button 
                onClick={() => navigate("/manage-students")} 
                className="bg-white text-[#1E3A8A] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-sm"
              >
                Back to Students
              </button>
              <button 
                onClick={handleLogout} 
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#1E3A8A]">Edit Student Details</h2>
              <p className="text-gray-600 mt-2">Update the student information below</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-100 cursor-not-allowed"
                  required
                  disabled
                />
              </div>

              <div>
                <label htmlFor="enrollment" className="block text-sm font-medium text-gray-700 mb-1">
                  Enrollment Number
                </label>
                <input
                  id="enrollment"
                  type="text"
                  name="enrollmentNumber"
                  value={formData.enrollmentNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password (optional)
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Updated Modules Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Modules
                </label>
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#1E3A8A] focus:ring-[#1E3A8A] border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                  Active Student
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-medium hover:bg-[#172554] transition-colors shadow-md ${
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
                ) : "Update Student"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}