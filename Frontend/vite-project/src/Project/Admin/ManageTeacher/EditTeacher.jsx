import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
<<<<<<< HEAD
import "react-toastify/dist/ReactToastify.css";

export default function EditTeacher() {
  const { teacherId } = useParams();
  const navigate = useNavigate();
=======

export default function EditTeacher() {
  const { id } = useParams(); // teacher id from URL
  const navigate = useNavigate();

>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
<<<<<<< HEAD
    modules: "",
    active: true
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTeacher = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/su/teacher/${teacherId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch teacher data");
        }

        const teacher = await response.json();
        setFormData({
          name: teacher.name || "",
          username: teacher.username || "",
          password: "",
          modules: teacher.modules?.join(", ") || "",
          active: teacher.active || true
        });
      } catch (error) {
        console.error("Error fetching teacher:", error);
        toast.error(error.message);
        navigate("/manage-teachers");
      }
    };

    fetchTeacher();
  }, [teacherId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      const updateData = {
        name: formData.name,
        active: formData.active,
        modules: formData.modules
          .split(",")
          .map(module => module.trim())
          .filter(module => module.length > 0)
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
  
=======
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

>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
      toast.success("Teacher updated successfully!");
      navigate("/manage-teacher");
    } catch (error) {
      console.error("Error updating teacher:", error);
      toast.error(error.message || "Failed to update teacher");
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
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
=======
  const goToManageTeachers = () => {
    navigate("/manage-teacher");
>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
  };

  return (
    <div className="min-h-screen bg-white">
<<<<<<< HEAD
      {/* Dark Blue Header */}
      <header className="bg-[#1E3A8A] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Teacher</h1>
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate("/manage-teacher")} 
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
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
=======
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
>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
<<<<<<< HEAD
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

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Modules <span className="text-gray-500 text-sm">(comma separated)</span>
              </label>
              <input
                type="text"
                name="modules"
                value={formData.modules}
                onChange={handleChange}
=======
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
>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

<<<<<<< HEAD
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
=======
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
>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-md ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
<<<<<<< HEAD
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : "Update Teacher"}
=======
              {isLoading ? "Updating..." : "Update Teacher"}
>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
            </button>
          </form>
        </div>
      </main>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 6c5e8d2cc16a8dc4ce0833feb358f8c5b9fb57c8
