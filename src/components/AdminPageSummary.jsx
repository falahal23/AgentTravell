import { useLocation } from "react-router-dom";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Boxes,
  CalendarCheck,
  ChartNoAxesCombined,
  ClipboardCheck,
  Contact,
  CreditCard,
  FolderKanban,
  Map,
  Megaphone,
  MessageSquareText,
  Package,
  ReceiptText,
  ShoppingCart,
  Star,
  UserCheck,
  Users,
} from "lucide-react";

import aktivitas from "../Data/AktivitasUser.json";
import bookings from "../Data/BookingData.json";
import customers from "../Data/customers.json";
import contacts from "../Data/DataKontak.json";
import transactions from "../Data/DataTransaksi.json";
import categories from "../Data/KategoriPaket.json";
import reports from "../Data/LaporanData.json";
import marketing from "../Data/Marketing.json";
import memberships from "../Data/Membership.json";
import orders from "../Data/orders.json";
import payments from "../Data/PembayaranData.json";
import products from "../Data/Products.json";
import interactions from "../Data/RiwayatInteraksi.json";
import testimonials from "../Data/TestimoniData.json";
import tours from "../Data/Wisatadata.json";

const countBy = (items, key, value) =>
  items.filter((item) => String(item[key]).toLowerCase() === value.toLowerCase())
    .length;

const sumBy = (items, key) =>
  items.reduce((total, item) => total + Number(item[key] || 0), 0);

const currencyCompact = (value) =>
  new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const config = ({
  title,
  subtitle,
  icon,
  firstLabel,
  firstValue,
  firstBadge,
  secondLabel,
  secondValue,
  secondBadge,
  thirdLabel,
  thirdValue,
  thirdBadge,
}) => ({
  title,
  subtitle,
  icon,
  stats: [
    { label: firstLabel, value: firstValue, badge: firstBadge },
    { label: secondLabel, value: secondValue, badge: secondBadge },
    { label: thirdLabel, value: thirdValue, badge: thirdBadge },
  ],
});

const cityCount = new Set(contacts.map((item) => item.kota)).size;
const provinceCount = new Set(contacts.map((item) => item.provinsi)).size;

const routeConfigs = {
  "/dashboard": config({
    title: "Dashboard Travel",
    subtitle: "Ringkasan performa operasional dan penjualan hari ini",
    icon: BarChart3,
    firstLabel: "Total Customer",
    firstValue: customers.length,
    firstBadge: "Users",
    secondLabel: "Total Transaksi",
    secondValue: transactions.length,
    secondBadge: "Trx",
    thirdLabel: "Total Pendapatan",
    thirdValue: `Rp ${currencyCompact(sumBy(transactions, "total_transaksi"))}`,
    thirdBadge: "IDR",
  }),
  "/paket-wisata": config({
    title: "Paket Wisata",
    subtitle: "Kelola destinasi, kuota, harga, dan jadwal perjalanan",
    icon: Map,
    firstLabel: "Total Paket",
    firstValue: tours.length,
    firstBadge: "Paket",
    secondLabel: "Paket Tersedia",
    secondValue: countBy(tours, "status", "Available"),
    secondBadge: "Ready",
    thirdLabel: "Total Booking",
    thirdValue: sumBy(tours, "booked"),
    thirdBadge: "Booked",
  }),
  "/kelola-booking": config({
    title: "Kelola Booking",
    subtitle: "Pantau seluruh reservasi perjalanan pelanggan",
    icon: CalendarCheck,
    firstLabel: "Total Booking",
    firstValue: bookings.length,
    firstBadge: "Qty",
    secondLabel: "Terkonfirmasi",
    secondValue: countBy(bookings, "status", "Confirmed"),
    secondBadge: "Valid",
    thirdLabel: "Menunggu",
    thirdValue: countBy(bookings, "status", "Pending"),
    thirdBadge: "Queue",
  }),
  "/kategori-paket": config({
    title: "Kategori Paket",
    subtitle: "Atur pengelompokan produk dan paket perjalanan",
    icon: FolderKanban,
    firstLabel: "Total Kategori",
    firstValue: categories.length,
    firstBadge: "Cat",
    secondLabel: "Paket Terhubung",
    secondValue: sumBy(categories, "totalPackages"),
    secondBadge: "Link",
    thirdLabel: "Kategori Aktif",
    thirdValue: categories.length,
    thirdBadge: "Active",
  }),
  "/testimoni": config({
    title: "Kelola Testimoni",
    subtitle: "Tinjau ulasan dan pengalaman perjalanan pelanggan",
    icon: Star,
    firstLabel: "Total Ulasan",
    firstValue: testimonials.length,
    firstBadge: "Review",
    secondLabel: "Dipublikasikan",
    secondValue: countBy(testimonials, "status", "Published"),
    secondBadge: "Live",
    thirdLabel: "Rating Rata-rata",
    thirdValue: (
      sumBy(testimonials, "rating") / Math.max(testimonials.length, 1)
    ).toFixed(1),
    thirdBadge: "Stars",
  }),
  "/orders": config({
    title: "Data Orders",
    subtitle: "Kelola pesanan dan status pemesanan pelanggan",
    icon: ShoppingCart,
    firstLabel: "Total Orders",
    firstValue: orders.length,
    firstBadge: "Order",
    secondLabel: "Selesai",
    secondValue: countBy(orders, "status", "Completed"),
    secondBadge: "Done",
    thirdLabel: "Nilai Pesanan",
    thirdValue: `Rp ${currencyCompact(sumBy(orders, "totalPrice"))}`,
    thirdBadge: "IDR",
  }),
  "/customers": config({
    title: "Data Customer",
    subtitle: `Total database terdaftar: ${customers.length} customer`,
    icon: Users,
    firstLabel: "Customer Ditemukan",
    firstValue: customers.length,
    firstBadge: "Qty",
    secondLabel: "Member Gold",
    secondValue: countBy(customers, "loyalty", "Gold"),
    secondBadge: "Gold",
    thirdLabel: "Member Aktif",
    thirdValue: memberships.length,
    thirdBadge: "Member",
  }),
  "/data-kontak": config({
    title: "Data Kontak Customer",
    subtitle: `Total database terdaftar: ${contacts.length} customer`,
    icon: Contact,
    firstLabel: "Kontak Ditemukan",
    firstValue: contacts.length,
    firstBadge: "Qty",
    secondLabel: "Cakupan Kota",
    secondValue: cityCount,
    secondBadge: "City",
    thirdLabel: "Total Provinsi",
    thirdValue: provinceCount,
    thirdBadge: "Prov",
  }),
  "/riwayat-interaksi": config({
    title: "Riwayat Interaksi",
    subtitle: "Pantau komunikasi, komplain, dan feedback pelanggan",
    icon: MessageSquareText,
    firstLabel: "Total Interaksi",
    firstValue: interactions.length,
    firstBadge: "Chat",
    secondLabel: "Feedback Positif",
    secondValue: countBy(interactions, "feedback", "Positif"),
    secondBadge: "Good",
    thirdLabel: "Feedback Negatif",
    thirdValue: countBy(interactions, "feedback", "Negatif"),
    thirdBadge: "Alert",
  }),
  "/membership": config({
    title: "Data Membership",
    subtitle: "Kelola level, status, dan masa aktif membership",
    icon: BadgeCheck,
    firstLabel: "Total Membership",
    firstValue: memberships.length,
    firstBadge: "Member",
    secondLabel: "Status Aktif",
    secondValue: countBy(memberships, "status_aktif", "Aktif"),
    secondBadge: "Active",
    thirdLabel: "Level Platinum",
    thirdValue: countBy(memberships, "level_membership", "Platinum"),
    thirdBadge: "Tier",
  }),
  "/data-transaksi": config({
    title: "Data Transaksi",
    subtitle: "Pantau transaksi, produk, dan metode pembayaran",
    icon: CreditCard,
    firstLabel: "Total Transaksi",
    firstValue: transactions.length,
    firstBadge: "Trx",
    secondLabel: "Nilai Transaksi",
    secondValue: `Rp ${currencyCompact(sumBy(transactions, "total_transaksi"))}`,
    secondBadge: "IDR",
    thirdLabel: "Metode Pembayaran",
    thirdValue: new Set(transactions.map((item) => item.metode_pembayaran)).size,
    thirdBadge: "Method",
  }),
  "/verifikasi-pembayaran": config({
    title: "Verifikasi Pembayaran",
    subtitle: "Periksa bukti pembayaran dan validasi transaksi",
    icon: ClipboardCheck,
    firstLabel: "Total Pembayaran",
    firstValue: payments.length,
    firstBadge: "Pay",
    secondLabel: "Terverifikasi",
    secondValue: countBy(payments, "status", "Verified"),
    secondBadge: "Valid",
    thirdLabel: "Menunggu",
    thirdValue: countBy(payments, "status", "Pending"),
    thirdBadge: "Queue",
  }),
  "/laporan-transaksi": config({
    title: "Laporan Transaksi",
    subtitle: "Analisis laporan pendapatan dan performa pembayaran",
    icon: ChartNoAxesCombined,
    firstLabel: "Total Laporan",
    firstValue: reports.length,
    firstBadge: "Report",
    secondLabel: "Transaksi Sukses",
    secondValue: countBy(reports, "status", "Success"),
    secondBadge: "Done",
    thirdLabel: "Total Pendapatan",
    thirdValue: `Rp ${currencyCompact(sumBy(reports, "amount"))}`,
    thirdBadge: "IDR",
  }),
  "/aktivitas-user": config({
    title: "Aktivitas User",
    subtitle: "Monitor waktu login dan aktivitas terbaru pelanggan",
    icon: Activity,
    firstLabel: "User Terpantau",
    firstValue: aktivitas.length,
    firstBadge: "Users",
    secondLabel: "Riwayat Login",
    secondValue: aktivitas.length,
    secondBadge: "Log",
    thirdLabel: "Status Sistem",
    thirdValue: "Aktif",
    thirdBadge: "Online",
  }),
  "/marketing": config({
    title: "Marketing Customer",
    subtitle: "Analisis sumber akuisisi dan efektivitas promosi",
    icon: Megaphone,
    firstLabel: "Data Marketing",
    firstValue: marketing.length,
    firstBadge: "Lead",
    secondLabel: "Promo Aktif",
    secondValue: countBy(marketing, "status_promo", "Promo Aktif"),
    secondBadge: "Promo",
    thirdLabel: "Sumber Akuisisi",
    thirdValue: new Set(marketing.map((item) => item.sumber_user)).size,
    thirdBadge: "Source",
  }),
  "/product": config({
    title: "Produk Travel",
    subtitle: "Kelola produk, stok, kategori, dan harga penjualan",
    icon: Package,
    firstLabel: "Total Produk",
    firstValue: products.length,
    firstBadge: "Item",
    secondLabel: "Total Stok",
    secondValue: sumBy(products, "stock"),
    secondBadge: "Stock",
    thirdLabel: "Total Kategori",
    thirdValue: new Set(products.map((item) => item.category)).size,
    thirdBadge: "Cat",
  }),
};

const detailConfig = config({
  title: "Detail Data",
  subtitle: "Informasi lengkap dari data yang dipilih",
  icon: BookOpen,
  firstLabel: "Status Data",
  firstValue: "Aktif",
  firstBadge: "Status",
  secondLabel: "Kelengkapan",
  secondValue: "100%",
  secondBadge: "Data",
  thirdLabel: "Pembaruan",
  thirdValue: "Terbaru",
  thirdBadge: "Update",
});

const defaultConfig = config({
  title: "Manajemen Travel",
  subtitle: "Kelola data dan operasional travel dalam satu tempat",
  icon: Boxes,
  firstLabel: "Total Data",
  firstValue: customers.length,
  firstBadge: "Data",
  secondLabel: "Status Sistem",
  secondValue: "Aktif",
  secondBadge: "Online",
  thirdLabel: "Akses Admin",
  thirdValue: "Penuh",
  thirdBadge: "Admin",
});

const detailPrefixes = [
  "/customers/",
  "/data-transaksi/",
  "/aktivitas-user/",
  "/marketing/",
  "/detail-interaksi/",
  "/DataKontak/DetailKontak/",
  "/product/",
];

const badgeStyles = [
  "bg-blue-50 text-blue-600",
  "bg-sky-50 text-sky-600",
  "bg-indigo-50 text-indigo-600",
];

export default function AdminPageSummary() {
  const { pathname } = useLocation();
  const isDetail = detailPrefixes.some((prefix) => pathname.startsWith(prefix));
  const page = routeConfigs[pathname] || (isDetail ? detailConfig : defaultConfig);
  const Icon = page.icon;

  return (
    <section className="mb-6 space-y-5" aria-labelledby="admin-page-title">
      <div className="flex min-h-[86px] items-center rounded-[14px] bg-gradient-to-r from-[#144AF5] to-[#078BCB] px-5 py-4 text-white shadow-[0_6px_14px_rgba(20,74,245,0.2)] sm:px-7">
        <div className="mr-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-white/15">
          <Icon className="h-6 w-6" strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <h1 id="admin-page-title" className="text-lg font-bold leading-tight sm:text-xl">
            {page.title}
          </h1>
          <p className="mt-1 text-xs font-medium text-white/90 sm:text-sm">
            {page.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {page.stats.map((stat, index) => (
          <article
            key={stat.label}
            className="flex min-h-[126px] items-center justify-between rounded-[14px] border border-slate-200 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.04em] text-slate-500">
                {stat.label}
              </p>
              <p className="mt-1.5 break-words text-[28px] font-extrabold leading-none text-slate-950">
                {stat.value}
              </p>
            </div>
            <span
              className={`ml-4 flex min-h-10 min-w-11 shrink-0 items-center justify-center rounded-xl px-3 text-xs font-bold ${badgeStyles[index]}`}
            >
              {stat.badge}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
