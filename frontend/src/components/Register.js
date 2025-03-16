import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const { user, login } = useAuth();
  // const location = useLocation();
  // const from = location.state?.from?.pathname || "/";

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // If user is already logged in, don't render the registration form
  if (user) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setErrors([]);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the Terms of Service and Privacy Policy");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/v1/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        login(response.data.user);
        navigate('/', { replace: true });
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setError(error.response?.data?.message || "An error occurred during registration");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google signup success:", credentialResponse);
    // Add your Google signup success handling here
  };

  const handleGoogleError = () => {
    console.log("Google signup failed");
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
            <p className="text-gray-400 mt-2">Create your collector's account</p>
          </div>

          {/* Auth Tabs */}
          <div className="flex gap-4 mb-8">
            <Link 
              to="/login"
              className="flex-1 py-3 bg-zinc-800 rounded-xl font-bold text-gray-400 hover:text-white transition-colors text-center"
            >
              Sign In
            </Link>
            <button className="flex-1 py-3 bg-zinc-800 rounded-xl font-bold text-red-500 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-red-500">
              Sign Up
            </button>
          </div>

          {/* Social Signup */}
          <div className="space-y-4 mb-8">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              size="large"
              text="signup_with"
              shape="pill"
              width="100%"
            />
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-zinc-800"></div>
            <span className="text-gray-400">or</span>
            <div className="flex-1 h-px bg-zinc-800"></div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-400">
                Full Name
              </label>
              <div className="relative">
                <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 rounded-xl py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                Email
              </label>
              <div className="relative">
                <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 rounded-xl py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your email"
                  required
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 rounded-xl py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400">
                Confirm Password
              </label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 rounded-xl py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-600 text-red-500 focus:ring-red-500 bg-zinc-800"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-400">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-4">
                {error}
              </div>
            )}

            {errors.length > 0 && (
              <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-4">
                <ul className="list-disc list-inside">
                  {errors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-red-500 hover:bg-red-600 rounded-xl font-bold transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Create Account"}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-400">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-red-500 hover:text-red-400">
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-8 text-center text-xs text-gray-400">
            By creating an account, you agree to our{" "}
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

export default Register; 