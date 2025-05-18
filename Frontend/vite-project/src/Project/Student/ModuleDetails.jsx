import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ModuleDetails() {
  const { module: moduleId } = useParams();
  const navigate = useNavigate();
  const [moduleData, setModuleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized. Please log in again.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/su/student/module/${moduleId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch module details: ${errorText}`);
        }

        const data = await response.json();
        setModuleData(data);
      } catch (error) {
        toast.error("Error fetching module details.");
        console.error("Fetch Module Details Error:", error);
        
        // If API fails, use sample data for demo purposes
        setModuleData({
          id: moduleId,
          name: `Module ${moduleId}`,
          description: "This module covers essential concepts and principles needed for building a strong foundation in the subject matter.",
          status: moduleId <= 3 ? "unlocked" : "locked",
          completionPercentage: moduleId <= 2 ? 100 : moduleId == 3 ? 40 : 0,
          lessons: [
            { id: 1, title: "Introduction to Module", completed: true },
            { id: 2, title: "Core Concepts", completed: moduleId <= 2 },
            { id: 3, title: "Practical Applications", completed: moduleId <= 2 },
            { id: 4, title: "Advanced Topics", completed: false },
            { id: 5, title: "Final Assessment", completed: false },
          ],
          assignments: [
            { id: 101, title: "Assignment 1", status: moduleId <= 2 ? "completed" : "pending", grade: moduleId <= 2 ? "A" : null },
            { id: 102, title: "Assignment 2", status: moduleId <= 2 ? "completed" : "pending", grade: moduleId <= 2 ? "B+" : null },
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchModuleDetails();
  }, [moduleId, navigate]);

  const goBack = () => {
    navigate("/student");
  };

  if (isLoading) return <div className="text-center text-xl mt-8">Loading module details...</div>;

  if (!moduleData) return <div className="text-center text-xl mt-8">Module not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button 
          onClick={goBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Roadmap
        </button>

        {/* Module header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">{moduleData.name}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium 
                          ${moduleData.status === "unlocked" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
              {moduleData.status === "unlocked" ? "Available" : "Locked"}
            </span>
          </div>
          <p className="text-gray-600 mt-2">{moduleData.description}</p>
          
          {moduleData.status === "unlocked" && (
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-blue-600">{moduleData.completionPercentage}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${moduleData.completionPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Module content */}
        {moduleData.status === "unlocked" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lessons section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Lessons</h2>
              <ul className="space-y-3">
                {moduleData.lessons.map((lesson) => (
                  <li key={lesson.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 
                                   ${lesson.completed ? "bg-green-500 text-white" : "bg-gray-200"}`}>
                      {lesson.completed ? "✓" : ""}
                    </span>
                    <span className={lesson.completed ? "text-gray-800" : "text-gray-500"}>
                      {lesson.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Assignments section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Assignments</h2>
              <ul className="space-y-4">
                {moduleData.assignments.map((assignment) => (
                  <li key={assignment.id} className="border-b pb-3 last:border-b-0">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{assignment.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium 
                                    ${assignment.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {assignment.status}
                      </span>
                    </div>
                    {assignment.grade && (
                      <div className="mt-1 text-sm">
                        Grade: <span className="font-semibold">{assignment.grade}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700">This module is currently locked</h2>
            <p className="text-gray-500 mt-2">Complete previous modules to unlock this content.</p>
          </div>
        )}
      </div>
    </div>
  );
}