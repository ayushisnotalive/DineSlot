// src/pages/MyBookings.tsx
import { useEffect, useState } from "react";
import api from "../api";
import { isAxiosError } from "axios";

interface Booking {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  resource_name: string;
  type_of_table: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = () => {
    api
      .get("/Booking/getbookings")
      .then((res) => setBookings(res.data.bookings))
      .catch(() => setError("Failed to load your bookings."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    setError("");
    try {
      await api.patch(`/cancel/bookings/${bookingId}/cancel`, {});
      fetchBookings();
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to cancel booking.");
      } else {
        setError("Failed to cancel booking.");
      }
    } finally {
      setCancellingId(null);
    }
  };

  const statusColor = (status: string) => {
    if (status === "confirmed") return "text-green-600";
    if (status === "cancelled") return "text-gray-400";
    return "text-amber-600"; // pending
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-serif mb-6">My Bookings</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
            <div>
              <h2 className="font-medium">{b.resource_name} · {b.type_of_table}</h2>
              <p className="text-gray-500 text-sm">
                {new Date(b.start_time).toLocaleString()} – {new Date(b.end_time).toLocaleTimeString()}
              </p>
              <p className={`text-sm font-medium capitalize ${statusColor(b.status)}`}>{b.status}</p>
            </div>
            {(b.status === "pending" || b.status === "confirmed") && (
              <button
                onClick={() => handleCancel(b.id)}
                disabled={cancellingId === b.id}
                className="text-red-600 text-sm hover:underline disabled:opacity-50"
              >
                {cancellingId === b.id ? "Cancelling..." : "Cancel"}
              </button>
            )}
          </div>
        ))}
      </div>

      {bookings.length === 0 && <p className="text-gray-500 mt-4">No bookings yet.</p>}
    </div>
  );
}