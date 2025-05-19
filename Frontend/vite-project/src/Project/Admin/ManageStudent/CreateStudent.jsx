import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateStudent() {
  const [formData, setFormData] = useState({
    name: "",
    enrollmentNumber: "",
    username: "",
    password: "",
    modules: [], // Changed from string to array
  });
  const [availableModules, setAvailableModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch modules from backend when component mounts
  useEffect(() => {
    const fetchModules = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to continue.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/su/modules", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch modules");
        }

        const data = await response.json();
        setAvailableModules(data);
      } catch (error) {
        toast.error(error.message || "Could not load modules");
      }
    };

    fetchModules();
  }, [navigate]);

  // Handle module selection/deselection (checkbox)
  const handleModuleChange = (e) => {
    const moduleName = e.target.value;
    setFormData((prev) => {
      if (e.target.checked) {
        // Add module to list
        return { ...prev, modules: [...prev.modules, moduleName] };
      } else {
        // Remove module from list
        return {
          ...prev,
          modules: prev.modules.filter((mod) => mod !== moduleName),
        };
      }
    });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const response = await fetch("http://localhost:8000/su/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password, // Will be encoded by backend
                name: formData.name,
                enrollmentNumber: formData.enrollmentNumber,
                moduleIds: formData.moduleIds,
                active: true
            }),
        });

        if (!response.ok) throw new Error("Failed to create student");
        toast.success("Student created successfully!");
        navigate("/manage-students");
    } catch (error) {
        toast.error(error.message);
    } finally {
        setIsLoading(false);
    }
};

  const goToManageStudents = () => {
    navigate("/manage-students");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
    toast.info("You have been logged out.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dark Blue Header */}
      <header className="bg-[#1E3A8A] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Create New Student</h1>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              <button 
                onClick={goToManageStudents} 
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
              <h2 className="text-2xl font-bold text-[#1E3A8A]">Student Information</h2>
              <p className="text-gray-600 mt-2">Fill in the details to create a new student</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="enrollment" className="block text-sm font-medium text-gray-700 mb-1">
                  Enrollment Number
                </label>
                <input
                  id="enrollment"
                  type="text"
                  placeholder="Enter enrollment number"
                  value={formData.enrollmentNumber}
                  onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
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
                  placeholder="User Name"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
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
                    Creating...
                  </span>
                ) : "Create Student"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}