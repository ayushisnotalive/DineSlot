import { useNavigate } from 'react-router-dom';
import api from '../api';
export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        await api.post(
            `/api/auth/logout`,
            {},
            { withCredentials: true }
        );

        navigate("/login");
    } catch (err) {
        console.error(err);
    }
};

  return (
    <div className="min-h-screen bg-[#fbf9f6]">
      {/* Navbar Placeholder */}
      <nav className="bg-white border-b border-gray-100 shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-serif text-gray-900 tracking-tight">DineSlot</div>
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-gray-600 hover:text-[var(--color-terracotta-600)] transition-colors duration-200"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* Main Content Placeholder */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-12 border border-gray-50">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-serif text-gray-900 mb-4">Welcome to your Dashboard</h1>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              Your restaurant's table management system is ready. Soon, you'll be able to view reservations, manage tables, and configure your floor plan here.
            </p>
            <div className="inline-flex items-center justify-center px-6 py-3 bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-700)] rounded-lg text-sm font-medium border border-[var(--color-terracotta-100)]">
              Dashboard content coming soon
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
