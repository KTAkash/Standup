import { Link, useParams } from "react-router-dom";

export default function StudentsWithCredits() {
  const { moduleId } = useParams();

  // Mock data
  const module = {
    id: moduleId,
    name: "Mathematics 101",
    code: "MATH101"
  };

  const students = [
    { id: 1, name: "John Doe", credits: 85, assignmentsCompleted: 5 },
    { id: 2, name: "Jane Smith", credits: 92, assignmentsCompleted: 5 },
    { id: 3, name: "Robert Johnson", credits: 78, assignmentsCompleted: 4 },
  ];

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
          <h1 className="text-2xl font-bold">Students with Credits</h1>
        </div>
        <Link to="/" className="bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          Logout
        </Link>
      </header>

      <div className="flex-grow p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Module: {module.name} ({module.code})
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits Earned</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignments Completed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map(student => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.credits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.assignmentsCompleted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     
                    </td>
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