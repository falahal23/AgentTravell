import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-6 py-4 bg-transparent">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">
          © {new Date().getFullYear()} GoLand Admin • All rights reserved.
        </p>
      </div>
    </footer>
  );
}
