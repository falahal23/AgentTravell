import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserPlus, FaEnvelope, FaLock } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { supabase } from "../../lib/supabase";

const backgroundImageUrl =
  "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=1920&auto=format&fit=crop";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError("Registrasi gagal!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center font-sans relative"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 bg-white/20 backdrop-blur-lg border border-white/30 p-10 lg:p-12 rounded-3xl w-full max-w-lg shadow-xl mx-4 my-8">

        <div className="flex flex-col items-center mb-8">
          <FaUserPlus className="text-white text-5xl mb-4" />

          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight text-center">
            Join TravelGo
          </h2>

          <p className="text-base text-white/80 mt-2 font-medium text-center">
            {success
              ? "Registration Successful! Redirecting..."
              : "Create your account to start exploring ✨"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/80 border border-red-400 text-white p-4 rounded-2xl mb-5 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/80 border border-green-400 text-white p-4 rounded-2xl mb-5 text-center">
            Registrasi berhasil! Mengalihkan ke halaman login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-base font-semibold text-white mb-2">
              Email Address
            </label>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xl" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-white/10 border border-white/20 rounded-full pl-12 pr-6 py-3.5 text-base text-white placeholder:text-white/40 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-white mb-2">
              Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xl" />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                minLength={6}
                className="w-full bg-white/10 border border-white/20 rounded-full pl-12 pr-6 py-3.5 text-base text-white placeholder:text-white/40 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-white mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xl" />

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                required
                className="w-full bg-white/10 border border-white/20 rounded-full pl-12 pr-6 py-3.5 text-base text-white placeholder:text-white/40 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-full py-4 text-xl font-bold shadow-md transition-all active:scale-95 flex justify-center items-center disabled:opacity-50"
            >
              {loading ? (
                <ImSpinner2 className="animate-spin text-2xl" />
              ) : success ? (
                "Account Created!"
              ) : (
                "Register Now"
              )}
            </button>
          </div>

        </form>

        <div className="mt-6 text-center">
          <p className="text-white/80">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-300 font-bold hover:text-white transition-colors"
            >
              Log in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}