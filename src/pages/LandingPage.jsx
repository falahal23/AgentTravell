import React from "react";
import { Link } from "react-router-dom";
import {
  FaPlane,
  FaStar,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";

export default function LandingPage() {
  const destinations = [
    {
      name: "Bali",
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      rating: 4.9,
      location: "Indonesia",
    },
    {
      name: "Tokyo",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
      rating: 4.8,
      location: "Japan",
    },
    {
      name: "Paris",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      rating: 4.9,
      location: "France",
    },
    {
      name: "Dubai",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
      rating: 4.7,
      location: "UAE",
    },
  ];

  return (
    <div className="bg-white">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div className="flex items-center gap-2">
            <FaPlane className="text-sky-500 text-2xl" />
            <h1 className="text-2xl font-bold text-slate-800">
              TravelGo
            </h1>
          </div>

          <div className="hidden md:flex gap-8 font-medium text-slate-700">
            <a href="#home">Home</a>
            <a href="#destination">Destinations</a>
            <a href="#reviews">Reviews</a>
            <a href="#footer">Contact</a>
          </div>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-5 py-2 rounded-full border border-sky-500 text-sky-500"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2 rounded-full bg-sky-500 text-white"
            >
              Register
            </Link>
          </div>

        </div>
      </nav>

      {/* HERO */}
      <section
        id="home"
        className="h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            Explore The World
          </h1>

          <p className="text-xl max-w-2xl mx-auto mb-8">
            Discover amazing destinations and unforgettable
            adventures around the globe.
          </p>

          <div className="flex justify-center gap-4">
            <button className="bg-sky-500 hover:bg-sky-600 px-8 py-4 rounded-full font-semibold">
              Explore Now
            </button>

            <Link
              to="/register"
              className="bg-white text-slate-800 px-8 py-4 rounded-full font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

          <div>
            <h2 className="text-4xl font-bold text-sky-500">
              50K+
            </h2>
            <p>Happy Travelers</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-sky-500">
              100+
            </h2>
            <p>Destinations</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-sky-500">
              15+
            </h2>
            <p>Countries</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-sky-500">
              4.9
            </h2>
            <p>Rating</p>
          </div>

        </div>
      </section>

      {/* DESTINATION */}
      <section
        id="destination"
        className="py-20 max-w-7xl mx-auto px-6"
      >
        <h2 className="text-4xl font-bold text-center mb-12">
          Popular Destinations
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {destinations.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:-translate-y-2 transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-60 w-full object-cover"
              />

              <div className="p-5">
                <div className="flex justify-between">
                  <h3 className="font-bold text-xl">
                    {item.name}
                  </h3>

                  <span className="flex items-center text-yellow-500">
                    <FaStar />
                    <span className="ml-1">
                      {item.rating}
                    </span>
                  </span>
                </div>

                <p className="flex items-center gap-2 text-gray-500 mt-2">
                  <FaMapMarkerAlt />
                  {item.location}
                </p>

                <button className="w-full mt-5 bg-sky-500 text-white py-3 rounded-xl">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEW */}
      <section
        id="reviews"
        className="py-20 bg-slate-50"
      >
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-4xl font-bold mb-10">
            Traveler Reviews
          </h2>

          <div className="bg-white rounded-3xl p-10 shadow-lg">

            <div className="text-yellow-500 text-2xl mb-4">
              ⭐⭐⭐⭐⭐
            </div>

            <p className="text-xl italic">
              "The best travel experience ever. Everything
              was perfectly organized."
            </p>

            <h4 className="mt-5 font-bold">
              Budi Santoso
            </h4>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-sky-500 text-white text-center">
        <h2 className="text-5xl font-bold mb-4">
          Ready For Your Next Journey?
        </h2>

        <p className="mb-8">
          Join thousands of travelers today.
        </p>

        <Link
          to="/register"
          className="bg-white text-sky-500 px-8 py-4 rounded-full font-bold"
        >
          Register Now
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        id="footer"
        className="bg-slate-900 text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">

          <div>
            <h3 className="text-2xl font-bold mb-3">
              TravelGo
            </h3>

            <p>
              Explore the world with unforgettable
              experiences.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3">
              Quick Links
            </h4>

            <p>Home</p>
            <p>Destinations</p>
            <p>Reviews</p>
            <p>Contact</p>
          </div>

          <div>
            <h4 className="font-bold mb-3">
              Contact
            </h4>

            <p>travelgo@gmail.com</p>
            <p>+62 812 3456 7890</p>
          </div>

          <div>
            <h4 className="font-bold mb-3">
              Follow Us
            </h4>

            <div className="flex gap-4 text-2xl">
              <FaFacebook />
              <FaInstagram />
              <FaTiktok />
            </div>
          </div>

        </div>

        <div className="text-center mt-10 border-t border-slate-700 pt-5">
          © 2026 TravelGo. All Rights Reserved.
        </div>
      </footer>

    </div>
  );
}