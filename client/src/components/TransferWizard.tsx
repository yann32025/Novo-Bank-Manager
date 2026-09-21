import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, CheckCircle2, XCircle, ChevronLeft, Lock, Zap, ArrowRight, Users } from "lucide-react";
import { useCreateTransfer } from "@/hooks/use-banking";

type Mode = "standard" | "instant";
type Step = "form" | "confirm" | "success" | "error";

export function TransferWizard() {
  const [mode, setMode] = useState<Mode>("standard");
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ beneficiary: "", iban: "", bic: "", amount: "", motif: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const createTransfer = useCreateTransfer();

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: k === "iban" || k === "bic" ? e.target.value.toUpperCase() : e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirm");
  };

  const handleConfirm = () => {
    createTransfer.mutate({ iban: form.iban, bic: form.bic, amount: form.amount }, {
      onSuccess: () => setStep("success"),
      onError: (err) => { setErrorMsg(err.message); setStep("error"); }
    });
  };

  const reset = () => { setStep("form"); setForm({ beneficiary: "", iban: "", bic: "", amount: "", motif: "" }); setErrorMsg(""); };

  const fieldClass = "w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 focus:border-white/50 focus:bg-white/15 outline-none text-white placeholder:text-white/40 text-sm font-medium transition-all";
  const labelClass = "block text-[10px] font-black text-white/60 uppercase tracking-widest mb-1.5";

  return (
    <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(160deg, #1a5c3a 0%, #0f3d27 100%)" }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-white text-base">Effectuer un virement</h3>
            <p className="text-white/50 text-xs">Sécurisé · Rapide · Fiable</p>
          </div>
        </div>

        {/* Blocked warning */}
        <div className="flex items-center gap-2.5 bg-amber-900/60 border border-amber-700/50 rounded-xl px-4 py-3 mb-5">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-amber-200 text-xs font-semibold leading-tight">
            Compte bloqué — virement enregistré et traité après déblocage.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-white/10 rounded-xl p-1 gap-1">
          <button onClick={() => setMode("standard")} className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all ${mode === "standard" ? "bg-white text-primary shadow-sm" : "text-white/70"}`}>
            Standard
          </button>
          <button onClick={() => setMode("instant")} className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${mode === "instant" ? "bg-white text-primary shadow-sm" : "text-white/70"}`}>
            <Zap className="w-3.5 h-3.5" /> Instantané
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-6">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Bénéficiaire *</label>
                <div className="relative">
                  <input type="text" value={form.beneficiary} onChange={update("beneficiary")} placeholder="Nom du bénéficiaire" required className={fieldClass + " pr-12"} />
                  <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                </div>
              </div>
              <div>
                <label className={labelClass}>IBAN *</label>
                <input type="text" value={form.iban} onChange={update("iban")} placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX" required className={fieldClass + " font-mono tracking-wider"} />
              </div>
              <div>
                <label className={labelClass}>BIC / SWIFT *</label>
                <input type="text" value={form.bic} onChange={update("bic")} placeholder="LCLFRPPXXX" required className={fieldClass + " font-mono tracking-wider"} />
              </div>
              <div>
                <label className={labelClass}>Montant (€) *</label>
                <div className="relative">
                  <input type="number" value={form.amount} onChange={update("amount")} placeholder="0,00" required min="0.01" step="0.01" className={fieldClass + " pr-10"} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 font-bold text-sm">€</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Motif (optionnel)</label>
                <input type="text" value={form.motif} onChange={update("motif")} placeholder="ex : Loyer, Remboursement..." className={fieldClass} />
              </div>
              <button type="submit" disabled={!form.beneficiary || !form.iban || !form.bic || !form.amount} className="w-full py-4 mt-2 rounded-xl font-black text-primary bg-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm">
                Vérifier le virement <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}

          {step === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <button onClick={() => setStep("form")} className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-bold transition-colors">
                <ChevronLeft className="w-4 h-4" /> Modifier
              </button>
              <div className="bg-white/10 rounded-2xl border border-white/15 p-5 space-y-3">
                <h4 className="text-white font-black text-base mb-4">Récapitulatif</h4>
                {[
                  { label: "Bénéficiaire", val: form.beneficiary },
                  { label: "IBAN", val: form.iban, mono: true },
                  { label: "BIC", val: form.bic, mono: true },
                  { label: "Montant", val: `${form.amount} €`, big: true },
                  ...(form.motif ? [{ label: "Motif", val: form.motif }] : []),
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-start gap-4 py-2.5 border-b border-white/10 last:border-0">
                    <span className="text-white/50 text-xs font-bold uppercase tracking-wider shrink-0">{row.label}</span>
                    <span className={`text-right break-all ${row.mono ? "font-mono text-xs text-white/90" : row.big ? "font-black text-white text-lg" : "text-sm text-white/90 font-semibold"}`}>{row.val}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleConfirm} disabled={createTransfer.isPending} className="w-full py-4 rounded-xl font-black text-primary bg-white shadow-lg hover:-translate-y-0.5 disabled:opacity-60 transition-all text-sm">
                {createTransfer.isPending ? "Enregistrement..." : "Confirmer le virement"}
              </button>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-8 space-y-4">
              <CheckCircle2 className="w-20 h-20 text-green-300" />
              <div>
                <h3 className="text-white font-black text-xl">Virement enregistré</h3>
                <p className="text-white/60 text-sm mt-1">Il sera traité après le déblocage de votre compte.</p>
              </div>
              <button onClick={reset} className="px-8 py-3 rounded-xl font-black text-primary bg-white text-sm">Nouveau virement</button>
            </motion.div>
          )}

          {step === "error" && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-8 space-y-4">
              <XCircle className="w-20 h-20 text-red-300" />
              <div>
                <h3 className="text-white font-black text-xl">Virement refusé</h3>
                <p className="text-white/60 text-sm mt-1">{errorMsg}</p>
              </div>
              <button onClick={reset} className="px-8 py-3 rounded-xl font-black text-primary bg-white text-sm">Réessayer</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
