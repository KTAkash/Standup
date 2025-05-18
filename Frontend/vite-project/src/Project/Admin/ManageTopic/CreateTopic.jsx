import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateTopic() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [topicName, setTopicName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/su/topics/module/${moduleId}`,
        { topicName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Topic created successfully");
      navigate(`/manage-topics/${moduleId}`);
    } catch (err) {
      alert("Failed to create topic");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Topic for Module {moduleId}</h2>
      <form onSubmit={handleCreate}>
        <label className="block mb-2 font-medium">Topic Name</label>
        <input
          type="text"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          required
          className="w-full border p-2 mb-4 rounded"
          placeholder="Enter topic name"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Topic"}
        </button>
      </form>
    </div>
  );
}
