import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-[#4A63A3] text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link to="/" className="bg-white text-[#4A63A3] px-4 py-2 rounded-lg hover:bg-gray-200">
          Logout
        </Link>
      </header>

      {/* Centered Buttons */}
      <div className="flex flex-col items-center justify-center flex-grow space-y-6">
        <Link to="/manage-students" className="w-60 text-center bg-[#4A63A3] text-white px-6 py-3 rounded-lg text-xl font-semibold shadow-md hover:bg-[#3b4f85] transition">
          Students
        </Link>
        <Link to="/manage-teacher" className="w-60 text-center bg-[#4A63A3] text-white px-6 py-3 rounded-lg text-xl font-semibold shadow-md hover:bg-[#3b4f85] transition">
          Teachers
        </Link>
      </div>
    </div>
  );
}
