import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function ManageAssignment() {
  const [assignments, setAssignments] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchAssignments = async () => {
    try {
      const response = await fetch("http://localhost:8000/su/assignments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }

      const data = await response.json();
      setAssignments(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/su/assignment/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete assignment");
      }

      setAssignments(assignments.filter((a) => a.id !== id));
      toast.success("Assignment deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (assignment) => {
    setEditData(assignment);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8000/su/assignment/${editData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("Failed to update assignment");
      }

      const updated = await response.json();
      setAssignments(assignments.map((a) => (a.id === updated.id ? updated : a)));
      toast.success("Assignment updated");
      setEditData(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Assignments</h2>
        {isLoading ? (
          <p>Loading assignments...</p>
        ) : (
          <ul className="space-y-4">
            {assignments.map((assignment) => (
              <li key={assignment.id} className="border p-4 rounded shadow-sm bg-gray-50">
                {editData?.id === assignment.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      name="title"
                      value={editData.title}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      name="description"
                      value={editData.description}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="number"
                      name="creditMarks"
                      value={editData.creditMarks}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditData(null)}
                        className="px-4 py-2 bg-gray-300 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold">{assignment.title}</h3>
                    <p>{assignment.description}</p>
                    <p className="text-sm text-gray-600">Credit Marks: {assignment.creditMarks}</p>
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
