import Header from "../components/directors-chair/Header";
import DirectorsChair from "../components/directors-chair/DirectorsChair";

export default function Home() {
  return (
    <main className="h-screen w-full flex flex-col bg-fibo-dark overflow-hidden font-sans">
      
      {/* 1. TOP HEADER */}
      <Header />

      {/* 2. MAIN WORKSPACE (The Grid) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: Director's Chair (Fixed width) */}
        <section className="w-[370px] h-full flex-shrink-0 z-10 shadow-xl">
           <DirectorsChair />
        </section>

        {/* CENTER PANEL: Viewfinder (Flexible width) */}
        <section className="flex-1 h-full relative flex flex-col border-r border-fibo-border bg-black/20">
          
          {/* Viewfinder Header */}
          <div className="px-4 py-3 border-b border-fibo-border bg-fibo-dark/50 backdrop-blur-sm">
            <h2 className="text-fibo-textLight font-bold text-sm tracking-wide">
              The Viewfinder <span className="text-fibo-text text-xs font-normal ml-2">(55%)</span>
            </h2>
          </div>

          {/* Viewfinder Content (The Grid Area) */}
          <div className="flex-1 p-4 grid grid-cols-2 gap-4 overflow-y-auto">
             {/* Empty State Grid Lines */}
             <div className="col-span-2 h-full border border-dashed border-fibo-border/30 rounded-lg flex items-center justify-center">
                <span className="text-fibo-border text-xs tracking-widest uppercase">Waiting for Input...</span>
             </div>
          </div>
        </section>

        {/* RIGHT PANEL: Shot List (Fixed width) */}
        <section className="w-[280px] h-full bg-fibo-panel flex flex-col">
           {/* Shot List Header */}
           <div className="px-4 py-3 border-b border-fibo-border bg-fibo-dark/50 backdrop-blur-sm">
            <h2 className="text-fibo-textLight font-bold text-sm tracking-wide">
              The Shot List <span className="text-fibo-text text-xs font-normal ml-2">(20%)</span>
            </h2>
          </div>

          {/* Shot List Placeholder Content */}
          <div className="flex-1 p-4">
             <div className="text-fibo-text text-xs text-center mt-10 opacity-50">
                No shots generated yet.
             </div>
          </div>
        </section>

      </div>
    </main>
  );
}