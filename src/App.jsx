import React, { Suspense } from "react";
import "./assets/tailwind.css";
import Loading from "./components/Loading";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// PAGES
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Customers = React.lazy(() => import("./pages/Customers"));
const DataKontak = React.lazy(() => import("./pages/DataKontak"));
const DetailKontak = React.lazy(() => import("./pages/DetailKontak"));
const Membership = React.lazy(() => import("./pages/Membership"));
const RiwayatInteraksi = React.lazy(() => import("./pages/RiwayatInteraksi"));
const DataTransaksi = React.lazy(() => import("./pages/DataTransaksi"));
const DetailTransaksi = React.lazy(() => import("./pages/DetailTransaksi"));
const LaporanTransaksi = React.lazy(() => import("./pages/LaporanTransaksi"));
const AktivitasUser = React.lazy(() => import("./pages/AktivitasUser"));
const DetailAktivitas = React.lazy(() => import("./pages/DetailAktivitas"));
const Marketing = React.lazy(() => import("./pages/Marketing"));
const DetailMarketing = React.lazy(() => import("./pages/DetailMarketing"));
const DetailInteraksi = React.lazy(() => import("./pages/DetailInteraksi"));
const DetailCustomer = React.lazy(() => import("./pages/DetailCustomer"));
const VerifikasiPembayaran = React.lazy(() =>
  import("./pages/VerifikasiPembayaran")
);
const KategoriPaket = React.lazy(() => import("./pages/KategoriPaket"));
const Testimoni = React.lazy(() => import("./pages/Testimoni"));

// PRODUCT
const Product = React.lazy(() => import("./pages/Products"));
const DetailProduct = React.lazy(() => import("./pages/DetailProducts"));
const ComponentsPage = React.lazy(() => import("./pages/Components"));

// AUTH
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

// ERROR
const ErrorPage = React.lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* AUTH */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        {/* ADMIN */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/data-kontak" element={<DataKontak />} />
          <Route path="/riwayat-interaksi" element={<RiwayatInteraksi />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/data-transaksi" element={<DataTransaksi />} />
          <Route path="/kategori-paket" element={<KategoriPaket />} />
          <Route path="/testimoni" element={<Testimoni />} />

          {/* CUSTOMERS MANAGEMENT */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<DetailCustomer />} />

          {/* TRANSAKSI */}
          <Route
            path="/verifikasi-pembayaran"
            element={<VerifikasiPembayaran />}
          />
          <Route path="/laporan-transaksi" element={<LaporanTransaksi />} />
          <Route path="/data-transaksi/:id" element={<DetailTransaksi />} />

          {/* AKTIVITAS */}
          <Route path="/aktivitas-user" element={<AktivitasUser />} />
          <Route path="/aktivitas-user/:id" element={<DetailAktivitas />} />

          {/* MARKETING */}
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/marketing/:id" element={<DetailMarketing />} />

          {/* INTERAKSI */}
          <Route path="/detail-interaksi/:id" element={<DetailInteraksi />} />

          {/* KONTAK */}
          <Route
            path="/DataKontak/DetailKontak/:id"
            element={<DetailKontak />}
          />

          {/* PRODUCT */}
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<DetailProduct />} />

          {/* COMPONENT */}
          <Route path="/components" element={<ComponentsPage />} />
        </Route>

        {/* ERROR */}
        <Route path="/error-400" element={<ErrorPage errorCode="400" />} />
        <Route path="/maintenance" element={<ErrorPage errorCode="401" />} />
        <Route path="/error-500" element={<ErrorPage errorCode="500" />} />
        <Route path="*" element={<ErrorPage errorCode="404" />} />
      </Routes>
    </Suspense>
  );
}

export default App;