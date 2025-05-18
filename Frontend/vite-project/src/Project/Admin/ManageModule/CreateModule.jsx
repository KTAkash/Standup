import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateModule() {
  const [moduleName, setModuleName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!moduleName.trim()) {
      toast.error("Module name cannot be empty");
      return;
    }

    const token = localStorage.getItem("token");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/su/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ moduleName }),
      });

      if (!response.ok) throw new Error("Failed to create module");

      toast.success("Module created successfully!");
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
          <h1 className="text-2xl font-bold">Create Module</h1>
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
        <form
          onSubmit={handleCreate}
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
            {isSubmitting ? "Creating..." : "Create Module"}
          </button>
        </form>
      </main>
    </div>
  );
}
