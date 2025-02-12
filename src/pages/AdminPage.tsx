import { useState, useEffect } from "react";
import { kicksApi, type Sneaker } from "../services/api";
import { handleApiError } from "../services/errorUtils";
import Alert from "../components/Alert";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";

const AdminPage = () => {
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [editingSneaker, setEditingSneaker] = useState<Sneaker | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchSneakers();
  }, []);

  const fetchSneakers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await kicksApi.getAllKicks();
      setSneakers(response.data.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const newFormData = new FormData();
      newFormData.append("image", files[0]);
      setFormData(newFormData);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (editingSneaker) {
      setEditingSneaker({ ...editingSneaker, [name]: value });
    } else {
      formData.set(name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingSneaker) {
        await kicksApi.updateKick(editingSneaker.id, editingSneaker);
      } else {
        await kicksApi.addKick(formData);
      }
      fetchSneakers();
      setFormData(new FormData());
      setEditingSneaker(null);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this sneaker?"))
      return;
    try {
      setError(null);
      await kicksApi.deleteKick(id);
      fetchSneakers();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error">Access denied. Admin privileges required.</Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-mono-dark dark:text-mono-light mb-8">
        Sneaker Management
      </h1>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-12 space-y-4 max-w-xl">
        <h2 className="text-xl font-semibold text-mono-dark dark:text-mono-light">
          {editingSneaker ? "Edit Sneaker" : "Add New Sneaker"}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Sneaker Name"
            value={editingSneaker?.name || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg bg-mono-light-800 dark:bg-mono-dark-800 border-2 border-mono-light-400 dark:border-mono-dark-400 text-mono-dark dark:text-mono-light"
            required
          />

          <input
            type="text"
            name="price"
            placeholder="Price"
            value={editingSneaker?.price || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg bg-mono-light-800 dark:bg-mono-dark-800 border-2 border-mono-light-400 dark:border-mono-dark-400 text-mono-dark dark:text-mono-light"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={editingSneaker?.category || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg bg-mono-light-800 dark:bg-mono-dark-800 border-2 border-mono-light-400 dark:border-mono-dark-400 text-mono-dark dark:text-mono-light"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={editingSneaker?.description || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg bg-mono-light-800 dark:bg-mono-dark-800 border-2 border-mono-light-400 dark:border-mono-dark-400 text-mono-dark dark:text-mono-light"
            required
          />

          {!editingSneaker && (
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full"
              accept="image/*"
              required
            />
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark rounded-lg font-semibold hover:bg-mono-dark-800 dark:hover:bg-mono-light-800 transition-all duration-300 shadow-button hover:shadow-button-hover"
          >
            {editingSneaker ? "Update" : "Add"} Sneaker
          </button>
          {editingSneaker && (
            <button
              type="button"
              onClick={() => setEditingSneaker(null)}
              className="px-6 py-2 bg-mono-light-400 dark:bg-mono-dark-400 text-mono-dark dark:text-mono-light rounded-lg font-semibold hover:bg-mono-light-600 dark:hover:bg-mono-dark-600 transition-all duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Sneakers List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-mono-light-800 dark:bg-mono-dark-800 rounded-lg h-48"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sneakers.map((sneaker) => (
            <div
              key={sneaker.id}
              className="bg-mono-light-800 dark:bg-mono-dark-800 rounded-lg overflow-hidden border-2 border-mono-light-400 dark:border-mono-dark-400"
            >
              <img
                src={sneaker.image}
                alt={sneaker.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-mono-dark dark:text-mono-light">
                  {sneaker.name}
                </h3>
                <p className="text-mono-dark-600 dark:text-mono-light-600">
                  ${parseFloat(sneaker.price).toFixed(2)}
                </p>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => setEditingSneaker(sneaker)}
                    className="p-2 rounded-lg bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark hover:bg-mono-dark-800 dark:hover:bg-mono-light-800 transition-all duration-300"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(sneaker.id)}
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
