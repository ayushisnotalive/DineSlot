import { Link } from "react-router-dom";

export default function LandingChoice() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf9f6] p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-serif text-gray-900 mb-2">Welcome to DineSlot</h1>
        <p className="text-gray-500 mb-12">Choose how you'd like to continue</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-serif mb-2">Customer</h2>
            <p className="text-gray-500 text-sm mb-4">Browse restaurants and book a table</p>
            <div className="flex flex-col gap-2">
              <Link to="/login?as=customer" className="text-sm text-[var(--color-terracotta-600)] font-medium">Sign In</Link>
              <Link to="/signup?as=customer" className="text-sm text-gray-500 underline">Sign Up</Link>
            </div>
          </div>

          <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-serif mb-2">Restaurant Owner</h2>
            <p className="text-gray-500 text-sm mb-4">Manage your restaurant and bookings</p>
            <div className="flex flex-col gap-2">
              <Link to="/login?as=owner" className="text-sm text-[var(--color-terracotta-600)] font-medium">Sign In</Link>
              <Link to="/signup?as=owner" className="text-sm text-gray-500 underline">Sign Up</Link>
            </div>
          </div>

          <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-serif mb-2">Admin</h2>
            <p className="text-gray-500 text-sm mb-4">Manage platform users and roles</p>
            <Link to="/login?as=admin" className="text-sm text-[var(--color-terracotta-600)] font-medium">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}