import { useParams, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaEnvelope, 
  FaPhone, 
  FaCrown, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaShoppingBag 
} from "react-icons/fa";
import customersData from "../Data/customers.json";

export default function DetailCustomer() {
  const { id } = useParams(); // Mengambil ID dari parameter URL
  const navigate = useNavigate();

  // Mencari data customer berdasarkan ID
  const customer = customersData.find((c) => c.customerId === id);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold text-slate-400">Customer Not Found</h2>
        <button onClick={() => navigate(-1)} className="text-[#0d9488] font-bold">Back to List</button>
      </div>
    );
  }

  const getLoyaltyStyle = (tier) => {
    switch (tier) {
      case "Gold": return "bg-amber-50 text-amber-600 border-amber-100";
      case "Silver": return "bg-slate-50 text-slate-500 border-slate-200";
      case "Bronze": return "bg-orange-50 text-orange-600 border-orange-100";
      default: return "bg-gray-50 text-gray-400 border-gray-100";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-2">
      
      {/* BACK BUTTON */}
      <button 
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-slate-400 hover:text-[#0d9488] transition-colors font-bold text-sm"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Customers
      </button>

      {/* MAIN PROFILE CARD */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-50">
        {/* Header/Banner Biru */}
        <div className="h-32 bg-[#1e293b] w-full relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-3xl shadow-lg">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-teal-400 to-[#0d9488] flex items-center justify-center text-white text-4xl font-black">
              {customer.customerName.charAt(0)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 p-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-black text-[#1e293b] tracking-tight">
                {customer.customerName}
              </h1>
              <p className="text-slate-400 font-bold tracking-widest text-sm uppercase">
                Customer ID: {customer.customerId}
              </p>
            </div>
            <span className={`px-6 py-2 rounded-2xl border font-black text-xs tracking-widest uppercase flex items-center gap-2 shadow-sm ${getLoyaltyStyle(customer.loyalty)}`}>
              <FaCrown />
              {customer.loyalty} Member
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info Group */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white rounded-xl text-teal-600 shadow-sm"><FaEnvelope /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Email Address</p>
                    <p className="text-sm font-bold text-slate-700">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white rounded-xl text-teal-600 shadow-sm"><FaPhone /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Phone Number</p>
                    <p className="text-sm font-bold text-slate-700">{customer.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Group */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Status & Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white rounded-xl text-teal-600 shadow-sm"><FaCalendarAlt /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Join Date</p>
                    <p className="text-sm font-bold text-slate-700">12 May 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white rounded-xl text-teal-600 shadow-sm"><FaShoppingBag /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Total Transactions</p>
                    <p className="text-sm font-bold text-slate-700">24 Orders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-50" />

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-[#1e293b] text-white rounded-2xl font-bold hover:bg-[#0f172a] transition-all shadow-lg active:scale-95">
              Edit Profile
            </button>
            <button className="px-8 py-3 bg-white text-red-500 border border-red-100 rounded-2xl font-bold hover:bg-red-50 transition-all active:scale-95">
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}