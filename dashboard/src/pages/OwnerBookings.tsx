// src/pages/OwnerBookings.tsx
import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

interface Booking {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  resource_name: string;
  type_of_table: string;
  restaurant_name: string;
  customer_name: string;
  customer_email: string;
}

export default function OwnerBookings() {
  const { accessToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = () => {
    api
      .get("/bookings/owner", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => setBookings(res.data.bookings))
      .catch(() => setError("Failed to load bookings."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, [accessToken]);

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      await api.patch(
        `/cancel/bookings/${bookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchBookings(); // refresh list to show updated status
    } catch (err) {
      setError("Failed to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif mb-6">Bookings</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b">
            <th className="py-2">Restaurant</th>
            <th className="py-2">Table</th>
            <th className="py-2">Customer</th>
            <th className="py-2">Time</th>
            <th className="py-2">Status</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b text-sm">
              <td className="py-3">{b.restaurant_name}</td>
              <td className="py-3">{b.resource_name}</td>
              <td className="py-3">{b.customer_name}</td>
              <td className="py-3">
                {new Date(b.start_time).toLocaleString()} –{" "}
                {new Date(b.end_time).toLocaleTimeString()}
              </td>
              <td className="py-3 capitalize">{b.status}</td>
              <td className="py-3">
                {b.status !== "cancelled" && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    disabled={cancellingId === b.id}
                    className="text-red-600 text-sm hover:underline disabled:opacity-50"
                  >
                    {cancellingId === b.id ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {bookings.length === 0 && <p className="text-gray-500 mt-4">No bookings yet.</p>}
    </div>
  );
}