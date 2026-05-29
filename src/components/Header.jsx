import { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

export default function Header() {
  const [search, setSearch] = useState("");

  return (
    <header
      className="
            flex
            justify-between
            items-center
            px-8
            py-5
            bg-[#F8FAFC]
            "
    >
      {/* LEFT SECTION */}

      <div className="flex items-center gap-8 flex-1">
        <h1
          className="
                    text-xl
                    font-bold
                    text-slate-800
                    "
        >
          Dashboard
        </h1>

        {/* SEARCH */}

        <div className="relative w-full max-w-sm">
          <FiSearch
            className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        text-lg
                        "
          />

          <input
            type="text"
            placeholder="Search direction"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
                        w-full
                        bg-[#EBF0FA]
                        text-sm
                        text-slate-700
                        rounded-full
                        pl-11
                        pr-4
                        py-3
                        outline-none
                        focus:ring-2
                        focus:ring-blue-100
                        placeholder-slate-400
                        font-medium
                        "
          />
        </div>
      </div>

      {/* RIGHT SECTION */}

      <div className="flex items-center gap-6">
        {/* NOTIFICATION */}

        <button
          className="
                    relative
                    w-12
                    h-12
                    rounded-full
                    bg-white
                    shadow-sm
                    flex
                    items-center
                    justify-center
                    text-slate-600
                    "
        >
          <FaRegBell className="text-xl" />

          <span
            className="
                        absolute
                        top-3
                        right-3
                        w-2
                        h-2
                        bg-red-500
                        rounded-full
                        border
                        border-white
                        "
          />
        </button>

        {/* PROFILE */}

        <div
          className="
                    flex
                    items-center
                    gap-3
                    cursor-pointer
                    "
        >
          <div className="text-right">
            <h4
              className="
                            text-sm
                            font-bold
                            text-slate-800
                            "
            >
              Falahal
            </h4>

            <p
              className="
                            text-xs
                            text-slate-400
                            font-semibold
                            "
            >
              Admin
            </p>
          </div>

          <img
            src="/images/foto.png"
            alt="profile"
            className="
                        w-11
                        h-11
                        rounded-full
                        object-cover
                        bg-slate-200
                        "
          />
        </div>
      </div>
    </header>
  );
}
