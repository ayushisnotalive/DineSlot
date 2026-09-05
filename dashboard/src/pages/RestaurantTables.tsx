// src/pages/RestaurantTables.tsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

interface Resource {
  id: string;
  name: string;
  type_of_table: string;
  booking_class: string;
  created_at: string;
}

export default function RestaurantTables() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { accessToken } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [typeOfTable, setTypeOfTable] = useState("");
  const [bookingClass, setBookingClass] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchResources = async () => {
    try {
      const res = await api.get(`/restaurants/resources?restaurant_id=${restaurantId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setResources(res.data.resources);
    } catch (err) {
      setError("Failed to load tables.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [accessToken, restaurantId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post(
        "/resources",
        { restaurant_id: restaurantId, name, type_of_table: typeOfTable, booking_class: bookingClass },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setName("");
      setTypeOfTable("");
      setBookingClass("");
      fetchResources();
    } catch (err) {
      setError("Failed to add table.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-serif mb-6">Tables</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleCreate} className="mb-8 space-y-3 bg-gray-50 p-6 rounded-lg">
        <input
          type="text"
          placeholder="Table name (e.g. Table 4)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border border-gray-200"
        />
        <input
          type="text"
          placeholder="Type (e.g. window-side)"
          value={typeOfTable}
          onChange={(e) => setTypeOfTable(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border border-gray-200"
        />
        <input
          type="text"
          placeholder="Booking class (e.g. premium)"
          value={bookingClass}
          onChange={(e) => setBookingClass(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border border-gray-200"
        />
        <button
          type="submit"
          disabled={creating}
          className="bg-[var(--color-terracotta-600)] text-white px-4 py-2 rounded"
        >
          {creating ? "Adding..." : "Add Table"}
        </button>
      </form>

      <div className="space-y-3">
        {resources.length === 0 && <p>No tables yet.</p>}
        {resources.map((r) => (
          <div key={r.id} className="p-4 border border-gray-200 rounded-lg">
            <h2 className="font-medium">{r.name}</h2>
            <p className="text-gray-500 text-sm">{r.type_of_table} · {r.booking_class}</p>
            <Link to={`/restaurants/${r.id}/tables`} className="text-[var(--color-terracotta-600)] text-sm">
                View Tables →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}