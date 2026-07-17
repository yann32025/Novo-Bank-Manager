import { motion } from "framer-motion";

export default function LoadingPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary text-white"
    >
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md shadow-2xl mb-8 overflow-hidden"
      >
        <img src="/assets/logo.png" alt="BNP Paribas" className="w-18 h-18 object-contain p-2" />
      </motion.div>
      
      <h2 className="font-display text-3xl font-bold mb-2 tracking-tight">BNP Paribas</h2>
      
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-white/90 font-medium tracking-wide">Chargement de votre compte...</p>
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-white/80 text-sm font-bold bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-sm"
        >
          Compte temporairement bloqué
        </motion.p>
      </div>
    </motion.div>
  );
}
