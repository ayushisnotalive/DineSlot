// src/pages/BookTable.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { isAxiosError } from "axios";

export default function BookTable() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [typeOfTable, setTypeOfTable] = useState("standard");
  const [bookingClass, setBookingClass] = useState("regular");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const startISO = new Date(`${date}T${startTime}`).toISOString();
      const endISO = new Date(`${date}T${endTime}`).toISOString();

      await api.post("/booking/createBookings", {
        resource_id: resourceId,
        start_time: startISO,
        end_time: endISO,
        type_of_table: typeOfTable,
        booking_class: bookingClass,
      });
      setSuccess(true);
      setTimeout(() => navigate("/my-bookings"), 2000);
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to book table.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-serif mb-2">Booking Requested</h1>
        <p className="text-gray-500">
          The restaurant will confirm your booking shortly. You'll get an email either way. Redirecting you to your bookings...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-serif mb-6">Book This Table</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border border-gray-200"
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border border-gray-200"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border border-gray-200"
        />
        <select
          value={typeOfTable}
          onChange={(e) => setTypeOfTable(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-200"
        >
          <option value="standard">Standard</option>
          <option value="window-side">Window-side</option>
          <option value="outdoor">Outdoor</option>
          <option value="booth">Booth</option>
        </select>
        <select
          value={bookingClass}
          onChange={(e) => setBookingClass(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-200"
        >
          <option value="regular">Regular</option>
          <option value="premium">Premium</option>
        </select>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[var(--color-terracotta-600)] text-white py-3 rounded-lg"
        >
          {submitting ? "Booking..." : "Request Booking"}
        </button>
      </form>
    </div>
  );
}