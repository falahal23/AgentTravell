import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dataInteraksi from "../Data/RiwayatInteraksi.json";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function getInitials(name) {
  return name?.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function getFeedbackVariant(feedback) {
  const f = feedback?.toLowerCase();
  if (f === "positif") return "default";      // hijau / biru
  if (f === "negatif") return "destructive";  // merah
  return "secondary";                          // abu / kuning
}

function getFeedbackColor(feedback) {
  const f = feedback?.toLowerCase();
  if (f === "positif") return "bg-green-100 text-green-700 border-green-200";
  if (f === "negatif") return "bg-red-100 text-red-600 border-red-200";
  return "bg-yellow-100 text-yellow-700 border-yellow-200";
}

export default function DetailInteraksi() {
  const { id } = useParams();
  const navigate = useNavigate();

  const item = dataInteraksi.find((d) => d.id_customer === id);

  const [catatan, setCatatan] = useState(item?.catatan_admin || "");
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#EAF2FF] flex items-center justify-center">
        <Card className="w-80 text-center p-6">
          <p className="text-gray-500 mb-4">Data tidak ditemukan.</p>
          <Button onClick={() => navigate(-1)}>Kembali</Button>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#EAF2FF] p-6">
      {/* BACK BUTTON + JUDUL */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          ← Kembali
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Detail Interaksi</h1>
          <p className="text-gray-400 text-sm">Data lengkap komunikasi pelanggan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── KOLOM KIRI: Profil CS ── */}
        <div className="flex flex-col gap-5">

          {/* Card Profil */}
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold">
                {getInitials(item.customer_service)}
              </div>
              <div>
                <p className="font-semibold text-base">{item.customer_service}</p>
                <p className="text-sm text-gray-400">Customer Service</p>
              </div>
              <Badge className={getFeedbackColor(item.feedback)}>
                {item.feedback}
              </Badge>
            </CardContent>
          </Card>

          {/* Card ID Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 font-medium">Informasi ID</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">ID Customer</p>
                <p className="text-sm font-semibold text-blue-600">{item.id_customer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status Feedback</p>
                <Badge variant={getFeedbackVariant(item.feedback)} className="mt-1">
                  {item.feedback}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── KOLOM KANAN: Detail & Catatan ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Card Riwayat Komplain */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Riwayat Komplain</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                {item.riwayat_komplain}
              </p>
            </CardContent>
          </Card>

          {/* Card Catatan Admin */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Catatan Admin</CardTitle>
              {!editMode ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMode(true)}
                >
                  Edit Catatan
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setEditMode(false); setCatatan(item.catatan_admin); }}
                  >
                    Batal
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Simpan
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {editMode ? (
                <Textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  rows={4}
                  className="resize-none text-sm"
                  placeholder="Tulis catatan admin..."
                />
              ) : (
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                  {catatan || <span className="text-gray-400 italic">Belum ada catatan.</span>}
                </p>
              )}
              {saved && (
                <p className="text-xs text-green-600 mt-2">✓ Catatan berhasil disimpan.</p>
              )}
            </CardContent>
          </Card>

          {/* Card Aksi */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Aksi</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">

              {/* Dialog: Tandai Selesai */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                    ✓ Tandai Selesai
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tandai Interaksi Selesai</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-500 mt-2">
                    Interaksi <strong>{item.id_customer}</strong> akan ditandai sebagai selesai ditangani.
                    Apakah kamu yakin?
                  </p>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline">Batal</Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">Konfirmasi</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Dialog: Eskalasi */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-orange-500 border-orange-200 hover:bg-orange-50">
                    ⚑ Eskalasi
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Eskalasi ke Tim Lain</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 mt-2">
                    <p className="text-sm text-gray-500">Pilih tim tujuan eskalasi:</p>
                    <Input placeholder="Nama tim / departemen..." />
                    <Textarea placeholder="Keterangan eskalasi..." rows={3} className="resize-none text-sm" />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline">Batal</Button>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">Kirim Eskalasi</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* AlertDialog: Hapus */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    🗑 Hapus Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Riwayat Interaksi?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Data interaksi <strong>{item.id_customer}</strong> akan dihapus secara permanen
                      dan tidak bisa dikembalikan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => navigate(-1)}
                    >
                      Ya, Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}