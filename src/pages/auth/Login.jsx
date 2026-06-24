import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaPlane, FaEnvelope, FaLock } from "react-icons/fa";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

import { supabase } from "../../lib/supabase";

const backgroundImageUrl =
  "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=1920&auto=format&fit=crop";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: dataForm.email.trim(),
        password: dataForm.password,
      });

      if (error) {
        throw error;
      }

      // Check if email exists in kontak table (which maps to customer/member)
      const { data: kontakData, error: kontakErr } = await supabase
        .from("kontak")
        .select("id_customer")
        .eq("email", dataForm.email.trim())
        .maybeSingle();

      if (kontakErr) {
        console.error("Error checking user role:", kontakErr);
      }

      if (kontakData) {
        // User is a member
        localStorage.setItem("member_user", JSON.stringify(data.user));
        localStorage.setItem("member_session", JSON.stringify(data.session));
        localStorage.removeItem("user");
        localStorage.removeItem("session");
        navigate("/member/dashboard");
      } else {
        // User is an admin
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("session", JSON.stringify(data.session));
        localStorage.removeItem("member_user");
        localStorage.removeItem("member_session");
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center font-sans relative px-4"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 bg-white/20 backdrop-blur-xl border border-white/20 p-10 rounded-[40px] w-full max-w-lg shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <FaPlane className="text-white text-6xl mb-4" />

          <h1 className="text-5xl font-black text-white tracking-tight">
            TravelGo
          </h1>

          <p className="text-white/80 mt-3 text-center">
            Explore your dream destination
          </p>
        </div>

        {error && (
          <div className="bg-red-500/80 border border-red-400 mb-6 p-4 text-sm text-white rounded-2xl flex items-center">
            <BsFillExclamationDiamondFill className="me-3 text-xl shrink-0" />
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block text-white font-semibold mb-2">
              Email
            </label>

            <div className="relative">
              <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60 text-lg" />

              <input
                type="email"
                name="email"
                value={dataForm.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-14 pr-5 py-4 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">
              Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60 text-lg" />

              <input
                type="password"
                name="password"
                value={dataForm.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-14 pr-5 py-4 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition active:scale-95 flex justify-center items-center disabled:opacity-70"
          >
            {loading ? (
              <>
                <ImSpinner2 className="animate-spin me-3 text-2xl" />
                Loading...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}