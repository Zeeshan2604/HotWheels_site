import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  // const location = useLocation();
  // const from = location.state?.from?.pathname || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // If user is already logged in, don't render the login form
  if (user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/v1/auth/login", {
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

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/v1/auth/google", {
        credential: credentialResponse.credential
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        login(response.data.user);
        navigate('/', { replace: true });
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred during Google login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.log("Google login failed");
  };

  return (
    <section id="authentication" className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-12">
            <Link to="/">
              <h2 className="text-3xl font-bold">
                HotWheels<span className="text-red-500">X</span>
              </h2>
            </Link>
            <p className="text-gray-400 mt-2">Join the collector's community</p>
          </div>

          {/* Auth Tabs */}
          <div className="flex gap-4 mb-8">
            <button className="flex-1 py-3 bg-zinc-800 rounded-xl font-bold text-red-500 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-red-500">
              Sign In
            </button>
            <Link 
              to="/register" 
              className="flex-1 py-3 bg-zinc-800 rounded-xl font-bold text-gray-400 hover:text-white transition-colors text-center"
            >
              Sign Up
            </Link>
          </div>

          {/* Social Login */}
          <div className="space-y-4 mb-8">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              size="large"
              text="continue_with"
              shape="pill"
              width="100%"
            />
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-zinc-800"></div>
            <span className="text-gray-400">or</span>
            <div className="flex-1 h-px bg-zinc-800"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                Email
              </label>
              <div className="relative">
                <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-800 rounded-xl py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                Password
              </label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-800 rounded-xl py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your password"
                />
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
              <button type="button" className="text-sm text-red-500 hover:text-red-400">
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-red-500 hover:bg-red-600 rounded-xl font-bold transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-400">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="text-red-500 hover:text-red-400">
                Create account
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-8 text-center text-xs text-gray-400">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-white hover:text-gray-300">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-white hover:text-gray-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login; 