import { Link, useParams, useNavigate } from "react-router-dom";

export default function SubmitCredits() {
  const { moduleId, assignmentId, studentId } = useParams();
  const navigate = useNavigate();

  // Mock data - in a real app, you'd fetch this based on IDs
  const students = {
    1: { name: "John Doe" },
    2: { name: "Jane Smith" },
    3: { name: "Robert Johnson" },
  };

  const assignments = {
    1: { name: "Homework 1" },
    2: { name: "Midterm Exam" },
    3: { name: "Final Project" },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert("Credits submitted successfully!");
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-4">
          <Link to={`/teacher/modules/${moduleId}/assignments`} className="text-white hover:text-indigo-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Submit Credits</h1>
        </div>
        <Link to="/" className="bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          Logout
        </Link>
      </header>

      <div className="flex-grow p-6 max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Student: {students[studentId]?.name || "Unknown Student"}
          </h2>
          <h3 className="text-lg text-gray-600 mb-6">
            Assignment: {assignments[assignmentId]?.name || "Unknown Assignment"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grade Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade*</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select grade</option>
                <option value="A">A (Excellent)</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B (Good)</option>
                <option value="B-">B-</option>
                <option value="C+">C+</option>
                <option value="C">C (Average)</option>
                <option value="D">D (Poor)</option>
                <option value="F">F (Fail)</option>
              </select>
            </div>

            {/* Credit Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marks*</label>
              <input 
                type="number" 
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter marks (0-100)"
                required
              />
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Performance Feedback*</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Provide detailed feedback on student's performance"
                required
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Submit Credits
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}