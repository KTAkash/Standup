import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function ModuleRoadmap({ onModuleClick }) {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentModule, setCurrentModule] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized. Please log in again.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/su/student/modules", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(``);
        }

        const data = await response.json();
        setModules(data.modules || []);
        setCurrentModule(data.currentModule || null);
      } catch (error) {
        error("");
        console.error(" ");
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleModuleClick = (moduleId) => {
    if (onModuleClick && typeof onModuleClick === 'function') {
      onModuleClick(moduleId);
    }
  };

  const sampleModules = [
    { id: 1, name: "Module 1", status: "completed" },
    { id: 2, name: "Module 2", status: "completed" },
    { id: 3, name: "Module 3", status: "current" },
    { id: 4, name: "Module 4", status: "locked" },
    { id: 5, name: "Module 5", status: "locked" },
    { id: 6, name: "Module 6", status: "locked" },
    { id: 7, name: "Module 7", status: "locked" },
    { id: 8, name: "Module 8", status: "locked" },
    { id: 9, name: "Module 9", status: "locked" },
  ];

  const displayModules = modules.length > 0 ? modules : sampleModules;

  if (isLoading) return <div className="text-center text-xl">Loading roadmap...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-200 opacity-20"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Decorative Shapes */}
      <div className="absolute -bottom-48 -left-48 w-96 h-96">
        <div className="triangle-clip-path bg-indigo-100/20 w-full h-full"></div>
      </div>

      <div className="relative max-w-4xl mx-auto z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border-2 border-blue-50 p-8">
          <h2 className="text-2xl text-blue-900 font-bold mb-8 text-center">Learning Journey Roadmap</h2>
          <p className="text-center text-gray-600 mb-8">Click on any module to view its assignments</p>

          <div className="relative pb-24">
            <svg
              className="absolute top-0 left-0 w-full h-full"
              style={{ zIndex: 0 }}
              viewBox="0 0 1000 700"
              preserveAspectRatio="none"
            >
              <path
                d="
                  M 50,40 
                  C 100,40 200,40 350,40 
                  L 650,40 
                  C 800,40 850,40 900,40
                  C 950,60 950,110 950,180
                  C 950,180 950,240 900,260
                  C 800,260 700,260 500,260
                  C 350,260 250,260 150,260
                  C 100,280 80,280 80,310
                  C 80,350 80,400 80,440
                  C 80,485 100,485 130,485
                  L 300,485
                  C 400,485 600,485 750,485
                  C 850,485 900,485 930,485
                  C 960,485 980,510 980,560
                  L 980,650
                "
                fill="none"
                stroke="#1E3A8A"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Start Point */}
            <div className="absolute top-2 left-0 -ml-4 flex items-center justify-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center shadow-lg z-10">
                <span className="text-white font-bold text-lg">Start</span>
              </div>
            </div>

            {/* Module Rows */}
            <div className="relative flex justify-between mb-40 z-10">
              <div className="flex-1 flex justify-center mt-14" />
              {displayModules.slice(0, 3).map((module) => (
                <div key={module.id} className="flex-1 flex justify-center">
                  <ModuleNode module={module} onClick={() => handleModuleClick(module.id)} />
                </div>
              ))}
            </div>

            <div className="relative flex justify-between mb-40 z-10">
              {displayModules.slice(3, 6).reverse().map((module) => (
                <div key={module.id} className="flex-1 flex justify-center">
                  <ModuleNode module={module} onClick={() => handleModuleClick(module.id)} />
                </div>
              ))}
              <div className="flex-1 flex justify-center" />
            </div>

            <div className="relative flex justify-between mb-24 z-10">
              <div className="flex-1 flex justify-center" />
              {displayModules.slice(6, 9).map((module) => (
                <div key={module.id} className="flex-1 flex justify-center">
                  <ModuleNode module={module} onClick={() => handleModuleClick(module.id)} />
                </div>
              ))}
            </div>

            {/* End Point */}
            <div className="absolute bottom-0 right-0 -mb-4 -mr-5 flex items-center justify-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg z-10">
                <span className="text-white font-bold text-lg">End</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .triangle-clip-path {
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          }
          .donut-shape {
            border-style: solid;
            border-color: transparent;
            border-top-color: #bfdbfe;
            border-right-color: #bfdbfe;
          }
          @keyframes float {
            0% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(5deg);
            }
            100% {
              transform: translateY(0) rotate(0deg);
            }
          }
        `}
      </style>
    </div>
  );
}

function ModuleNode({ module, onClick }) {
  let bgColor = "bg-gray-300";
  let textColor = "text-gray-600";
  let borderColor = "border-gray-400";
  let icon = "🔒";
  let cursorStyle = "cursor-not-allowed";

  if (module.status === "completed") {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
    borderColor = "border-green-500";
    icon = "✓";
    cursorStyle = "cursor-pointer";
  } else if (module.status === "current") {
    bgColor = "bg-blue-100";
    textColor = "text-blue-800";
    borderColor = "border-blue-500";
    icon = "▶";
    cursorStyle = "cursor-pointer";
  }

  const handleClick = () => {
    if (module.status !== "locked") {
      onClick();
    }
  };

  return (
    <div
      className={`w-20 h-20 ${bgColor} ${textColor} rounded-full border-4 ${borderColor} 
                 flex flex-col items-center justify-center ${cursorStyle} shadow-md
                 transition-transform transform hover:scale-110 z-20`}
      onClick={handleClick}
      title={module.status === "locked" ? "This module is locked" : `View ${module.name} assignments`}
    >
      <div className="text-lg font-bold">{icon}</div>
      <div className="text-sm font-medium">{module.name}</div>
    </div>
  );
}