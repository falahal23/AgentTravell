import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import RightPanel from "../components/RightPanel";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden">
      {/* SIDEBAR */}

      <aside className="w-64 hidden lg:block bg-white border-r border-slate-100">
        <Sidebar />
      </aside>

      {/* MAIN WRAPPER */}

      <div className="flex flex-col flex-1 min-w-0">
        {/* HEADER */}

        <Header />

        {/* BODY */}

        <div className="flex flex-1 overflow-hidden">
          {/* CONTENT */}

          <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>

          {/* RIGHT PANEL */}

          <aside className="w-80 hidden xl:block bg-[#F8FAFC] border-l border-slate-100 overflow-y-auto p-6">
            <RightPanel />
          </aside>
        </div>

        {/* FOOTER */}

        <Footer />
      </div>
    </div>
  );
}
