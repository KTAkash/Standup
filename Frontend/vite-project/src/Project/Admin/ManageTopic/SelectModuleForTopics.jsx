import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function SelectModuleForTopics() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/su/modules", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data)) {
          setModules(res.data);
        } else {
          console.error("API returned non-array:", res.data);
          setModules([]);
        }
      } catch (err) {
        alert("Failed to load modules");
        console.error(err);
      }
    };
    fetchModules();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Select a Module to Manage Topics</h2>
      {modules.length === 0 ? (
        <p>No modules available.</p>
      ) : (
        <ul className="space-y-4">
          {modules.map((mod) => (
            <li
              key={mod.id}
              className="flex justify-between items-center border p-4 rounded-md shadow hover:shadow-md transition"
            >
              <div className="font-semibold text-lg text-gray-800">{mod.moduleName}</div>
              <div className="flex gap-3">
                <Link
                  to={`/manage-topics/${mod.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Manage Topics
                </Link>
                <Link
                  to={`/create-topic/${mod.id}`}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Create Topic
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
