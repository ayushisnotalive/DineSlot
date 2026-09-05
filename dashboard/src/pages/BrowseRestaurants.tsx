// src/pages/BrowseRestaurants.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

interface Restaurant {
  id: string;
  name: string;
  address: string;
}

export default function BrowseRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/public/restaurants")
      .then((res) => setRestaurants(res.data.restaurants))
      .catch(() => setError("Failed to load restaurants."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-serif mb-6">Find a Table</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="space-y-3">
        {restaurants.map((r) => (
          <Link
            key={r.id}
            to={`/browse/${r.id}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-[var(--color-terracotta-400)] transition-colors"
          >
            <h2 className="font-medium">{r.name}</h2>
            <p className="text-gray-500 text-sm">{r.address}</p>
          </Link>
        ))}
      </div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Find a Table</h1>
        <Link to="/login" className="text-sm text-[var(--color-terracotta-600)]">
            Restaurant owner? Sign in
        </Link>
       </div>
    </div>
  );
}