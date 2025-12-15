"use client";

import React, { useState, useEffect } from "react";
import { Maximize2, Terminal, Loader2, Play, Download, Share2 } from "lucide-react";
import { clsx } from "clsx";

// Mock Data for the "Generated" Images (Placeholders)
const MOCK_SHOTS = [
  { id: 1, type: "Front View", lens: "35mm", src: "/api/placeholder/400/300" },
  { id: 2, type: "Side Profile", lens: "50mm", src: "/api/placeholder/400/300" },
  { id: 3, type: "Cinematic Close", lens: "85mm", src: "/api/placeholder/400/300" },
  { id: 4, type: "Wide Angle", lens: "16mm", src: "/api/placeholder/400/300" },
];

export default function Viewfinder() {
  const [status, setStatus] = useState<"IDLE" | "DEVELOPING" | "DONE">("IDLE");
  const [logs, setLogs] = useState<string[]>([]);

  // Simulation of the "FIBO Engine" processing
  const startRender = () => {
    setStatus("DEVELOPING");
    setLogs([]);
    
    const steps = [
      "Initializing FIBO Neural Engine...",
      "Parsing JSON constraints...",
      "Locking Camera: 35mm / f1.8...",
      "Calculating Lightmaps (Raytracing)...",
      "Applying Color Palette: 'Noir'...",
      "Rendering Final Output..."
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, step]);
        if (index === steps.length - 1) {
          setTimeout(() => setStatus("DONE"), 800);
        }
      }, index * 800); // 800ms delay between steps
    });
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-black/20 relative font-sans">
      
      {/* 1. VIEWFINDER HEADER */}
      <div className="px-4 py-3 border-b border-fibo-border bg-fibo-dark/80 backdrop-blur-sm flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-fibo-textLight font-bold text-sm tracking-wide">
            Viewfinder <span className="text-fibo-text text-xs font-normal ml-2 opacity-50">v2.4</span>
          </h2>
          {/* Status Indicator */}
          <div className={clsx(
            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border",
            status === "IDLE" ? "bg-fibo-border/50 text-fibo-text border-transparent" :
            status === "DEVELOPING" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse" :
            "bg-green-500/10 text-green-500 border-green-500/20"
          )}>
            {status}
          </div>
        </div>
        
        <div className="flex gap-2">
           <button className="p-2 hover:bg-white/10 rounded text-fibo-text transition-colors">
             <Maximize2 size={16} />
           </button>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 p-4 overflow-hidden relative">
        
        {/* STATE A: EMPTY / IDLE */}
        {status === "IDLE" && (
          <div className="h-full border-2 border-dashed border-fibo-border/30 rounded-xl flex flex-col items-center justify-center gap-4 group">
            <div className="w-16 h-16 rounded-full bg-fibo-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
               <Play size={32} className="text-fibo-primary ml-1" />
            </div>
            <div className="text-center">
              <h3 className="text-fibo-textLight font-bold text-lg">Ready to Render</h3>
              <p className="text-fibo-text text-xs mt-1 max-w-xs mx-auto">
                Configure your shot in the Director's Chair, then initialize the FIBO Engine to generate your scene.
              </p>
            </div>
            <button 
              onClick={startRender}
              className="mt-4 px-6 py-2 bg-fibo-primary hover:bg-orange-400 text-black font-bold text-xs tracking-widest uppercase rounded shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all"
            >
              Initialize Render
            </button>
          </div>
        )}

        {/* STATE B: DEVELOPING (THE TERMINAL) */}
        {status === "DEVELOPING" && (
           <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 flex items-center justify-center">
             <div className="w-96 bg-fibo-dark border border-fibo-border rounded-lg shadow-2xl overflow-hidden font-mono text-xs">
               {/* Terminal Top Bar */}
               <div className="bg-fibo-panel px-3 py-2 border-b border-fibo-border flex items-center gap-2">
                 <Loader2 size={12} className="text-fibo-primary animate-spin" />
                 <span className="text-fibo-textLight tracking-wide">FIBO_KERNEL_PROCESS.exe</span>
               </div>
               {/* Terminal Logs */}
               <div className="p-4 space-y-2 h-48 overflow-y-auto custom-scrollbar bg-black/50">
                 {logs.map((log, i) => (
                   <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                     <span className="text-green-500 font-bold">{">"}</span>
                     <span className={clsx(
                       "text-fibo-text",
                       i === logs.length - 1 ? "text-fibo-textLight" : ""
                     )}>{log}</span>
                   </div>
                 ))}
                 <div className="w-2 h-4 bg-fibo-primary animate-pulse inline-block align-middle ml-2"></div>
               </div>
             </div>
           </div>
        )}

        {/* STATE C: DONE (THE GRID) */}
        {status === "DONE" && (
          <div className="h-full grid grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pb-10 animate-in zoom-in-95 duration-500">
            {MOCK_SHOTS.map((shot) => (
              <div key={shot.id} className="group relative aspect-video bg-black rounded-lg border border-fibo-border overflow-hidden hover:border-fibo-primary transition-all cursor-pointer">
                {/* Image (Placeholder Gradient for now) */}
                <div className="absolute inset-0 bg-linear-to-br from-gray-800 to-black group-hover:scale-105 transition-transform duration-700"></div>
                
                {/* Labels */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[9px] text-fibo-textLight font-bold uppercase tracking-wider">
                  {shot.type}
                </div>
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                   <button className="p-2 bg-fibo-primary text-black rounded-full hover:scale-110 transition-transform"><Maximize2 size={16}/></button>
                   <button className="p-2 bg-white text-black rounded-full hover:scale-110 transition-transform"><Download size={16}/></button>
                </div>

                {/* Tech Data Footer */}
                <div className="absolute bottom-0 w-full px-3 py-2 bg-black/80 border-t border-white/5 flex justify-between items-center">
                   <span className="text-[9px] text-fibo-primary font-mono">{shot.lens}</span>
                   <span className="text-[9px] text-fibo-text font-mono">ISO 400</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}