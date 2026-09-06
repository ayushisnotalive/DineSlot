import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { isAxiosError } from "axios";

export default function AdminPromote() {
  const { accessToken } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post(
        "/admin/promote",
        { email },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setMessage(`${res.data.user.email} promoted to owner.`);
      setEmail("");
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to promote user.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-serif mb-6">Promote User to Owner</h1>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border border-gray-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-terracotta-600)] text-white py-3 rounded-lg"
        >
          {loading ? "Promoting..." : "Promote to Owner"}
        </button>
      </form>
    </div>
  );
}