import { Outlet, useLocation } from "react-router-dom";

import AdminPageSummary from "../components/AdminPageSummary";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RightPanel from "../components/RightPanel";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  const { pathname } = useLocation();
  const isDashboard = pathname === "/dashboard";
  const isDetailPage = [
    "/customers/",
    "/data-transaksi/",
    "/aktivitas-user/",
    "/marketing/",
    "/detail-interaksi/",
    "/DataKontak/DetailKontak/",
    "/product/",
  ].some((prefix) => pathname.startsWith(prefix));

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN WRAPPER */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* HEADER */}

        <Header />

        {/* BODY */}

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-[#F7F9FC] p-4 sm:p-6">
            <div className="mx-auto max-w-[1400px]">
              {!isDashboard && !isDetailPage && <AdminPageSummary />}
              <Outlet />
            </div>
          </main>

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
