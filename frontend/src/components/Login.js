import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import { API_URL } from "../utils/getApiUrl";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
        email,
        password
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        login(response.data.user);
        navigate('/', { replace: true });
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold mb-2">
                HotWheels<span className="text-red-500">X</span>
            </h1>
            </Link>
          <p className="text-gray-400">Sign in to your collector's account</p>
          </div>

        {/* Auth Card */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8">
            <button className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold">
              Sign In
            </button>
            <Link 
              to="/register" 
              className="flex-1 py-3 bg-zinc-800 text-gray-400 hover:text-white rounded-xl font-bold text-center transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your email"
                autoComplete="username"
                required
                />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <i className="fa-regular fa-eye-slash"></i>
                  ) : (
                    <i className="fa-regular fa-eye"></i>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-600 text-red-500 focus:ring-red-500 bg-zinc-800"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <button type="button" className="text-sm text-red-500 hover:text-red-400 transition-colors">
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-red-500 hover:text-red-400 font-medium">
                Create one now
              </Link>
            </p>
          </div>
          </div>

          {/* Terms */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-gray-400 hover:text-white">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login; 