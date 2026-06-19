import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Read from .env file
const envPath = path.resolve(process.cwd(), ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

if (!urlMatch || !keyMatch) {
  console.error("Gagal membaca VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY dari .env");
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseAnonKey = keyMatch[1].trim();
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const firstNames = [
  "Budi", "Andi", "Rudi", "Dedi", "Agus", "Fajar", "Hendra", "Rizky", "Eko", "Arif",
  "Bagus", "Yoga", "Rahmat", "Wahyu", "Fahmi", "Siti", "Rina", "Lina", "Maya", "Tina",
  "Nina", "Sari", "Putri", "Dewi", "Yuni", "Siska", "Indah", "Ayu", "Dian", "Nurul",
  "Ahmad", "Muhammad", "Agung", "Aditya", "Taufik", "Denny", "Eka", "Irfan", "Joko", "Kartika",
  "Lestari", "Mega", "Novi", "Oki", "Pratiwi", "Rian", "Surya", "Tri", "Utami", "Wulan"
];

const lastNames = [
  "Santoso", "Wijaya", "Kurniawan", "Salim", "Sari", "Hartono", "Melati", "Nugroho", "Anggraini", "Dewi",
  "Pratama", "Ayu", "Saputra", "Lestari", "Rahman", "Kartika", "Mahendra", "Permata", "Prasetyo", "Hidayat",
  "Setiawan", "Puspita", "Akbar", "Hasanah", "Dahlan", "Yusuf", "Gunawan", "Siregar", "Hutapea", "Sitorus",
  "Nasution", "Ginting", "Tarigan", "Sembiring", "Lubis", "Pane", "Harahap", "Batubara", "Tanjung", "Chaniago"
];

const cities = [
  { kota: "Jakarta", provinsi: "DKI Jakarta" },
  { kota: "Surabaya", provinsi: "Jawa Timur" },
  { kota: "Bandung", provinsi: "Jawa Barat" },
  { kota: "Medan", provinsi: "Sumatera Utara" },
  { kota: "Semarang", provinsi: "Jawa Tengah" },
  { kota: "Makassar", provinsi: "Sulawesi Selatan" },
  { kota: "Yogyakarta", provinsi: "DI Yogyakarta" },
  { kota: "Balikpapan", provinsi: "Kalimantan Timur" },
  { kota: "Pontianak", provinsi: "Kalimantan Barat" },
  { kota: "Denpasar", provinsi: "Bali" },
  { kota: "Banjarmasin", provinsi: "Kalimantan Selatan" },
  { kota: "Manado", provinsi: "Sulawesi Utara" },
  { kota: "Palembang", provinsi: "Sumatera Selatan" },
  { kota: "Tangerang", provinsi: "Banten" },
  { kota: "Malang", provinsi: "Jawa Timur" }
];

const packages = ["Paket Platinum", "Paket Gold", "Paket Silver", "Paket Basic", "Produk Skincare", "Paket Wisata"];
const paymentMethods = ["Transfer Bank", "QRIS", "COD", "Kartu Kredit", "E-Wallet"];
const marketingSources = ["Marketplace", "YouTube", "Google Search", "Website", "TikTok", "Facebook", "Instagram", "Rekomendasi Teman"];
const promoStatuses = ["Promo Aktif", "Promo Member", "Promo Kedaluwarsa", "Menggunakan Promo", "Tidak Ada Promo"];
const csChats = ["Tidak Pernah Chat", "Menanyakan Promo", "Pernah Chat", "Menanyakan Jadwal", "Konsultasi Produk", "Menanyakan Harga"];
const complaints = ["Produk Tidak Sesuai", "Masalah Pembayaran", "Kendala Login", "Pengiriman Lambat", "Tidak Ada Komplain"];
const feedbacks = ["Akan Membeli Lagi", "Kurang Puas", "Sangat Puas", "Cukup Puas", "Biasa Saja"];
const adminNotes = ["Perlu Dihubungi Kembali", "Berpotensi Upgrade Membership", "Sering Menggunakan Promo", "-", "Customer Loyal"];
const loyaltyLevels = ["Platinum", "Gold", "Silver", "Basic", "Bronze"];

async function seed() {
  const TOTAL_RECORDS = 800;
  const CHUNK_SIZE = 100;
  console.log(`=== Menyiapkan Pembuatan ${TOTAL_RECORDS} Data Berelasi ===`);

  const customers = [];
  const kontak = [];
  const membership = [];
  const transaksi = [];
  const marketing = [];
  const aktivitas = [];
  const interaksi = [];

  for (let i = 1; i <= TOTAL_RECORDS; i++) {
    const idCustomer = "CUST" + String(i).padStart(4, "0");
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const namaLengkap = `${firstName} ${lastName}`;
    const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${i}`;
    const jenisKelamin = Math.random() > 0.5 ? "Laki-laki" : "Perempuan";
    
    // Random birthdate between 1980 and 2005
    const birthYear = Math.floor(Math.random() * (2005 - 1980 + 1)) + 1980;
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    const tanggalLahir = `${birthYear}-${birthMonth}-${birthDay}`;

    customers.push({
      id_customer: idCustomer,
      nama_lengkap: namaLengkap,
      username: username,
      jenis_kelamin: jenisKelamin,
      tanggal_lahir: tanggalLahir
    });

    // Kontak
    const cityObj = cities[Math.floor(Math.random() * cities.length)];
    const phone = "08" + String(Math.floor(1000000000 + Math.random() * 9000000000));
    const email = `${username}@email.com`;
    const streetNo = Math.floor(Math.random() * 200) + 1;
    const address = `Jl. Melati No. ${streetNo}`;
    
    kontak.push({
      id_customer: idCustomer,
      no_hp: phone,
      email: email,
      alamat: address,
      kota: cityObj.kota,
      provinsi: cityObj.provinsi
    });

    // Membership
    const enrollYear = Math.floor(Math.random() * (2026 - 2023 + 1)) + 2023;
    const enrollMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    const enrollDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    const tanggalDaftar = `${enrollYear}-${enrollMonth}-${enrollDay}`;
    const loyalty = loyaltyLevels[Math.floor(Math.random() * loyaltyLevels.length)];
    const referral = Math.random().toString(36).substring(2, 10).toUpperCase();

    membership.push({
      id_customer: idCustomer,
      tanggal_daftar: tanggalDaftar,
      status_member: Math.random() > 0.15 ? "Member" : "Non Member",
      level_membership: loyalty,
      referral_code: referral,
      status_aktif: Math.random() > 0.2 ? "Aktif" : "Tidak Aktif"
    });

    // Transaksi
    const trxId = 200000 + i;
    const pkg = packages[Math.floor(Math.random() * packages.length)];
    const total = Math.floor(Math.random() * (5000000 - 100000 + 1)) + 100000;
    const payMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const trxYear = Math.floor(Math.random() * (2026 - 2024 + 1)) + 2024;
    const trxMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    const trxDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    const tanggalTrx = `${trxYear}-${trxMonth}-${trxDay}`;

    transaksi.push({
      id_transaksi: trxId,
      id_customer: idCustomer,
      paket_dibeli: pkg,
      total_transaksi: total,
      metode_pembayaran: payMethod,
      tanggal_transaksi: tanggalTrx
    });

    // Marketing
    const source = marketingSources[Math.floor(Math.random() * marketingSources.length)];
    const promo = promoStatuses[Math.floor(Math.random() * promoStatuses.length)];

    marketing.push({
      id_customer: idCustomer,
      sumber_user: source,
      status_promo: promo
    });

    // Aktivitas
    const actYear = 2026;
    const actMonth = String(Math.floor(Math.random() * 6) + 1).padStart(2, "0");
    const actDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    const actHour = String(Math.floor(Math.random() * 24)).padStart(2, "0");
    const actMin = String(Math.floor(Math.random() * 60)).padStart(2, "0");
    const actSec = String(Math.floor(Math.random() * 60)).padStart(2, "0");
    const loginTerakhir = `${actYear}-${actMonth}-${actDay} ${actHour}:${actMin}:${actSec}`;

    aktivitas.push({
      id_customer: idCustomer,
      login_terakhir: loginTerakhir
    });

    // Interaksi
    const cs = csChats[Math.floor(Math.random() * csChats.length)];
    const complaint = complaints[Math.floor(Math.random() * complaints.length)];
    const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
    const note = adminNotes[Math.floor(Math.random() * adminNotes.length)];

    interaksi.push({
      id_customer: idCustomer,
      chat_cs: cs,
      riwayat_komplain: complaint,
      feedback_review: feedback,
      catatan_admin: note
    });
  }

  try {
    // Clean old data to ensure integrity
    console.log("Membersihkan tabel...");
    await supabase.from("interaksi").delete().neq("id_customer", "");
    await supabase.from("aktivitas").delete().neq("id_customer", "");
    await supabase.from("marketing").delete().neq("id_customer", "");
    await supabase.from("transaksi").delete().neq("id_customer", "");
    await supabase.from("membership").delete().neq("id_customer", "");
    await supabase.from("kontak").delete().neq("id_customer", "");
    await supabase.from("customers").delete().neq("id_customer", "");

    // Function to chunk and insert data
    async function insertInChunks(tableName, dataArray) {
      console.log(`Menulis ke tabel "${tableName}"...`);
      for (let i = 0; i < dataArray.length; i += CHUNK_SIZE) {
        const chunk = dataArray.slice(i, i + CHUNK_SIZE);
        const { error } = await supabase.from(tableName).insert(chunk);
        if (error) throw new Error(`Gagal menulis ${tableName} di baris ${i}: ${error.message}`);
      }
      console.log(`✅ Berhasil menulis ${dataArray.length} baris ke "${tableName}".`);
    }

    // Insert order: Parent table first, then child tables
    await insertInChunks("customers", customers);
    await insertInChunks("kontak", kontak);
    await insertInChunks("membership", membership);
    await insertInChunks("transaksi", transaksi);
    await insertInChunks("marketing", marketing);
    await insertInChunks("aktivitas", aktivitas);
    await insertInChunks("interaksi", interaksi);

    console.log("\n✨ SEEDING 800 DATA BERHASIL DISAJIKAN! ✨");
  } catch (err) {
    console.error("\n❌ Terjadi kesalahan saat seeding:", err.message);
    console.error("Pastikan RLS (Row-Level Security) di Supabase sudah dimatikan atau dikonfigurasi.");
  }
}

seed();
