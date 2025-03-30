import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTeacher() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    modules: "",
  });

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Created:", formData);
    navigate("/manage-students"); // Redirect after submission
  };

  // Navigate to Manage Students
  const goToManageStudents = () => {
    navigate("/manage-students");
  };

  // Logout function
  const handleLogout = () => {
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header (Same as ManageStudents) */}
      <header className="flex justify-between items-center bg-[#4A63A3] text-white p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">Create Student</h1>
        <div className="flex space-x-4">
          <button onClick={goToManageStudents} className="bg-white text-[#4A63A3] px-4 py-2 rounded-lg font-semibold hover:bg-gray-200">
            Home
          </button>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600">
            Logout
          </button>
        </div>
      </header>

      {/* Student Creation Form */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-96 mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Student Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Modules (comma separated)"
            value={formData.modules}
            onChange={(e) => setFormData({ ...formData, modules: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <button type="submit" className="w-full bg-[#4A63A3] text-white py-2 rounded-lg hover:bg-[#3b4f85]">
            Create Teacher
          </button>
        </form>
      </div>
    </div>
  );
}
