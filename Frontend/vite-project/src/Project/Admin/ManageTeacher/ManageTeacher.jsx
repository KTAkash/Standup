import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ManageTeachers() {
  const navigate = useNavigate();

  // Dummy student data
  const [students, setStudents] = useState([
    { id: 1, name: "John Doe", username: "johndoe", modules: "Math, Science", active: true },
    { id: 2, name: "Jane Smith", username: "janesmith", modules: "English, Physics", active: false },
  ]);

  // Toggle Active/Inactive
  const toggleStatus = (id) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, active: !student.active } : student
      )
    );
  };

  // Delete Student
  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  // Logout function
  const handleLogout = () => {
    // Clear any authentication data if stored
    // localStorage.removeItem("authToken"); // Uncomment if using auth
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-[#4A63A3] text-white p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">Manage Teachers</h1>
        <div className="flex space-x-4">
          <Link to="/create-student" className="bg-white text-[#4A63A3] px-4 py-2 rounded-lg font-semibold hover:bg-gray-200">
            + Create Teacher
          </Link>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600">
            Logout
          </button>
        </div>
      </header>

      {/* Students Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-[#4A63A3] text-white">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Username</th>
              <th className="py-3 px-6 text-left">Modules</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b">
                <td className="py-3 px-6">{student.name}</td>
                <td className="py-3 px-6">{student.username}</td>
                <td className="py-3 px-6">{student.modules}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => toggleStatus(student.id)}
                    className={`px-4 py-1 rounded-lg font-semibold ${
                      student.active ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}
                  >
                    {student.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="py-3 px-6 flex justify-center space-x-3">
                  <Link to={`/edit-student/${student.id}`} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Update
                  </Link>
                  <button onClick={() => deleteStudent(student.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
