import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topicName, setTopicName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTopic = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8000/su/topics/${topicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopicName(res.data.topicName);
    } catch (err) {
      alert("Failed to fetch topic");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/su/topics/${topicId}`,
        { topicName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Topic updated successfully");
      navigate(-1);
    } catch (err) {
      alert("Failed to update topic");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTopic();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Topic</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleUpdate}>
          <label className="block mb-2 font-medium">Topic Name</label>
          <input
            type="text"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            required
            className="w-full border p-2 mb-4 rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Update Topic
          </button>
        </form>
      )}
    </div>
  );
}
