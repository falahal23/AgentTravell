import { useState, useEffect, useRef } from "react";
import { FaEnvelope, FaPhone, FaPlus, FaSearch, FaCrown, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import customersData from "../Data/customers.json";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Customers() {
  const [customers, setCustomers] = useState(customersData);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loyaltyFilter, setLoyaltyFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const searchInputRef = useRef(null);

  const [formData, setFormData] = useState({
    customerName: "", email: "", phone: "", loyalty: "Gold",
  });

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLoyalty = loyaltyFilter === "All" || c.loyalty === loyaltyFilter;
    return matchSearch && matchLoyalty;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { searchInputRef.current?.focus(); }, []);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, loyaltyFilter]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCustomer = {
      customerId: "C" + (customers.length + 1).toString().padStart(3, "0"),
      ...formData,
    };
    setCustomers([...customers, newCustomer]);
    setFormData({ customerName: "", email: "", phone: "", loyalty: "Gold" });
    setShowForm(false);
  };

  const getLoyaltyStyle = (tier) => {
    switch (tier) {
      case "Gold":   return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "Silver": return "bg-slate-100 text-slate-700 border border-slate-300";
      case "Bronze": return "bg-orange-100 text-orange-700 border border-orange-300";
      default:       return "bg-gray-100 text-gray-700";
    }
  };

  const getLoyaltyCount = (tier) => customers.filter((c) => c.loyalty === tier).length;

  return (
    <div className="space-y-6 p-2">
      <PageHeader title="Customers" breadcrumb="Management System">
        <Button onClick={() => setShowForm(true)} className="bg-blue-900 hover:bg-blue-800">
          <FaPlus /> Add Customer
        </Button>
      </PageHeader>

      {/* STATISTICS */}
      <div className="!hidden grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Customer", value: customers.length, color: "text-blue-900" },
          { label: "Gold Member",    value: getLoyaltyCount("Gold"),   color: "text-yellow-600" },
          { label: "Silver Member",  value: getLoyaltyCount("Silver"), color: "text-slate-600" },
          { label: "Bronze Member",  value: getLoyaltyCount("Bronze"), color: "text-orange-600" },
        ].map((s) => (
          <Card key={s.label} className="shadow-md border-0">
            <CardContent className="p-5">
              <p className="text-sm text-slate-500">{s.label}</p>
              <h2 className={`text-3xl font-bold ${s.color}`}>{s.value}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <Card className="shadow-md border-0">
        <CardContent className="p-6 space-y-4">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              ref={searchInputRef}
              placeholder="Search customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 rounded-xl"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Gold", "Silver", "Bronze"].map((item) => (
              <Button
                key={item}
                variant={loyaltyFilter === item ? "default" : "outline"}
                className={loyaltyFilter === item ? "bg-blue-900" : ""}
                onClick={() => setLoyaltyFilter(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-900 hover:to-blue-800">
                {/* GANTI ID → NO */}
                <TableHead className="text-white font-semibold w-14">No</TableHead>
                <TableHead className="text-white font-semibold">Customer</TableHead>
                <TableHead className="text-white font-semibold">Contact</TableHead>
                <TableHead className="text-white font-semibold">Loyalty</TableHead>
                <TableHead className="text-white font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                    Tidak ada data customer.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCustomers.map((cust, index) => (
                  <TableRow
                    key={cust.customerId}
                    className="odd:bg-white even:bg-slate-50 hover:bg-blue-50 transition-colors"
                  >
                    {/* NOMOR URUT */}
                    <TableCell className="text-center font-semibold text-slate-500">
                      {startIndex + index + 1}
                    </TableCell>

                    <TableCell>
                      <div className="font-bold">{cust.customerName}</div>
                      <span className="text-xs text-slate-400">ID: {cust.customerId}</span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <FaEnvelope className="text-slate-400" /> {cust.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <FaPhone className="text-slate-400" /> {cust.phone}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getLoyaltyStyle(cust.loyalty)}`}>
                        <FaCrown className="inline mr-1" />
                        {cust.loyalty}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Link to={`/customers/${cust.customerId}`}>
                        <Button variant="outline" className="rounded-xl">
                          <FaEye /> Detail
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredCustomers.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredCustomers.length)}
              </span>{" "}
              of <span className="font-semibold text-slate-700">{filteredCustomers.length}</span> customers
            </p>
            <div className="flex gap-2">
              <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  className={currentPage === i + 1 ? "bg-blue-900" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(currentPage + 1)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ADD CUSTOMER DIALOG */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="customerName" placeholder="Customer Name" value={formData.customerName} onChange={handleChange} required />
            <Input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <Input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            <select name="loyalty" value={formData.loyalty} onChange={handleChange} className="w-full border rounded-lg p-2">
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-900 hover:bg-blue-800">Save Data</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
