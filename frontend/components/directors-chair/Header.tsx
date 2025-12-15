"use client";
import React from "react";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 bg-fibo-dark border-b border-fibo-border flex items-center justify-between px-6 shrink-0 z-50">
      {/* Logo Area */}
      <div className="flex items-center gap-2 select-none">
        <h1 className="text-2xl font-black tracking-tighter">
          <span className="text-white">FIBO</span>
          <span className="text-fibo-primary ml-1.5">SCENE</span>
        </h1>
      </div>

      {/* Right Menu */}
      <button className="text-fibo-text hover:text-white transition-colors">
        <Menu size={24} />
      </button>
    </header>
  );
}