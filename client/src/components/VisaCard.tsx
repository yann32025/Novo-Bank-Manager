import { motion } from "framer-motion";
import { Nfc } from "lucide-react";

interface VisaCardProps {
  accountNumber: string;
  accountHolder: string;
}

export function VisaCard({ accountNumber, accountHolder }: VisaCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative w-full max-w-sm mx-auto aspect-[1.586] rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 p-6 flex flex-col justify-between"
      style={{ background: "linear-gradient(135deg, hsl(145 63% 42%), hsl(145 63% 25%))" }}
    >
      {/* Watermark */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <img src="/assets/logo.png" alt="" className="w-48 h-48 object-contain" />
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col items-start gap-0.5">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/20 border border-white/30 shadow-lg flex items-center justify-center">
            <img src="/assets/logo.png" alt="BNP" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-[8px] text-white/70 font-black tracking-wide uppercase mt-0.5">BNP Paribas</span>
        </div>
        <span className="text-white/90 font-display font-bold text-xl tracking-wider">VISA</span>
      </div>

      <div className="flex justify-start relative z-10">
        <Nfc className="text-white/40 w-7 h-7 rotate-90" />
      </div>

      {/* Account Number */}
      <div className="relative z-10 flex flex-col gap-0.5 mt-auto mb-4">
        <span className="text-white/60 text-[9px] font-medium tracking-widest uppercase">N° DU COMPTE</span>
        <span className="text-white font-mono text-xl md:text-2xl tracking-[0.2em] font-medium drop-shadow-sm">
          {accountNumber || "00056006910"}
        </span>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-white/60 text-[9px] font-medium tracking-widest uppercase">TITULAIRE</span>
          <span className="text-white font-display font-semibold tracking-wide uppercase text-sm">
            {accountHolder || "ALEXANDRA JADE CLARA"}
          </span>
        </div>
        <div className="w-10 h-7 bg-white/20 rounded-md backdrop-blur-sm" />
      </div>
    </motion.div>
  );
}
