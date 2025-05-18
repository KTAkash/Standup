import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateTeacher() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    modules: [],
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

  // Handle selection/deselection of modules (checkbox)
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

  // Handle form submission to create teacher
 // In CreateTeacher.js
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required. Please login.");
      navigate("/login");
      return;
    }

    // Convert selected module names to IDs
    const moduleIds = availableModules
      .filter(mod => formData.modules.includes(mod.moduleName || mod.name))
      .map(mod => mod.id);

    const payload = {
      name: formData.name,
      username: formData.username,
      password: formData.password,
      moduleIds: moduleIds
    };

    console.log("Sending payload:", payload); // Debug log

    const response = await fetch("http://localhost:8000/su/teacher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create teacher");
    }

    const createdTeacher = await response.json();
    console.log("Created teacher:", createdTeacher); // Debug log

    toast.success("Teacher created successfully!");
    navigate("/manage-teacher", { 
      state: { refresh: true } // Trigger refresh
    });
    
  } catch (error) {
    console.error("Creation error:", error);
    toast.error(error.message || "Failed to create teacher");
  } finally {
    setIsLoading(false);
  }
};

  // Navigate back to manage teachers page
  const goToManageTeachers = () => navigate("/manage-teacher");

  // Handle logout and cleanup
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.info("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#1E3A8A] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Create Teacher</h1>
          <div className="flex space-x-4">
            <button
              onClick={goToManageTeachers}
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

      <main className="container mx-auto p-6">
        <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-blue-800">Create New Teacher</h2>
            <p className="text-gray-600 mt-2">
              Fill in the details below to register a new teacher
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Enter teacher's full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Modules selection */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Assign Modules</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded-lg">
                {availableModules.length === 0 ? (
                  <p className="text-gray-500">No modules available</p>
                ) : (
                  availableModules.map((mod) => {
                    // Assume moduleName or name exists, adjust if backend differs
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

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-md ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Teacher"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
