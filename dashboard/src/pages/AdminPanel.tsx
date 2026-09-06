import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminPanel() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = () => {
    api
      .get("/admin/users", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => setUsers(res.data.users))
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [accessToken]);

  const handleRoleChange = async (userId: string, role: string) => {
    setUpdatingId(userId);
    try {
      await api.patch(
        "/admin/users/role",
        { userId, role },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchUsers();
    } catch (err) {
      setError("Failed to update role.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif mb-6">Admin Panel</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b">
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Role</th>
            <th className="py-2">Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b text-sm">
              <td className="py-3">{u.name}</td>
              <td className="py-3">{u.email}</td>
              <td className="py-3 capitalize">{u.role}</td>
              <td className="py-3">
                <select
                  value={u.role}
                  disabled={updatingId === u.id}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="border border-gray-200 rounded px-2 py-1"
                >
                  <option value="customer">Customer</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}