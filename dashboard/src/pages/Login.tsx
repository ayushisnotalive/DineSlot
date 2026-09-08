import { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import api from '../api';
import { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;
  const [searchParams] = useSearchParams();
  const asRole = searchParams.get('as') || 'customer';

  const { setAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.accessToken;

      // login.ts's response doesn't include role, so fetch it once via /me.
      // (api.ts's request interceptor won't see this token yet since it
      // hasn't been pushed into context/api.ts state — pass it explicitly.)
      const meRes = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = meRes.data.user ?? meRes.data;

      setAuth(token, user);

      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'owner') {
        navigate('/dashboard');
      } else {
        navigate('/browse');
      }
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Invalid email or password');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif text-gray-900 mb-2 tracking-tight capitalize">{asRole} Sign In</h1>
          <p className="text-gray-500 text-sm tracking-wide">Sign in to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-4 bg-[var(--color-terracotta-600)] text-white text-sm font-medium rounded-lg"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {asRole !== 'admin' && (
          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to={`/signup?as=${asRole}`} className="text-[var(--color-terracotta-600)] font-medium underline">
              Create one here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}