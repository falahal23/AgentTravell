import { useState } from "react";

import dataKontak from "../Data/DataKontak.json";

import { FaEye, FaTrash, FaSearch, FaUsers } from "react-icons/fa";

// SHADCN

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ===============================

export default function DataKontak() {
  const [kontak, setKontak] = useState(dataKontak);

  const [search, setSearch] = useState("");

  const [detail, setDetail] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin hapus data?")) {
      setKontak(kontak.filter((item) => item.id_customer !== id));
    }
  };

  const filteredData = kontak.filter(
    (item) =>
      item.id_customer?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.kota?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6 bg-[#EAF2FF] min-h-screen space-y-6">
      {/* ALERT */}

      <Alert className="bg-white">
        <FaUsers />

        <AlertTitle>Data Kontak Customer</AlertTitle>

        <AlertDescription>Total Customer : {kontak.length}</AlertDescription>
      </Alert>

      {/* HEADER SEARCH */}

      <Card>
        <CardHeader>
          <CardTitle>Management Kontak</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="relative">
            <FaSearch
              className="
              absolute
              left-3
              top-3
              text-gray-400
              "
            />

            <Input
              placeholder="Cari kontak..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}

      <Card>
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>

                <TableHead>HP</TableHead>

                <TableHead>Email</TableHead>

                <TableHead>Kota</TableHead>

                <TableHead>Provinsi</TableHead>

                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id_customer}>
                  <TableCell>{item.id_customer}</TableCell>

                  <TableCell>{item.nomor_hp}</TableCell>

                  <TableCell>{item.email}</TableCell>

                  <TableCell>{item.kota}</TableCell>

                  <TableCell>{item.provinsi}</TableCell>

                  {/* BUTTON FIX */}

                  <TableCell>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setDetail(item)}
                        className="
                        bg-blue-600
                        text-white
                        "
                      >
                        <FaEye />
                        Detail
                      </Button>

                      <Button
                        onClick={() => handleDelete(item.id_customer)}
                        className="
                        bg-red-600
                        text-white
                        "
                      >
                        <FaTrash />
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* DETAIL */}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Customer</DialogTitle>
          </DialogHeader>

          {detail && (
            <div className="space-y-4">
              <Input value={detail.id_customer} readOnly />

              <Input value={detail.email} readOnly />

              <Textarea value={detail.alamat} readOnly />

              <Button className="w-full" onClick={() => setDetail(null)}>
                Tutup
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
