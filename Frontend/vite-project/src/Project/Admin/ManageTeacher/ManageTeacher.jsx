import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageTeachers() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeachers = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/su/teachers", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`Failed to fetch teachers: ${response.status}`);
      }

      const data = await response.json();
      setTeachers(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const toggleStatus = async (teacherId) => {
    const token = localStorage.getItem("token");
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    const updatedTeacher = { ...teacher, active: !teacher.active };

    try {
      const response = await fetch(`http://localhost:8000/su/update-teacher/${teacherId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedTeacher)
      });

      if (!response.ok) {
        throw new Error(`Failed to update teacher: ${response.status}`);
      }

      setTeachers(prev => prev.map(t => 
        t.id === teacherId ? updatedTeacher : t
      ));
      toast.success("Teacher status updated successfully!");
    } catch (error) {
      console.error("Error updating teacher:", error);
      toast.error(error.message);
    }
  };

  const deleteTeacher = async (teacherId) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/su/delete-teacher/${teacherId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete teacher: ${response.status}`);
      }

      setTeachers(prev => prev.filter(teacher => teacher.id !== teacherId));
      toast.success("Teacher deleted successfully!");
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast.error(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
    toast.info("Logged out successfully");
  };

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl font-semibold text-blue-800 animate-pulse">
          Loading teachers...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold text-red-600 mb-4">{error}</div>
        <div className="flex space-x-4">
          <button 
            onClick={fetchTeachers} 
            className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors font-medium"
          >
            Try Again
          </button>
          <button 
            onClick={handleLogout} 
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Dark Blue Header */}
      <header className="bg-[#1E3A8A] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Teachers</h1>
          <div className="flex space-x-4">
            <Link 
              to="/create-teacher" 
              className="bg-white text-blue-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
            >
              + Create Teacher
            </Link>
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
        {teachers.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center max-w-2xl mx-auto">
            <svg 
              className="w-16 h-16 text-gray-400 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Teachers Found</h2>
            <p className="text-gray-500 mb-6">Get started by creating a new teacher profile</p>
            <Link 
              to="/create-teacher" 
              className="inline-block bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors font-medium shadow-md"
            >
              Create New Teacher
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Username</th>
                    <th className="px-6 py-4 text-left font-semibold">Modules</th>
                    <th className="px-6 py-4 text-center font-semibold">Status</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{teacher.name || teacher.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{teacher.username}</td>

                      <td className="px-6 py-4 text-gray-700">
  {teacher.modules && teacher.modules.length > 0 
    ? teacher.modules.map(module => 
        typeof module === 'string' 
          ? module 
          : (module.moduleName || "Unknown Module")
      ).join(", ")
    : "No modules assigned"}
</td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span 
                          onClick={() => toggleStatus(teacher.id)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                            teacher.active 
                              ? "bg-green-100 text-green-800 hover:bg-green-200" 
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {teacher.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <Link 
                            to={`/edit-teacher/${teacher.id}`} 
                            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => deleteTeacher(teacher.id)} 
                            className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
