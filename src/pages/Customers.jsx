import { useState } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaPlus, 
  FaSearch, 
  FaCrown, 
  FaTimes, 
  FaEye, 
  FaUserPlus 
} from "react-icons/fa";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// Perhatikan: Folder "Data" menggunakan D besar sesuai struktur folder kamu
import customersData from "../Data/customers.json";

export default function Customers() {
  const [customers, setCustomers] = useState(customersData);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    loyalty: "Gold"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.email) {
      alert("Please fill in the name and email!");
      return;
    }

    const newCustomer = {
      customerId: "C" + (customers.length + 1).toString().padStart(3, "0"),
      ...formData
    };

    setCustomers([...customers, newCustomer]);
    setShowForm(false);
    setFormData({ customerName: "", email: "", phone: "", loyalty: "Gold" });
  };

  const filteredCustomers = customers.filter(c => 
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.customerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLoyaltyStyle = (tier) => {
    switch (tier) {
      case "Gold": return "bg-amber-50 text-amber-600 border-amber-100";
      case "Silver": return "bg-slate-50 text-slate-500 border-slate-200";
      case "Bronze": return "bg-orange-50 text-orange-600 border-orange-100";
      default: return "bg-gray-50 text-gray-400 border-gray-100";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-2">
      
      {/* --- HEADER --- */}
      <PageHeader title="Customers" breadcrumb="Management System">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#0d9488] hover:bg-[#0f766e] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-teal-100 transition-all active:scale-95"
        >
          <FaPlus />
          <span>Add Customer</span>
        </button>
      </PageHeader>

      {/* --- SEARCHBAR --- */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0d9488] transition-colors" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-[#1e293b] outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:border-[#0d9488] transition-all"
          />
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1e293b] text-white/90">
                <th className="py-6 px-8 text-[11px] font-black uppercase tracking-widest">Customer Profile</th>
                <th className="py-6 px-8 text-[11px] font-black uppercase tracking-widest">Contact Details</th>
                <th className="py-6 px-8 text-[11px] font-black uppercase tracking-widest text-center">Loyalty Tier</th>
                <th className="py-6 px-8 text-[11px] font-black uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <tr key={cust.customerId} className="hover:bg-teal-50/30 transition-colors group">
                    {/* Profil */}
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-400 to-[#0d9488] flex items-center justify-center text-white font-black shadow-md group-hover:scale-110 transition-transform">
                          {cust.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1e293b] group-hover:text-[#0d9488] transition-colors">
                            {cust.customerName}
                          </p>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded">
                            ID: {cust.customerId}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Kontak */}
                    <td className="py-5 px-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                          <FaEnvelope className="text-teal-500/50" />
                          {cust.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <FaPhone className="text-teal-500/50" />
                          {cust.phone}
                        </div>
                      </div>
                    </td>

                    {/* Loyalty */}
                    <td className="py-5 px-8 text-center">
                      <span className={`px-4 py-1.5 text-[10px] font-black rounded-xl border tracking-[0.1em] uppercase inline-flex items-center gap-2 shadow-sm ${getLoyaltyStyle(cust.loyalty)}`}>
                        <FaCrown className="text-[9px]" />
                        {cust.loyalty}
                      </span>
                    </td>

                    {/* Button Detail */}
                    <td className="py-5 px-8 text-center">
                      <Link to={`/customers/${cust.customerId}`}>
                        <button className="inline-flex items-center gap-2 bg-white text-[#1e293b] border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-[#1e293b] hover:text-white transition-all active:scale-90">
                          <FaEye className="text-sm" />
                          Detail
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center opacity-30">
                      <FaSearch className="text-4xl mb-3" />
                      <p className="text-sm font-bold uppercase tracking-widest">No matching records</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL FORM --- */}
      {showForm && (
        <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-0 rounded-[2.5rem] shadow-2xl w-full max-w-md relative overflow-hidden border border-white">
            {/* Modal Header */}
            <div className="bg-[#1e293b] p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/20 rounded-lg text-teal-400">
                  <FaUserPlus className="text-lg" />
                </div>
                <h2 className="text-xl font-black tracking-tight">Add Customer</h2>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <FaTimes />
              </button>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                   <FaUser className="absolute left-4 top-4 text-slate-300 group-focus-within:text-[#0d9488]" />
                   <input
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl text-[#1e293b] outline-none focus:bg-white focus:border-[#0d9488] focus:ring-4 focus:ring-teal-500/5 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="mail@host.com"
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-[#1e293b] outline-none focus:bg-white focus:border-[#0d9488] transition-all text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+62..."
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-[#1e293b] outline-none focus:bg-white focus:border-[#0d9488] transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Loyalty Tier</label>
                <select
                  name="loyalty"
                  value={formData.loyalty}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-[#1e293b] outline-none focus:bg-white focus:border-[#0d9488] transition-all appearance-none font-bold"
                >
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Bronze">Bronze</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-2xl font-bold shadow-lg shadow-teal-100 transition-all active:scale-95"
                >
                  Save Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}