import { useState } from "react";

import {
  FaEnvelope,
  FaPhone,
  FaPlus,
  FaSearch,
  FaCrown,
  FaEye,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

import customersData from "../Data/customers.json";

// ================= SHADCN UI =================

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

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

// ================= PAGE =================

export default function Customers() {
  const [customers, setCustomers] = useState(customersData);

  const [showForm, setShowForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",

    email: "",

    phone: "",

    loyalty: "Gold",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCustomer = {
      customerId: "C" + (customers.length + 1).toString().padStart(3, "0"),

      ...formData,
    };

    setCustomers([...customers, newCustomer]);

    setShowForm(false);

    setFormData({
      customerName: "",

      email: "",

      phone: "",

      loyalty: "Gold",
    });
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getLoyaltyStyle = (tier) => {
    switch (tier) {
      case "Gold":
        return "bg-yellow-100 text-yellow-700";

      case "Silver":
        return "bg-slate-100 text-slate-600";

      case "Bronze":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="space-y-8 p-2">
      {/* HEADER */}

      <PageHeader title="Customers" breadcrumb="Management System">
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#0d9488] hover:bg-[#0f766e]"
        >
          <FaPlus />
          Add Customer
        </Button>
      </PageHeader>

      {/* SEARCH */}

      <Card>
        <CardContent className="p-6">
          <div className="relative max-w-md">
            <FaSearch
              className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
              "
            />

            <Input
              placeholder="Search customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 rounded-xl"
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
                <TableHead>Customer</TableHead>

                <TableHead>Contact</TableHead>

                <TableHead>Loyalty</TableHead>

                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCustomers.map((cust) => (
                <TableRow key={cust.customerId}>
                  <TableCell>
                    <div className="font-bold">{cust.customerName}</div>

                    <span className="text-xs text-slate-400">
                      ID : {cust.customerId}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FaEnvelope />

                      {cust.email}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FaPhone />

                      {cust.phone}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-bold
                      ${getLoyaltyStyle(cust.loyalty)}
                      `}
                    >
                      <FaCrown className="inline mr-1" />

                      {cust.loyalty}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Link to={`/customers/${cust.customerId}`}>
                      <Button variant="outline">
                        <FaEye />
                        Detail
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* DIALOG ADD CUSTOMER */}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="customerName"
              placeholder="Customer Name"
              value={formData.customerName}
              onChange={handleChange}
            />

            <Input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <select
              name="loyalty"
              value={formData.loyalty}
              onChange={handleChange}
              className="
              w-full
              border
              rounded-md
              p-2
              "
            >
              <option value="Gold">Gold</option>

              <option value="Silver">Silver</option>

              <option value="Bronze">Bronze</option>
            </select>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>

              <Button type="submit" className="bg-[#0d9488]">
                Save Data
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
