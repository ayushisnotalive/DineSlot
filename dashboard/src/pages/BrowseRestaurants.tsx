import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

interface Restaurant {
  id: string;
  name: string;
  address: string;
}

export default function BrowseRestaurants() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/restaurants")
      .then((res) => setRestaurants(res.data.restaurants))
      .catch(() => setError("Failed to load restaurants."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fbf9f6]">
      <nav className="bg-white border-b border-gray-100 shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-serif text-gray-900 tracking-tight">DineSlot</div>

          <div className="flex items-center gap-6">
            {user?.role === "admin" && (
              <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-[var(--color-terracotta-600)]">
                Admin Panel
              </Link>
            )}
            {user?.role === "owner" && (
              <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-[var(--color-terracotta-600)]">
                Owner Dashboard
              </Link>
            )}
            {user && (
              <Link to="/my-bookings" className="text-sm font-medium text-gray-600 hover:text-[var(--color-terracotta-600)]">
                My Bookings
              </Link>
            )}
            {!user && (
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-[var(--color-terracotta-600)]">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

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
      </div>
    </div>
  );
}