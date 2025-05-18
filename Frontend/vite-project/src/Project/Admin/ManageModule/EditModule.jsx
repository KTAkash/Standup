import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditModule() {
  const { moduleId } = useParams(); // <-- use moduleId here
  const [moduleName, setModuleName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModule = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:8000/su/modules/${moduleId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch module");

        const data = await response.json();
        setModuleName(data.moduleName);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!moduleName.trim()) {
      toast.error("Module name cannot be empty");
      return;
    }

    const token = localStorage.getItem("token");
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:8000/su/modules/${moduleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ moduleName }),
      });

      if (!response.ok) throw new Error("Failed to update module");

      toast.success("Module updated successfully!");
      navigate("/manage-modules");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
    toast.info("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1E3A8A] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Module</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto p-6 max-w-xl">
        {isLoading ? (
          <div className="text-center text-blue-800 font-semibold animate-pulse">
            Loading module data...
          </div>
        ) : (
          <form
            onSubmit={handleUpdate}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
          >
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Module Name
              </label>
              <input
                type="text"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Enter module name"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Module"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
