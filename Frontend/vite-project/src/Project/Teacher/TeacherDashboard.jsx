import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  // Mock data for teacher and modules
  const teacherData = {
    teacher: {
      name: "Dr. Smith",
      modules: [
        {
          id: 1,
          name: "Mathematics 101",
          description: "Introduction to Calculus",
          code: "MATH101"
        },
        {
          id: 2,
          name: "Physics 201",
          description: "Advanced Mechanics",
          code: "PHY201"
        },
        {
          id: 3,
          name: "Computer Science 301",
          description: "Data Structures and Algorithms",
          code: "CS301"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <Link 
          to="/" 
          className="bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Logout
        </Link>
      </header>

      {/* Welcome Section */}
      <div className="px-6 py-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Welcome, {teacherData.teacher.name}</h2>
        <p className="text-gray-600 mt-1">Manage your courses and assignments</p>
      </div>

      {/* Modules Grid */}
      <div className="flex-grow p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Your Teaching Modules</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teacherData.teacher.modules.map((module) => (
            <div key={module.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">{module.name}</h4>
                    <p className="text-sm text-indigo-600 font-medium">{module.code}</p>
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
      </div>

      {/* Quick Actions Footer */}
      
    </div>
  );
}