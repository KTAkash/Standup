import { Link } from "react-router-dom";

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-[#4A63A3] text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <Link to="/" className="bg-white text-[#4A63A3] px-4 py-2 rounded-lg hover:bg-gray-200">
          Logout
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex flex-wrap justify-center mt-8 gap-6 px-4">
        <Link to="/my-grades" className="dashboard-card">
          My Grades
        </Link>
        <Link to="/assignments" className="dashboard-card">
          Assignments
        </Link>
        <Link to="/contact-teacher" className="dashboard-card">
          Contact Teacher
        </Link>
      </div>
    </div>
  );
}

/* Tailwind Custom Classes */

