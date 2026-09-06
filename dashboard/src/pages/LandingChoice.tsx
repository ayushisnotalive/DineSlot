import { Link } from "react-router-dom";

export default function LandingChoice() {
  return (
    <div className="min-h-screen bg-[#fbf9f6]">
      <nav className="px-6 py-6 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <span className="text-2xl font-serif text-gray-900 tracking-tight">DineSlot</span>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-20">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-5xl font-serif text-gray-900 mb-4 tracking-tight">
            Table booking, done right.
          </h1>
          <p className="text-gray-500 text-lg mb-16 max-w-xl mx-auto">
            Whether you're grabbing dinner, running a restaurant, or managing the platform — start here.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-[var(--color-terracotta-50)] flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🍽️</span>
              </div>
              <h2 className="text-xl font-serif text-gray-900 mb-2">Customer</h2>
              <p className="text-gray-500 text-sm mb-6">Browse restaurants and book a table in seconds</p>
              <div className="flex flex-col gap-2">
                <Link
                  to="/login?as=customer"
                  className="bg-[var(--color-terracotta-600)] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[var(--color-terracotta-700)] transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/signup?as=customer" className="text-sm text-gray-500 hover:text-[var(--color-terracotta-600)] transition-colors">
                  New here? Sign up
                </Link>
              </div>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-[var(--color-terracotta-50)] flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🏪</span>
              </div>
              <h2 className="text-xl font-serif text-gray-900 mb-2">Restaurant Owner</h2>
              <p className="text-gray-500 text-sm mb-6">Manage your tables and incoming bookings</p>
              <div className="flex flex-col gap-2">
                <Link
                  to="/login?as=owner"
                  className="bg-[var(--color-terracotta-600)] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[var(--color-terracotta-700)] transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/signup?as=owner" className="text-sm text-gray-500 hover:text-[var(--color-terracotta-600)] transition-colors">
                  New here? Sign up
                </Link>
              </div>
            </div>

            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">⚙️</span>
              </div>
              <h2 className="text-lg font-serif text-gray-700 mb-2">Admin</h2>
              <p className="text-gray-500 text-xs mb-6">Platform management</p>
              <Link
                to="/login?as=admin"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}