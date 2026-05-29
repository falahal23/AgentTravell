import React from "react";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaMinus, 
  FaUsers, 
  FaRegCalendarAlt,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaFacebookSquare,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function RightPanel() {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dates = [
    { day: 27, current: false }, { day: 28, current: false }, { day: 29, current: false }, { day: 30, current: false }, { day: 1, current: true }, { day: 2, current: true }, { day: 3, current: true },
    { day: 4, current: true }, { day: 5, current: true }, { day: 6, current: true }, { day: 7, current: true }, { day: 8, current: true }, { day: 9, current: true }, { day: 10, current: true },
    { day: 11, current: true }, { day: 12, current: true }, { day: 13, current: true }, { day: 14, current: true }, { day: 15, current: true }, { day: 16, current: true }, { day: 17, current: true },
    { day: 18, current: true }, { day: 19, current: true }, { day: 20, current: true }, { day: 21, current: true }, { day: 22, current: true }, { day: 23, current: true }, { day: 24, current: true },
    { day: 25, current: true }, { day: 26, current: true }, { day: 27, current: true }, { day: 28, current: true }, { day: 29, current: true }, { day: 30, current: true }, { day: 31, current: true }
  ];

  return (
    <div className="w-full max-w-xs space-y-5 p-1 text-slate-800">
      
      {/* 1. DARK BLUE CALENDAR */}
      <div className="bg-[#0A257F] text-white rounded-[2.5rem] p-5 shadow-md">
        <div className="flex items-center justify-between mb-4 px-1">
          <button className="text-white/60 hover:text-white transition-colors"><FaChevronLeft size={10} /></button>
          <h3 className="font-bold text-xs uppercase tracking-widest">April 2025</h3>
          <button className="text-white/60 hover:text-white transition-colors"><FaChevronRight size={10} /></button>
        </div>

        <div className="grid grid-cols-7 gap-y-3 text-center">
          {days.map((day) => (
            <span key={day} className="text-[9px] font-bold text-white/40">{day}</span>
          ))}
          {dates.map((item, idx) => {
            // Menyesuaikan highlight range tanggal 16 - 19 seperti di gambar
            const isRangeStart = item.day === 16 && idx === 19;
            const isInRange = item.day >= 17 && item.day <= 18 && idx > 19;
            const isRangeEnd = item.day === 19 && idx === 22;

            return (
              <div key={idx} className="relative flex items-center justify-center py-0.5">
                {/* Background connector strip untuk range tanggal */}
                {isInRange && <div className="absolute inset-0 bg-white/10" />}
                {isRangeStart && <div className="absolute right-0 w-1/2 h-full bg-white/10 rounded-l-full" />}
                {isRangeEnd && <div className="absolute left-0 w-1/2 h-full bg-white/10 rounded-r-full" />}

                <span className={`text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full transition-all
                  ${isRangeStart || isRangeEnd ? "bg-white text-[#0A257F] shadow-md" : ""}
                  ${isInRange ? "text-white" : ""}
                  ${!item.current ? "text-white/20" : (!isRangeStart && !isRangeEnd && !isInRange ? "text-white/80" : "")}
                `}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. UPCOMING TRIPS */}
      <div className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Upcoming Trips</h2>
          <button className="text-blue-600 font-bold text-[10px] hover:underline">View All</button>
        </div>

        <div className="space-y-3">
          <TripItem title="Shunderban, Khulna" date="16 - 19 Apr 2025" quota="8" img="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100" />
          <TripItem title="Srimongol, Sylhet" date="16 - 19 Apr 2025" quota="8" img="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=100" />
          <TripItem title="Jaflong, Sylhet" date="16 - 19 Apr 2025" quota="8" img="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=100" />
        </div>
      </div>

      {/* 3. RECENT ACTIVITY */}
      <div className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Recent Activity</h2>
          <button className="text-slate-400 p-1 hover:bg-slate-50 rounded-md"><FaMinus size={10} /></button>
        </div>

        <div className="relative border-l border-slate-100 ml-2.5 pl-5 space-y-4 py-1">
          <ActivityItem time="12:30 PM" iconBg="bg-blue-900" text={<span><strong className="text-slate-900">Tonmoy Hasan (admin)</strong> updated the Cox's Bazar Travel Package</span>} />
          <ActivityItem time="12:30 PM" iconBg="bg-blue-600" text={<span><strong className="text-slate-900">Tonmoy Hasan (admin)</strong> updated the Cox's Bazar Travel Package</span>} />
          <ActivityItem time="12:30 PM" iconBg="bg-indigo-900" text={<span><strong className="text-slate-900">Tonmoy Hasan (admin)</strong> updated the Cox's Bazar Travel Package</span>} />
        </div>
      </div>

      {/* 4. SOCIAL MEDIA OVERVIEW */}
      <div className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Social Media Overview</h2>
          <button className="text-slate-400 p-1 hover:bg-slate-50 rounded-md"><FaMinus size={10} /></button>
        </div>

        <span className="block text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">Followers Stats</span>
        
        {/* Social Grid 3 Kolom */}
        <div className="grid grid-cols-3 gap-y-4 gap-x-2 text-center pb-4 border-b border-slate-100">
          <SocialStat icon={<FaYoutube className="text-red-600" />} count="2,344" label="Subscribers" />
          <SocialStat icon={<FaInstagram className="text-pink-600" />} count="1,283" label="Followers" />
          <SocialStat icon={<FaLinkedin className="text-blue-700" />} count="1,004" label="Followers" />
          <SocialStat icon={<FaXTwitter className="text-black" />} count="2,344" label="Following" />
          <SocialStat icon={<FaFacebookSquare className="text-blue-600" />} count="1,283" label="Likes" />
          <SocialStat icon={<div className="font-black text-slate-700 text-xs leading-none">G+</div>} count="1,004" label="Circled by" />
        </div>

        {/* Share & Like Footer Widgets */}
        <div className="grid grid-cols-2 gap-4 pt-3">
          <div>
            <span className="block text-[9px] font-bold text-slate-400 mb-1">LinkedIn Shares</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-slate-900">155</span>
            </div>
            <span className="text-[8px] text-slate-400 font-medium">Shares last month</span>
          </div>

          <div className="border-l border-slate-100 pl-4">
            <span className="block text-[9px] font-bold text-slate-400 mb-1">Facebook Page Likes</span>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-slate-900">18%</span>
              <span className="text-[8px] text-emerald-600 font-bold flex items-center gap-0.5"><FaArrowUp size={6} /> 131</span>
            </div>
            <span className="text-[8px] text-slate-400 font-medium">Vs 131 prev month</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-50 mt-2">
          <div>
            <span className="block text-[9px] font-bold text-slate-400 mb-0.5">Total page Likes</span>
            <span className="block text-xs font-black text-slate-900">2,344</span>
            <span className="text-[8px] text-red-500 font-bold flex items-center gap-0.5"><FaArrowDown size={6} /> 80%</span>
            <span className="text-[8px] text-slate-400 block font-medium">Vs 11,793</span>
          </div>

          <div className="border-l border-slate-100 pl-4">
            <span className="block text-[9px] font-bold text-slate-400 mb-0.5">New page Likes</span>
            <span className="block text-xs font-black text-slate-900">432</span>
            <span className="text-[8px] text-emerald-600 font-bold flex items-center gap-0.5"><FaArrowUp size={6} /> 34%</span>
            <span className="text-[8px] text-slate-400 block font-medium">Vs 321</span>
          </div>
        </div>

      </div>

    </div>
  );
}

/* --- SUB COMPONENTS --- */
function TripItem({ title, date, quota, img }) {
  return (
    <div className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
      <img src={img} className="w-10 h-10 rounded-xl object-cover shadow-xs" alt={title} />
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-xs text-slate-800 truncate mb-0.5">{title}</h4>
        <div className="flex items-center justify-between text-[9px] text-slate-400 font-medium">
          <span className="flex items-center gap-1"><FaRegCalendarAlt size={8} /> {date}</span>
          <span className="flex items-center gap-0.5 text-slate-500 font-bold"><FaUsers size={9} /> {quota}</span>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ time, text, iconBg }) {
  return (
    <div className="relative">
      {/* Bullet bulatan timeline */}
      <div className={`absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full ${iconBg} border-2 border-white shadow-sm`} />
      <div className="text-[10px] text-slate-400 font-medium leading-relaxed">
        <p className="line-clamp-2 text-slate-500">{text}</p>
        <span className="block text-[9px] font-bold text-slate-400/80 mt-0.5">{time}</span>
      </div>
    </div>
  );
}

function SocialStat({ icon, count, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-sm mb-1">{icon}</div>
      <span className="block text-[11px] font-black text-slate-800 leading-none mb-0.5">{count}</span>
      <span className="text-[8px] text-slate-400 font-semibold tracking-tight">{label}</span>
    </div>
  );
}