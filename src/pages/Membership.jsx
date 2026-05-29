import { useState } from "react";

import membershipData from "../Data/Membership.json";

import { FaEye, FaTrash, FaSearch, FaUsers } from "react-icons/fa";

// ================= SHADCN =================

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// =================================

export default function Membership() {
  const [data, setData] = useState(membershipData);

  const [search, setSearch] = useState("");

  const [detail, setDetail] = useState(null);

  const [deleteData, setDeleteData] = useState(null);

  // DELETE DATA

  const hapusData = () => {
    setData(data.filter((item) => item.id_customer !== deleteData.id_customer));

    setDeleteData(null);
  };

  // SEARCH DATA

  const filterData = data.filter(
    (item) =>
      item.id_customer?.toLowerCase().includes(search.toLowerCase()) ||
      item.status_member?.toLowerCase().includes(search.toLowerCase()) ||
      item.level_membership?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#EAF2FF] p-6 space-y-6">
      {/* ALERT INFO */}

      <Alert className="bg-white">
        <FaUsers />

        <AlertTitle>Membership Customer</AlertTitle>

        <AlertDescription>
          Total data membership : <b>{data.length}</b> customer
        </AlertDescription>
      </Alert>

      {/* SEARCH */}

      <Card>
        <CardHeader>
          <CardTitle>Data Membership CRM</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="relative max-w-md">
            <FaSearch
              className="
              absolute
              left-3
              top-3
              text-gray-400
              "
            />

            <Input
              placeholder="Cari membership..."
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

                <TableHead>Tanggal</TableHead>

                <TableHead>Status</TableHead>

                <TableHead>Level</TableHead>

                <TableHead>Referral</TableHead>

                <TableHead>Aktif</TableHead>

                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filterData.map((item) => (
                <TableRow key={item.id_customer}>
                  <TableCell>{item.id_customer}</TableCell>

                  <TableCell>{item.tanggal_daftar}</TableCell>

                  {/* BADGE STATUS */}

                  <TableCell>
                    <Badge
                      className={
                        item.status_member === "Member"
                          ? `
                        bg-green-100
                        text-green-700
                        hover:bg-green-100
                        rounded-full
                        px-4
                        `
                          : `
                        bg-red-100
                        text-red-700
                        hover:bg-red-100
                        rounded-full
                        px-4
                        `
                      }
                    >
                      {item.status_member}
                    </Badge>
                  </TableCell>

                  {/* BADGE LEVEL */}

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        item.level_membership === "Gold"
                          ? `
                        border-yellow-400
                        bg-yellow-50
                        text-yellow-600
                        rounded-full
                        px-4
                        `
                          : item.level_membership === "Silver"
                            ? `
                        border-gray-400
                        bg-gray-50
                        text-gray-600
                        rounded-full
                        px-4
                        `
                            : `
                        border-orange-400
                        bg-orange-50
                        text-orange-600
                        rounded-full
                        px-4
                        `
                      }
                    >
                      {item.level_membership}
                    </Badge>
                  </TableCell>

                  <TableCell>{item.referral_code}</TableCell>

                  {/* BADGE AKTIF */}

                  <TableCell>
                    <Badge
                      className={
                        item.status_aktif === "Aktif"
                          ? `
                        bg-blue-100
                        text-blue-700
                        hover:bg-blue-100
                        rounded-full
                        px-4
                        `
                          : `
                        bg-gray-100
                        text-gray-600
                        hover:bg-gray-100
                        rounded-full
                        px-4
                        `
                      }
                    >
                      {item.status_aktif}
                    </Badge>
                  </TableCell>

                  {/* ACTION */}

                  <TableCell>
                    <div className="flex justify-center gap-3">
                      <Button
                        onClick={() => setDetail(item)}
                        className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        "
                      >
                        <FaEye />
                        Detail
                      </Button>

                      <Button
                        onClick={() => setDeleteData(item)}
                        className="
                        bg-red-600
                        hover:bg-red-700
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

      {/* DETAIL DIALOG */}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Membership</DialogTitle>
          </DialogHeader>

          {detail && (
            <div className="space-y-3">
              <p>ID : {detail.id_customer}</p>

              <p>Status : {detail.status_member}</p>

              <p>Level : {detail.level_membership}</p>

              <p>Referral : {detail.referral_code}</p>

              <p>Aktif : {detail.status_aktif}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ALERT DELETE */}

      <AlertDialog open={!!deleteData} onOpenChange={() => setDeleteData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Membership?</AlertDialogTitle>

            <AlertDialogDescription>
              Data customer <b>{deleteData?.id_customer}</b> akan dihapus
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>

            <AlertDialogAction
              onClick={hapusData}
              className="
              bg-red-600
              hover:bg-red-700
              "
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
