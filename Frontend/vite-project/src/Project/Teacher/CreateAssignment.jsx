import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateAssignment() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teacher, setTeacher] = useState(null);

  // Form state matching your Assignment entity
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    module: '',
    studentId: null // Optional student assignment
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Fetch teacher data on mount
  useEffect(() => {
    const fetchTeacher = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/su/teacher/dashboard", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch teacher data: ${response.status}`);
        }

        const data = await response.json();
        setTeacher(data.teacher);
      } catch (error) {
        console.error("Error fetching teacher:", error);
        setError(error.message);
        toast.error("Failed to load teacher data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacher();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }

    if (!formData.module) {
      errors.module = 'Module is required';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch("http://localhost:8000/su/teacher/create-assignment", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          teacherId: teacher?.id // Include teacher ID from state
        }),
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create assignment');
      }

      const data = await response.json();
      toast.success("Assignment created successfully!");
      navigate(`/assignment/${data.id}`);
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error(error.message || "Error creating assignment");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
    toast.info("Logged out successfully");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading teacher data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
        <button 
          onClick={handleLogout} 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-4">
          <Link to="/teacher" className="text-white hover:text-indigo-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Create New Assignment</h1>
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Logout
        </button>
      </header>

      {/* Main Form Content */}
      <div className="flex-grow p-6 max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Create New Assignment
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title*</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${validationErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter assignment title"
                required
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
              <textarea 
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${validationErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Provide detailed instructions for the assignment"
                required
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            {/* Module Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Module*</label>
              <input 
                type="text" 
                name="module"
                value={formData.module}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${validationErrors.module ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter module name/code"
                required
              />
              {validationErrors.module && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.module}</p>
              )}
            </div>

            {/* Optional Student Assignment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Specific Student (Optional)</label>
              <input 
                type="number" 
                name="studentId"
                value={formData.studentId || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter student ID"
                min="1"
              />
              <p className="mt-1 text-sm text-gray-500">Leave blank to assign to all students in the module</p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Link to="/teacher" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </Link>
              <button 
                type="submit" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                disabled={Object.values(validationErrors).some(error => error)}
              >
                Create Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}