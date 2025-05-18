<<<<<<< HEAD
import { useEffect, useState } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
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

<<<<<<< HEAD
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
=======
  // Fetch modules on mount
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token missing");

        const response = await fetch("http://localhost:8000/su/modules", {
          headers: {
            Authorization: `Bearer ${token}`,
>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch modules");
        }

        const data = await response.json();
        setAvailableModules(data);
      } catch (error) {
<<<<<<< HEAD
        toast.error(error.message || "Could not load modules");
=======
        console.error("Error fetching modules:", error);
        toast.error("Failed to load modules");
>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
      }
    };

    fetchModules();
<<<<<<< HEAD
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
=======
  }, []);

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Full Name is required");
      return false;
    }
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (formData.modules.length === 0) {
      toast.error("Please select at least one module");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      // Send only username, password, and role here — exclude name and modules for now
      const response = await fetch("http://localhost:8000/su/teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name : formData.name,
          username: formData.username,
          password: formData.password,
          modules: formData.modules,
          
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create teacher";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // empty or invalid JSON
        }
        throw new Error(errorMessage);
      }

      toast.success("Teacher created successfully!");
      navigate("/manage-teacher");

      // Optional: after successful creation, you can add separate logic to assign modules to this teacher
      // This requires backend support — maybe an API like POST /su/assign-modules?teacherId=...&modules=[...]

    } catch (error) {
      console.error("Error creating teacher:", error);
      toast.error(error.message || "Failed to create teacher");
    } finally {
      setIsLoading(false);
    }
  };

  const goToManageTeachers = () => {
    navigate("/manage-teacher");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
    toast.info("Logged out successfully");
>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
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
<<<<<<< HEAD
=======
            <svg
              className="w-16 h-16 text-blue-800 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
            <h2 className="text-2xl font-bold text-blue-800">Create New Teacher</h2>
            <p className="text-gray-600 mt-2">
              Fill in the details below to register a new teacher
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
<<<<<<< HEAD
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Enter teacher's full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
=======
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter teacher's full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
                required
              />
            </div>

<<<<<<< HEAD
            {/* Username */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
=======
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
                required
              />
            </div>

<<<<<<< HEAD
            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
=======
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
                required
              />
            </div>

<<<<<<< HEAD
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
=======
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="modules"
              >
                Assign Modules
              </label>
              <select
                id="modules"
                multiple
                value={formData.modules}
                onChange={(e) => {
                  const selected = Array.from(
                    e.target.selectedOptions,
                    (option) => parseInt(option.value)
                  );
                  setFormData({ ...formData, modules: selected });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                aria-describedby="modulesHelp"
              >
                {availableModules.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.moduleName}
                  </option>
                ))}
              </select>
              <p
                id="modulesHelp"
                className="text-sm text-gray-500 mt-1"
              >
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple modules
              </p>
            </div>

>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
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
<<<<<<< HEAD
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
=======
                      d="M4 12a8 8 0 018-8v8H4z"
>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
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
