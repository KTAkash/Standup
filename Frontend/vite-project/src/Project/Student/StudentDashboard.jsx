import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModuleRoadmap from "./ModuleRoadmap";

// Mock data
const mockStudent = {
  name: "Dharshan",
  id: "STU-2024-001",
  currentModule: 2
};

const mockAssignments = [
  {
    id: 1,
    moduleId: 1,
    title: "Introduction to React",
    creditMarks: 85,
    status: "completed",
    feedback: "Good understanding of core concepts"
  },
  {
    id: 2,
    moduleId: 1,
    title: "Component Lifecycle",
    creditMarks: 92,
    status: "completed",
    feedback: "Excellent implementation"
  },
  {
    id: 3,
    moduleId: 2,
    title: "State Management",
    creditMarks: 78,
    status: "pending",
    feedback: ""
  },
  {
    id: 4,
    moduleId: 2,
    title: "Hooks Implementation",
    creditMarks: "-",
    status: "upcoming",
    feedback: ""
  }
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState("roadmap");
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [feedbackValues, setFeedbackValues] = useState(
    mockAssignments.reduce((acc, assignment) => {
      if (assignment.feedback) acc[assignment.id] = assignment.feedback;
      return acc;
    }, {})
  );

  const handleFeedbackChange = (assignmentId, value) => {
    setFeedbackValues(prev => ({ ...prev, [assignmentId]: value }));
  };

  const submitFeedback = (assignmentId) => {
    toast.success("Feedback submitted successfully!");
    console.log("Mock feedback submission:", {
      assignmentId,
      feedback: feedbackValues[assignmentId]
    });
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleModuleClick = (moduleId) => {
    setSelectedModuleId(moduleId);
    setView("assignments");
  };

  const handleBackToRoadmap = () => {
    setView("roadmap");
    setSelectedModuleId(null);
  };

  const currentAssignments = mockAssignments.filter(
    assignment => assignment.moduleId === selectedModuleId
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-white text-2xl font-bold">Student Portal</h1>
            <div className="flex items-center space-x-4">
              <div className="text-white font-medium">
                Welcome, {mockStudent.name}!
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/80 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium text-blue transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {view === "roadmap" ? (
          <ModuleRoadmap onModuleClick={handleModuleClick} />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Module {selectedModuleId} Assignments
              </h2>
              <button
                onClick={handleBackToRoadmap}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to Roadmap
              </button>
            </div>

            {/* Assignments Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Assignment
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Marks
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Feedback
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentAssignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {assignment.title}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            assignment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : assignment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {assignment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-blue-600 font-medium">
                        {assignment.creditMarks}
                      </td>
                      <td className="px-6 py-4">
                        <textarea
                          value={feedbackValues[assignment.id] || ""}
                          onChange={(e) =>
                            handleFeedbackChange(assignment.id, e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Provide feedback..."
                          rows="2"
                          disabled={assignment.status === "upcoming"}
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => submitFeedback(assignment.id)}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            assignment.status !== "upcoming"
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          disabled={assignment.status === "upcoming"}
                        >
                          {assignment.status === "completed"
                            ? "Submitted"
                            : "Submit"}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {currentAssignments.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No assignments available for this module.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}