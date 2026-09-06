// src/pages/BrowseRestaurantTables.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

interface Resource {
  id: string;
  name: string;
  type_of_table: string;
  booking_class: string;
}

export default function BrowseRestaurantTables() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/public/resources?restaurant_id=${restaurantId}`)
      .then((res) => setResources(res.data.resources))
      .catch(() => setError("Failed to load tables."))
      .finally(() => setLoading(false));
  }, [restaurantId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-serif mb-6">Available Tables</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="space-y-3">
        {resources.map((r) => (
          <div key={r.id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
            <div>
              <h2 className="font-medium">{r.name}</h2>
              <p className="text-gray-500 text-sm">{r.type_of_table} · {r.booking_class}</p>
            </div>
            <button
              onClick={() => navigate(`/book/${r.id}`)}
              className="bg-[var(--color-terracotta-600)] text-white px-4 py-2 rounded-lg text-sm hover:bg-[var(--color-terracotta-700)] transition-colors"
            >
              Book
            </button>
          </div>
        ))}
      </div>
      {resources.length === 0 && <p className="text-gray-500 mt-4">No tables available.</p>}
    </div>
  );
}