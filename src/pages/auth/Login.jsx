import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    FaPlane,
    FaEnvelope,
    FaLock
} from "react-icons/fa";

import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

// BACKGROUND IMAGE
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

    // HANDLE INPUT
    const handleChange = (evt) => {

        const { name, value } = evt.target;

        setDataForm({
            ...dataForm,
            [name]: value,
        });

    };

    // HANDLE SUBMIT
    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        axios
            .post("https://dummyjson.com/user/login", {

                // dummyjson memakai username
                username: dataForm.email,
                password: dataForm.password,

            })

            .then((response) => {

                if (response.status !== 200) {
                    setError(response.data.message);
                    return;
                }

                navigate("/");

            })

            .catch((err) => {

                if (err.response) {

                    setError(
                        err.response.data.message ||
                        "Terjadi kesalahan"
                    );

                } else {

                    setError(
                        err.message ||
                        "Terjadi kesalahan yang tidak diketahui"
                    );

                }

            })

            .finally(() => {
                setLoading(false);
            });

    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center font-sans relative px-4"
            style={{
                backgroundImage: `url(${backgroundImageUrl})`
            }}
        >

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* LOGIN CARD */}
            <div className="relative z-10 bg-white/20 backdrop-blur-xl border border-white/20 p-10 rounded-[40px] w-full max-w-lg shadow-2xl">

                {/* HEADER */}
                <div className="flex flex-col items-center mb-10">

                    <FaPlane className="text-white text-6xl mb-4" />

                    <h1 className="text-5xl font-black text-white tracking-tight">
                        TravelGo
                    </h1>

                    <p className="text-white/80 mt-3 text-center">
                        Explore your dream destination
                    </p>

                </div>

                {/* ERROR */}
                {error && (

                    <div className="bg-red-500/80 border border-red-400 mb-6 p-4 text-sm text-white rounded-2xl flex items-center">

                        <BsFillExclamationDiamondFill className="me-3 text-xl shrink-0" />

                        {error}

                    </div>

                )}

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* EMAIL */}
                    <div>

                        <label className="block text-white font-semibold mb-2">
                            Email / Username
                        </label>

                        <div className="relative">

                            <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60 text-lg" />

                            <input
                                type="text"
                                name="email"
                                value={dataForm.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-14 pr-5 py-4 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition"
                            />

                        </div>

                    </div>

                    {/* PASSWORD */}
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

                    {/* BUTTON */}
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