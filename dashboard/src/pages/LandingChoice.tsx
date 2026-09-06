import { Link } from "react-router-dom";

export default function LandingChoice() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf9f6] p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-serif text-gray-900 mb-2">Welcome to DineSlot</h1>
        <p className="text-gray-500 mb-12">Choose how you'd like to continue</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/login?as=customer"
            className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[var(--color-terracotta-400)] transition-colors"
          >
            <h2 className="text-xl font-serif mb-2">Customer</h2>
            <p className="text-gray-500 text-sm">Browse restaurants and book a table</p>
          </Link>

          <Link
            to="/login?as=owner"
            className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[var(--color-terracotta-400)] transition-colors"
          >
            <h2 className="text-xl font-serif mb-2">Restaurant Owner</h2>
            <p className="text-gray-500 text-sm">Manage your restaurant and bookings</p>
          </Link>

          <Link
            to="/login?as=admin"
            className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[var(--color-terracotta-400)] transition-colors"
          >
            <h2 className="text-xl font-serif mb-2">Admin</h2>
            <p className="text-gray-500 text-sm">Manage platform users and roles</p>
          </Link>
        </div>
      </div>
    </div>
  );
}