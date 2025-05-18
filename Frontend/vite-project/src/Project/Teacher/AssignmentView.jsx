import { Link, useParams } from "react-router-dom";
import { FaEdit, FaTrash, FaPen } from "react-icons/fa";

export default function AssignmentView() {
  const { moduleId } = useParams();

  // Mock data
  const students = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Robert Johnson" },
  ];

  const assignments = [
    { id: 1, name: "Homework 1" },
    { id: 2, name: "Midterm Exam" },
    { id: 3, name: "Final Project" },
  ];

  // Mock grades data (studentId -> assignmentId -> grade)
  const grades = {
    1: { 1: "A", 2: "B+", 3: null },
    2: { 1: "A-", 2: "A", 3: null },
    3: { 1: "B", 2: "C+", 3: null },
  };

  const handleDeleteAssignment = (assignmentId) => {
    // Add your delete logic here
    console.log(`Delete assignment with ID: ${assignmentId}`);
    alert(`Assignment ${assignmentId} will be deleted`);
  };

  const handleUpdateAssignment = (assignmentId) => {
    // Add your update logic here
    console.log(`Update assignment with ID: ${assignmentId}`);
    alert(`Assignment ${assignmentId} will be updated`);
  };

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
          <h1 className="text-2xl font-bold">Assignment Grades</h1>
        </div>
        <Link to="/" className="bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          Logout
        </Link>
      </header>

      <div className="flex-grow p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Module: Mathematics 101 (MATH101)</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  {assignments.map(assignment => (
                    <th key={assignment.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center justify-between">
                        <span>{assignment.name}</span>
                        <div className="flex space-x-2 ml-2">
                          <button 
                            onClick={() => handleUpdateAssignment(assignment.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit assignment"
                          >
                            <FaPen className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete assignment"
                          >
                            <FaTrash className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map(student => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    {assignments.map(assignment => (
                      <td key={assignment.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="mr-2">{grades[student.id]?.[assignment.id] || "-"}</span>
                          <Link 
                            to={`/teacher/modules/${moduleId}/assignments/${assignment.id}/students/${student.id}/credits`}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit grade"
                          >
                            <FaEdit className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}