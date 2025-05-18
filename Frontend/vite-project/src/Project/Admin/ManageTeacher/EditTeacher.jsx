import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditTeacher() {
  const { id } = useParams(); // teacher id from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    modules: [],
  });
  const [availableModules, setAvailableModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token missing");

        const response = await fetch("http://localhost:8000/su/modules", {
          headers: { Authorization: `Bearer ${token}` },
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

  // Fetch teacher details by id
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token missing");

        const response = await fetch(`http://localhost:8000/su/teacher/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch teacher");

        const data = await response.json();

        setFormData({
          name: data.name,
          username: data.username,
          password: "", // leave blank, only update if user fills
          modules: data.modules.map((mod) => mod.id), // assuming modules come as objects with id
        });
      } catch (error) {
        console.error("Error fetching teacher:", error);
        toast.error("Failed to load teacher details");
      }
    };

    if (id) {
      fetchTeacher();
    }
  }, [id]);

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Full Name is required");
      return false;
    }
    if (!formData.username.trim()) {
      toast.error("Username is required");
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

      // Prepare payload - only send password if filled
      const payload = {
        name: formData.name,
        username: formData.username,
        modules: formData.modules,
        role: "TEACHER",
      };
      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const response = await fetch(`http://localhost:8000/su/teacher/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update teacher");
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

  const goToManageTeachers = () => {
    navigate("/manage-teacher");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#1E3A8A] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Teacher</h1>
          <button
            onClick={goToManageTeachers}
            className="bg-white text-blue-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
          >
            Back to Teachers
          </button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
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
                required
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
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
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password (leave blank to keep unchanged)
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="modules" className="block text-gray-700 font-medium mb-2">
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
              >
                {availableModules.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.moduleName}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
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
              {isLoading ? "Updating..." : "Update Teacher"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
