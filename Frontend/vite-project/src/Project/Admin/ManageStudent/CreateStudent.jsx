import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateStudent() {
  const [formData, setFormData] = useState({
    name: "",
    enrollmentNumber: "",
    username: "",
    password: "",
    modules: [],
  });
  const [availableModules, setAvailableModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch modules on component mount
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token missing");

        const response = await fetch("http://localhost:8000/su/modules", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch modules");

        const data = await response.json();
        setAvailableModules(data);
      } catch (error) {
        console.error("Error fetching modules:", error);
        toast.error("Failed to load modules");
      }
    };

    fetchModules();
  }, []);

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Full Name is required");
      return false;
    }
    if (!formData.enrollmentNumber.trim()) {
      toast.error("Enrollment Number is required");
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

      const response = await fetch("http://localhost:8000/su/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          enrollmentNumber: formData.enrollmentNumber,
          username: formData.username,
          password: formData.password,
          modules: formData.modules,
          role: "STUDENT",
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create student";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(errorMessage);
      }

      toast.success("Student created successfully!");
      navigate("/manage-students");
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error(error.message || "Failed to create student");
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
    <div className="min-h-screen bg-white">
      <header className="bg-[#1E3A8A] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Create Student</h1>
          <div className="flex space-x-4">
            <button
              onClick={goToManageStudents}
              className="bg-white text-blue-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
            >
              Back to Students
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
            <h2 className="text-2xl font-bold text-blue-800">Create New Student</h2>
            <p className="text-gray-600 mt-2">Fill in the details below to register a new student</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="enrollmentNumber">
                Enrollment Number
              </label>
              <input
                id="enrollmentNumber"
                type="text"
                placeholder="Enter enrollment number"
                value={formData.enrollmentNumber}
                onChange={(e) =>
                  setFormData({ ...formData, enrollmentNumber: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

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
                    (option) => option.value
                  );
                  setFormData({ ...formData, modules: selected });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                aria-describedby="modulesHelp"
              >
                {availableModules.map((mod) => (
                  <option key={mod.id} value={mod.moduleName}>
                    {mod.moduleName}
                  </option>
                ))}
              </select>
              <p id="modulesHelp" className="text-sm text-gray-500 mt-1">
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple modules
              </p>
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
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Student"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
