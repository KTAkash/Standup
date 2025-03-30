import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-[#4A63A3] text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <Link to="/" className="bg-white text-[#4A63A3] px-4 py-2 rounded-lg hover:bg-gray-200">
          Logout
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex flex-wrap justify-center mt-8 gap-6 px-4">
        <Link to="/my-classes" className="dashboard-card">
          My Classes
        </Link>
        <Link to="/assign-grades" className="dashboard-card">
          Assign Grades
        </Link>
        <Link to="/student-progress" className="dashboard-card">
          Student Progress
        </Link>
      </div>
    </div>
  );
}

/* Tailwind Custom Classes */

