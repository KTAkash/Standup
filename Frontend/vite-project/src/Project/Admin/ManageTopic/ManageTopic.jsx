import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ManageTopic() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [moduleName, setModuleName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTopics = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch module name
      const moduleRes = await axios.get(`http://localhost:8000/su/modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModuleName(moduleRes.data.moduleName);

      // Fetch topics
      const topicRes = await axios.get(`http://localhost:8000/su/topics/module/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopics(topicRes.data);
    } catch (err) {
      alert("Failed to load topics or module");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [moduleId]);

  const handleDelete = async (topicId) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/su/topics/${topicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Topic deleted");
      fetchTopics();
    } catch (err) {
      alert("Failed to delete topic");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        Manage Topics for Module: <span className="text-blue-700">{moduleName}</span>
      </h2>

      <Link
        to={`/create-topic/${moduleId}`}
        className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Create New Topic
      </Link>

      {loading ? (
        <p>Loading topics...</p>
      ) : topics.length === 0 ? (
        <p>No topics found for this module.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Topic Name</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{topic.id}</td>
                <td className="border border-gray-300 px-4 py-2">{topic.topicName}</td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <Link
                    to={`/edit-topic/${topic.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(topic.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Back
      </button>
    </div>
  );
}
