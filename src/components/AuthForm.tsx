import { useState } from 'react';
import { LogIn, Loader2, Mail, Lock } from 'lucide-react';
import {
  useAuth,
  STATIC_LOGIN_EMAIL,
  STATIC_LOGIN_PASSWORD,
} from '../contexts/AuthContext';

export function AuthForm() {
  const [email, setEmail] = useState(STATIC_LOGIN_EMAIL);
  const [password, setPassword] = useState(STATIC_LOGIN_PASSWORD);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess('Login successful. Redirecting to dashboard...');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail(STATIC_LOGIN_EMAIL);
    setPassword(STATIC_LOGIN_PASSWORD);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Department Manager
            </h1>

            <p className="text-slate-600 mt-2">
              Login with the static account to open the dashboard
            </p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-blue-700 mb-2">Demo Login</p>
            <p>
              <span className="font-medium">Email:</span> {STATIC_LOGIN_EMAIL}
            </p>
            <p>
              <span className="font-medium">Password:</span> {STATIC_LOGIN_PASSWORD}
            </p>

            <button
              type="button"
              onClick={fillDemoCredentials}
              className="mt-3 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Use Demo Credentials
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login to Dashboard
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}