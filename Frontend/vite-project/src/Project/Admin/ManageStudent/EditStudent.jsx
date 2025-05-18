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
    modules: "",
    active: true
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch student data when component mounts
  useEffect(() => {
    const fetchStudent = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/su/student/${studentId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }

        const student = await response.json();
        setFormData({
          name: student.name || "",
          username: student.username || "",
          password: "", // Password is intentionally left blank
          enrollmentNumber: student.enrollmentNumber || "",
          modules: student.modules?.join(", ") || "",
          active: student.active || true
        });
      } catch (error) {
        console.error("Error fetching student:", error);
        toast.error(error.message);
        navigate("/manage-students");
      }
    };

    fetchStudent();
  }, [studentId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      // Prepare complete update data
      const updateData = {
        name: formData.name,
        enrollmentNumber: formData.enrollmentNumber,
        active: formData.active,
        modules: formData.modules
          .split(",")
          .map(module => module.trim())
          .filter(module => module.length > 0),
        password: formData.password || null // Send null if password is empty
      };
  
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

              <div>
                <label htmlFor="modules" className="block text-sm font-medium text-gray-700 mb-1">
                  Modules (comma separated)
                </label>
                <input
                  id="modules"
                  type="text"
                  name="modules"
                  value={formData.modules}
                  onChange={handleChange}
                  placeholder="Math, Science, History"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
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