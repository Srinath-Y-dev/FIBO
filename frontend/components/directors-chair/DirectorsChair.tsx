"use client";

import React, { useState, useRef, useMemo } from "react";
import { 
  ChevronDown, 
  MoveVertical, 
  Image as ImageIcon, 
  Trash2, 
  RotateCw, 
  Zap,
  Check, 
  Copy,
  Loader2,
  ScanEye,
  Aperture
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- TYPES ---
type LightingType = "studio_soft" | "studio_hard" | "natural_morning" | "natural_noon" | "neon_cyberpunk" | "cinematic_warm";
type ColorPalette = "neutral" | "vibrant" | "pastel" | "noir" | "matrix";
type HeightLevel = "ground" | "low" | "eye_level" | "high" | "bird_eye";

interface FiboSchema {
  reference_image: string | null;
  controls: {
    camera_angle: "front" | "side" | "top" | "back";
    fov: number;
    camera_rotation: number;
    camera_height: HeightLevel;
    lighting: LightingType;
    color_palette: ColorPalette;
  };
}

// --- MAIN COMPONENT ---
export default function DirectorsChair() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<FiboSchema>({
    reference_image: null,
    controls: {
      camera_angle: "front",
      fov: 35,
      camera_rotation: 120,
      camera_height: "eye_level",
      lighting: "studio_soft",
      color_palette: "neutral"
    }
  });

  const [jsonPreviewOpen, setJsonPreviewOpen] = useState(true);

  // Optimized updater
  const updateControl = (key: keyof FiboSchema['controls'], value: any) => {
    setData(prev => {
        // Prevent unnecessary re-renders if value hasn't changed
        if (prev.controls[key] === value) return prev;
        return { ...prev, controls: { ...prev.controls, [key]: value } };
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    console.log("SENDING PAYLOAD:", JSON.stringify(data));
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="w-full h-full bg-zinc-950 border-r border-zinc-800 flex flex-col font-sans text-zinc-300 relative overflow-hidden select-none">
      
      {/* Subtle Noise Texture Overlay for Pro Feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* HEADER */}
      <div className="relative z-10 bg-zinc-900/80 px-5 py-4 border-b border-zinc-800 shrink-0 backdrop-blur-md flex justify-between items-center shadow-sm">
        <h2 className="text-zinc-100 font-bold text-sm tracking-widest uppercase flex items-center gap-2">
          <ScanEye className="text-amber-500" size={18} />
          Director's Chair
        </h2>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
           <span className="text-[10px] font-mono text-zinc-500">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar relative z-10">
        
        {/* 1. Base64 Image Upload */}
        <ReferenceUpload 
          currentImage={data.reference_image}
          onImageUpload={(base64) => setData(prev => ({ ...prev, reference_image: base64 }))}
        />

        {/* 2. Professional Camera Controls */}
        <div className="space-y-6">
           <SectionTitle icon={<MoveVertical size={14} />} title="Camera Geometry" />

           {/* Height Dropdown */}
           <DirectorSelect 
             label="Camera Height"
             value={data.controls.camera_height}
             options={["ground", "low", "eye_level", "high", "bird_eye"]}
             onChange={(val) => updateControl('camera_height', val)}
           />

           {/* Rotation (Optimized) */}
           <CompassControl 
             value={data.controls.camera_rotation}
             onChange={(val) => updateControl('camera_rotation', val)}
           />

           {/* FOV Slider */}
           <PrecisionSlider 
             label="Lens FOV"
             value={data.controls.fov}
             min={16} max={85}
             unit="mm"
             onChange={(val) => updateControl('fov', val)}
           />

           {/* Angle Buttons */}
           <div className="grid grid-cols-4 gap-2">
             {(["front", "side", "back", "top"] as const).map(angle => (
               <button
                 key={angle}
                 onClick={() => updateControl('camera_angle', angle)}
                 className={cn(
                   "py-2 text-[10px] font-bold uppercase rounded-md border transition-all duration-150 relative overflow-hidden group",
                   data.controls.camera_angle === angle 
                    ? "bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                 )}
               >
                 <span className="relative z-10">{angle}</span>
                 {data.controls.camera_angle === angle && (
                     <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
                 )}
               </button>
             ))}
           </div>
        </div>

        {/* 3. Atmosphere */}
        <div className="space-y-6 pt-2">
           <SectionTitle icon={<Zap size={14} />} title="Atmosphere" />

           <DirectorSelect 
             label="Lighting Model"
             value={data.controls.lighting}
             options={["studio_soft", "studio_hard", "natural_morning", "natural_noon", "neon_cyberpunk", "cinematic_warm"]}
             onChange={(val) => updateControl('lighting', val)}
           />

           <DirectorSelect 
             label="Color Palette"
             value={data.controls.color_palette}
             options={["neutral", "vibrant", "pastel", "noir", "matrix"]}
             onChange={(val) => updateControl('color_palette', val)}
           />
        </div>

        <div className="h-12"></div>
      </div>

      {/* FOOTER: Generate & JSON */}
      <div className="border-t border-zinc-800 bg-zinc-900/90 backdrop-blur shrink-0 flex flex-col z-20">
        
        {/* Generate Button */}
        <div className="p-4 pb-2">
            <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={cn(
                    "w-full py-3 rounded-lg font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all relative overflow-hidden group",
                    isGenerating 
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        : "bg-linear-to-r from-amber-500 to-orange-600 text-black shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:-translate-y-px active:translate-y-px"
                )}
            >
                {isGenerating ? (
                    <><Loader2 className="animate-spin" size={16} /> Processing...</>
                ) : (
                    <><Zap size={16} fill="currentColor" /> Generate Scene</>
                )}
            </button>
        </div>

        {/* Collapsible JSON */}
        <div className="px-4 pb-4">
            <button 
                onClick={() => setJsonPreviewOpen(!jsonPreviewOpen)}
                className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest hover:text-zinc-300 transition-colors mb-2 group"
            >
                <div className={cn("transition-transform duration-200", !jsonPreviewOpen && "-rotate-90")}>
                    <ChevronDown size={12}/>
                </div>
                Payload Preview
                <div className="h-px bg-zinc-800 flex-1 ml-2 group-hover:bg-zinc-700 transition-colors"></div>
            </button>
            
            <AnimatePresence>
                {jsonPreviewOpen && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-black/50 border border-zinc-800 rounded-lg overflow-hidden relative group backdrop-blur-sm"
                >
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                         <CopyButton text={JSON.stringify(data, null, 2)} />
                    </div>
                    <pre className="text-[10px] font-mono p-3 text-emerald-500/90 leading-relaxed whitespace-pre-wrap break-all max-h-32 overflow-y-auto custom-scrollbar selection:bg-emerald-900/30">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SectionTitle({ icon, title }: { icon: React.ReactNode, title: string }) {
    return (
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider pb-2 border-b border-zinc-800/50">
            <span className="text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">{icon}</span> {title}
        </div>
    )
}

// 1. COMPASS CONTROL (Performance Optimized)
function CompassControl({ value, onChange }: { value: number, onChange: (v: number) => void }) {
    // Use raw CSS transform for rotation to avoid React/Framer bridge lag during rapid dragging
    return (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 relative group hover:border-zinc-700 transition-colors">
            <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-300 transition-colors">Scene Rotation</span>
                <span className="font-mono text-amber-500 text-xs bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">{value}°</span>
            </div>
            
            <div className="flex items-center gap-4">
                {/* Visual Dial - Uses pure CSS transform for instant feedback */}
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-zinc-950 rounded-full border border-zinc-800 shadow-inner ring-1 ring-white/5">
                    <div 
                        className="absolute w-full h-full flex items-center justify-center will-change-transform"
                        style={{ transform: `rotate(${value}deg)` }} 
                    >
                        {/* Needle */}
                        <div className="absolute top-1 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,1)] z-10" />
                        <div className="w-0.5 h-6 bg-linear-to-t from-transparent via-amber-500/50 to-amber-500 absolute top-2" />
                    </div>
                    {/* Tick marks */}
                    {[0, 90, 180, 270].map(deg => (
                        <div key={deg} className="absolute w-full h-full flex justify-center p-1" style={{ transform: `rotate(${deg}deg)` }}>
                            <div className="w-0.5 h-1 bg-zinc-800"></div>
                        </div>
                    ))}
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] pointer-events-none"></div>
                </div>

                {/* Performance Optimized Slider */}
                <div className="flex-1 relative h-6 flex items-center group/slider">
                    <input 
                        type="range" min={0} max={360} value={value} 
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    />
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden relative">
                        {/* Use scaleX instead of width for GPU acceleration */}
                        <div 
                            className="h-full bg-amber-600 origin-left will-change-transform" 
                            style={{ transform: `scaleX(${value / 360})` }} 
                        />
                    </div>
                    {/* Thumb with absolute positioning based on % for exact tracking */}
                    <div 
                        className="absolute h-4 w-4 bg-zinc-200 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] border-2 border-amber-500 pointer-events-none transition-transform group-active/slider:scale-110"
                        style={{ left: `${(value/360)*100}%`, transform: 'translateX(-50%)' }}
                    />
                </div>
            </div>
        </div>
    )
}

// 2. UNIFIED PROFESSIONAL SELECT (The "DirectorSelect")
function DirectorSelect({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: any) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside (Simplified logic for demo)
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  
  return (
    <div className="relative z-20" ref={ref}> 
      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1.5 block">{label}</label>
      <button 
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={cn(
            "w-full flex justify-between items-center bg-zinc-900 border rounded-lg px-3 py-2.5 text-xs text-zinc-300 transition-all duration-200 group",
            open ? "border-amber-500/50 ring-1 ring-amber-500/20 bg-zinc-900" : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50"
        )}
      >
        <span className="uppercase tracking-wide font-medium">{value.replace(/_/g, ' ')}</span>
        <ChevronDown size={14} className={cn("transition-transform duration-300 text-zinc-500 group-hover:text-zinc-300", open && "rotate-180 text-amber-500")}/>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="absolute top-full left-0 w-full mt-1.5 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-lg shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] overflow-hidden z-50 py-1"
          >
            {options.map(opt => (
              <div 
                key={opt}
                onClick={(e) => { e.stopPropagation(); onChange(opt); setOpen(false); }}
                className={cn(
                  "px-3 py-2 text-xs cursor-pointer flex justify-between items-center uppercase tracking-wide transition-colors duration-150",
                  value === opt ? "bg-amber-500/10 text-amber-500 font-bold" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                )}
              >
                {opt.replace(/_/g, ' ')}
                {value === opt && <Check size={12} className="text-amber-500" />}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 3. PRECISION SLIDER (Optimized with ScaleX)
function PrecisionSlider({ label, value, min, max, unit, onChange }: { label: string; value: number; min: number; max: number; unit: string; onChange: (val: number) => void }) {
  // Safe Percentage for transform
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
  return (
    <div className="group pt-2">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider group-hover:text-zinc-300 transition-colors">{label}</span>
        <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">{value}{unit}</span>
      </div>
      <div className="relative h-5 flex items-center select-none cursor-pointer">
        {/* Track */}
        <div className="absolute w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
          {/* Fill - GPU Accelerated */}
          <div 
            className="h-full bg-amber-600/80 origin-left will-change-transform" 
            style={{ transform: `scaleX(${percentage / 100})` }}
          />
        </div>
        {/* Thumb */}
        <div 
            className="absolute h-3 w-3 bg-zinc-100 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] z-10 transition-transform duration-75 group-hover:scale-125 border border-amber-500" 
            style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
        />
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"/>
      </div>
    </div>
  );
}

// 4. IMAGE UPLOAD
function ReferenceUpload({ currentImage, onImageUpload }: { currentImage: string | null, onImageUpload: (s: string | null) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onImageUpload(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="group relative">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        
        {currentImage ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-44 rounded-xl overflow-hidden border border-amber-500/30 group/img shadow-lg">
                <img src={currentImage} alt="Reference" className="w-full h-full object-cover opacity-80 group-hover/img:opacity-50 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-sm">
                    <button 
                        onClick={() => onImageUpload(null)}
                        className="flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-full border border-red-500/50 text-xs font-bold hover:bg-red-500/20 transition-all hover:scale-105"
                    >
                        <Trash2 size={14} /> REMOVE IMAGE
                    </button>
                </div>
                {/* Tech overlay */}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 border border-white/10 rounded text-[9px] font-mono text-zinc-400">REF_IMG_01</div>
            </motion.div>
        ) : (
            <motion.div 
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.005, backgroundColor: "rgba(24, 24, 27, 0.6)" }}
                className="h-36 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-zinc-900/20 transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.05)]"
            >
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-3 group-hover:bg-amber-500/20 group-hover:text-amber-500 transition-colors border border-zinc-700 group-hover:border-amber-500/30">
                    <ImageIcon size={18} />
                </div>
                <span className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase group-hover:text-zinc-200 transition-colors">Upload Reference</span>
                <span className="text-[9px] text-zinc-600 mt-1 font-mono">JPG / PNG / WEBP</span>
            </motion.div>
        )}
    </div>
  );
}

// 5. COPY BUTTON HELPER
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button 
            onClick={handleCopy}
            className={cn(
                "p-1.5 rounded transition-all duration-200 border",
                copied ? "bg-green-500/20 border-green-500/50 text-green-500" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border-zinc-700"
            )}
        >
            {copied ? <Check size={12} /> : <Copy size={12}/>}
        </button>
    )
}