import { Eye, Wifi, Lock } from "lucide-react";

interface VisaCardProps {
  accountNumber: string;
  accountHolder: string;
  isBlocked?: boolean;
}

export function VisaCard({ accountNumber, accountHolder, isBlocked }: VisaCardProps) {
  return (
    <div className="relative w-full aspect-[1.586] rounded-3xl overflow-hidden shadow-2xl"
      style={{ background: "linear-gradient(145deg, #1e2d5a 0%, #0d1b3e 60%, #0a1428 100%)" }}>
      {/* Subtle shimmer */}
      <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 30% 20%, #3b5fc0 0%, transparent 60%)" }} />
      <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at 80% 80%, #1a9c5b 0%, transparent 50%)" }} />

      <div className="relative z-10 p-6 flex flex-col justify-between h-full">
        {/* Top row */}
        <div className="flex justify-between items-start">
          <div className="w-9 h-7 rounded-md bg-amber-400/90 shadow-md" style={{ background: "linear-gradient(135deg, #f6c042 0%, #e6a817 100%)" }} />
          <div className="flex items-center gap-2">
            {isBlocked && (
              <span className="flex items-center gap-1 bg-red-500/80 text-white text-[9px] font-black px-2 py-1 rounded-full border border-red-400/50">
                <Lock className="w-2.5 h-2.5" /> Bloquée
              </span>
            )}
            <Wifi className="w-5 h-5 text-white/50 rotate-90" />
          </div>
        </div>

        {/* Card number */}
        <div>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Numéro de carte</p>
          <div className="flex items-center gap-3">
            <span className="text-white/60 font-mono text-sm tracking-widest">•••• •••• ••••</span>
            <span className="text-white font-mono text-sm tracking-widest font-bold">
              {accountNumber?.slice(-4) || "9010"}
            </span>
            <Eye className="w-4 h-4 text-white/30 ml-1" />
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-0.5">Titulaire</p>
            <p className="text-white font-black text-sm uppercase tracking-wide">{accountHolder || "ALEXANDRA JADE CLARA"}</p>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-1.5">Expire</p>
            <p className="text-white/80 font-mono text-xs">12/29</p>
          </div>
          <div className="text-right">
            <p className="font-serif text-white text-2xl font-bold italic tracking-tight">VISA</p>
          </div>
        </div>
      </div>
    </div>
  );
}
