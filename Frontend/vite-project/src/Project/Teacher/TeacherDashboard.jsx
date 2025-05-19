import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function TeacherDashboard() {
  const [teacherData, setTeacherData] = useState({
    teacher: {
      name: "",
      id: null,
      modules: []
    },
    assignments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the token from localStorage (assuming it's stored there after login)
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("You are not logged in. Please log in to continue.");
      setLoading(false);
      return;
    }

    // Fetch teacher dashboard data from the backend
    const fetchTeacherData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/su/teacher/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setTeacherData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching teacher data:", err);
        setError(err.response?.data || "Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-700 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-red-600 text-xl font-bold mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <Link 
            to="/login" 
            className="mt-6 block w-full bg-indigo-700 text-white py-2 px-4 rounded-lg text-center hover:bg-indigo-800 transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  const { teacher, assignments } = teacherData;
  
  // Handle case where teacher has no modules
  const hasModules = teacher.modules && teacher.modules.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <button 
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/login";
          }}
          className="bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Logout
        </button>
      </header>

      {/* Welcome Section */}
      <div className="px-6 py-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Welcome, {teacher.name || "Teacher"}</h2>
        <p className="text-gray-600 mt-1">Manage your courses and assignments</p>
      </div>

      {/* Modules Grid */}
      <div className="flex-grow p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Your Teaching Modules</h3>
        
        {!hasModules ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600">You currently have no modules assigned to you.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacher.modules.map((module) => (
              <div key={module.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{module.moduleName}</h4>
                      <p className="text-sm text-indigo-600 font-medium">{module.moduleCode}</p>
                    </div>
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mt-3 text-sm">{module.description}</p>
                  
                  <div className="mt-5 flex flex-col space-y-3">
                    <div className="flex space-x-3">
                      <Link
                        to={`/teacher/modules/${module.id}/assignments`}
                        className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                      >
                        View Assignments
                      </Link>
                      <Link
                        to={`/teacher/modules/${module.id}/create-assignment`}
                        className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                      >
                        Create Assignment
                      </Link>
                    </div>
                    <Link
                      to={`/teacher/modules/${module.id}/students-with-credits`}
                      className="w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      View All Students with Credits
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Assignments Section */}
      {assignments && assignments.length > 0 && (
        <div className="p-6 bg-white shadow-sm mt-4 mx-6 mb-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Assignments</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{assignment.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.module?.moduleName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/teacher/assignments/${assignment.id}`} className="text-indigo-600 hover:text-indigo-900">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}