import React, { useState } from "react";
import { Link } from "react-router-dom"; // Pastikan react-router-dom terinstal
import { FaKey, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { ImSpinner2 } from "react-icons/im";

// Menggunakan background yang sama dengan Login/Register agar konsisten
const backgroundImageUrl = 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=1920&auto=format&fit=crop';

export default function Forgot() {
    // State untuk fungsi simulasi
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitted(false);

        // Simulasi pengiriman email selama 2.5 detik
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            // Anda bisa menambahkan logika untuk reset state atau redirect di sini
        }, 2500);
    };

    return (
        <div 
            className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center font-sans relative"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
            {/* Panel Forgot Password Glassmorphism */}
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 p-10 lg:p-12 rounded-3xl w-full max-w-lg shadow-xl mx-4 transition-all duration-500">
                
                {/* Ikon & Judul */}
                <div className="flex flex-col items-center mb-8">
                    <div className="p-4 bg-white/10 rounded-full border border-white/20 mb-4 shadow-inner">
                        <FaKey className="text-white text-5xl" />
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight text-center">
                        For get Password?
                    </h2>
                    
                    {/* Pesan dinamis berdasarkan state submitted */}
                    <p className={`text-base mt-3 font-medium text-center px-4 ${submitted ? 'text-emerald-300 bg-emerald-950/50 p-3 rounded-xl border border-emerald-500' : 'text-white/80'}`}>
                        {submitted 
                            ? `Reset link has been sent to ${email}. Please check your inbox!` 
                            : "Enter your email address and we'll send you a link to reset your password."}
                    </p>
                </div>

                {/* Formulir (Hanya muncul jika belum submitted) */}
                {!submitted && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Input Email Address */}
                        <div className="group">
                            <label htmlFor="email" className="block text-base font-semibold text-white mb-2 group-focus-within:text-blue-300">
                                Email Address
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xl" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your_email@example.com"
                                    required
                                    disabled={loading}
                                    className="w-full bg-white/10 border border-white/20 rounded-full pl-12 pr-6 py-3.5 text-base text-white placeholder:text-white/40 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/20 outline-none transition-all duration-300 disabled:opacity-60"
                                />
                            </div>
                        </div>

                        {/* Tombol Send Reset Link */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-full py-4 text-xl font-bold shadow-md shadow-blue-500/30 transition-all duration-300 active:scale-95 flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <ImSpinner2 className="animate-spin text-2xl" />
                                        Sending Link...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* Tombol Tambahan setelah sukses */}
                {submitted && (
                    <div className="pt-6">
                        <button 
                            onClick={() => setSubmitted(false)}
                            className="w-full bg-white/10 hover:bg-white/20 text-white rounded-full py-3.5 text-lg font-semibold border border-white/20 transition-all active:scale-95"
                        >
                            Resend Link
                        </button>
                    </div>
                )}

                {/* Tautan kembali ke Login */}
                <div className="mt-8 text-center border-t border-white/10 pt-6">
                    <Link to="/login" className="inline-flex items-center gap-2.5 text-blue-300 font-semibold hover:text-white transition-colors group">
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Back to Log in
                    </Link>
                </div>

            </div>
        </div>
    );
}