import { motion } from "framer-motion";

const STEPS = [
  { min: 0,  label: "Connexion sécurisée établie..." },
  { min: 20, label: "Vérification de votre identité..." },
  { min: 40, label: "Chargement de votre espace client..." },
  { min: 60, label: "Récupération de vos données bancaires..." },
  { min: 80, label: "Finalisation de l'accès sécurisé..." },
  { min: 95, label: "Bienvenue dans votre espace LCL" },
];

export default function LoadingPage({ progress = 0 }: { progress?: number }) {
  const currentStep = [...STEPS].reverse().find(s => progress >= s.min) || STEPS[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(160deg, #003d20 0%, #005029 40%, #007a3d 100%)" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/3 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-xs px-8">
        {/* Logo */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mb-10 w-28 h-28 rounded-3xl overflow-hidden shadow-2xl"
          style={{ border: "2px solid rgba(255,255,255,0.2)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
        >
          <img src="/assets/lcl-logo.webp" alt="LCL" className="w-full h-full object-cover" />
        </motion.div>

        {/* Title */}
        <h1 className="text-white font-black text-3xl tracking-tight mb-1">LCL</h1>
        <p className="text-green-300 text-sm font-medium mb-12 tracking-wide">Espace Client Sécurisé</p>

        {/* Progress bar */}
        <div className="w-full mb-4">
          <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #4ade80, #86efac)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-white/40 text-[10px] font-mono">{progress}%</span>
            <span className="text-white/40 text-[10px] font-mono">100%</span>
          </div>
        </div>

        {/* Current step label */}
        <motion.p
          key={currentStep.label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-white/80 text-sm font-medium text-center mb-8 min-h-[20px]"
        >
          {currentStep.label}
        </motion.p>

        {/* Spinner */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="w-5 h-5 rounded-full border-2 border-white/25 border-t-white"
          />
          <span className="text-white/50 text-xs font-medium">Veuillez patienter...</span>
        </div>

        {/* Security badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 flex items-center gap-2 px-5 py-2.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <p className="text-white/60 text-xs font-semibold">Connexion SSL 256-bit</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
