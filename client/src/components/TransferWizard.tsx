import bgUrl from "@assets/59dfb3fc-cf2e-4f27-a14f-815070a6fffb_1772449777977.jpeg";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle, ChevronLeft, ShieldCheck, CreditCard } from "lucide-react";
import { useCreateTransfer } from "@/hooks/use-banking";

type Step = 1 | 2 | 3 | "error" | "success";

export function TransferWizard() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({ iban: "", bic: "", amount: "" });
  const [errorMsg, setErrorMsg] = useState("");
  
  const createTransfer = useCreateTransfer();

  const handleNext = () => {
    if (step === 1 && formData.iban && formData.bic) setStep(2);
    else if (step === 2 && formData.amount) setStep(3);
  };

  const handleConfirm = () => {
    createTransfer.mutate(formData, {
      onSuccess: () => setStep("success"),
      onError: (err) => {
        setErrorMsg(err.message);
        setStep("error");
      }
    });
  };

  const reset = () => {
    setStep(1);
    setFormData({ iban: "", bic: "", amount: "" });
    setErrorMsg("");
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-white/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono text-sm shadow-inner";

  return (
    <div className="relative bg-card rounded-2xl overflow-hidden shadow-2xl border border-border/30 min-h-[450px] flex flex-col">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img src={bgUrl} alt="Background" className="w-full h-full object-cover opacity-15 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-card/80 via-card/90 to-card" />
      </div>

      <div className="relative z-10 p-6 flex-1 flex flex-col">
        {typeof step === "number" && (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-lg">Virement sécurisé</h3>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1.5 w-6 rounded-full transition-all duration-300 ${s <= step ? 'bg-primary scale-x-110' : 'bg-primary/20'}`} />
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">IBAN du bénéficiaire</label>
                  <input type="text" value={formData.iban} onChange={(e) => setFormData({...formData, iban: e.target.value.toUpperCase()})} placeholder="FR76 0000 0000 0000 0000 0000 000" className={inputClasses} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">Code BIC / SWIFT</label>
                  <input type="text" value={formData.bic} onChange={(e) => setFormData({...formData, bic: e.target.value.toUpperCase()})} placeholder="XXXXXXXX" className={inputClasses} />
                </div>
              </div>
              <button onClick={handleNext} disabled={!formData.iban || !formData.bic} className="mt-6 w-full py-4 rounded-xl font-bold bg-primary text-white shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                Étape suivante <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
              <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm font-bold mb-4 w-max transition-colors"><ChevronLeft className="w-4 h-4" /> Retour</button>
              <div className="flex-1 flex flex-col justify-center">
                <label className="block text-xs font-bold text-muted-foreground mb-2 text-center uppercase tracking-wider">Montant à transférer</label>
                <div className="relative max-w-xs mx-auto w-full">
                  <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} placeholder="0.00" className="w-full bg-transparent text-center font-display text-5xl font-bold text-foreground border-b-2 border-primary/30 focus:border-primary outline-none py-2 pb-4 no-arrows transition-colors" />
                  <span className="absolute right-0 bottom-6 text-2xl font-bold text-primary">€</span>
                </div>
              </div>
              <button onClick={handleNext} disabled={!formData.amount || Number(formData.amount) <= 0} className="mt-6 w-full py-4 rounded-xl font-bold bg-primary text-white shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                Récapitulatif <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
              <button onClick={() => setStep(2)} className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm font-bold mb-4 w-max transition-colors"><ChevronLeft className="w-4 h-4" /> Modifier</button>
              <div className="flex-1 space-y-4">
                <div className="p-5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-white/50">
                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Montant</span>
                    <span className="font-display font-bold text-2xl text-primary">{formData.amount} €</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="block text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Destinataire (IBAN)</span>
                      <span className="font-mono text-xs block break-all bg-white/50 p-2 rounded-lg border border-white/50">{formData.iban}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">BIC</span>
                      <span className="font-mono text-xs font-bold">{formData.bic}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={handleConfirm} disabled={createTransfer.isPending} className="mt-6 w-full py-4 rounded-xl font-bold bg-primary text-white shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 disabled:opacity-70 transition-all flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5" /> {createTransfer.isPending ? "Validation..." : "Confirmer le virement"}
              </button>
            </motion.div>
          )}

          {step === "error" && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, -10, 10, 0] }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
                <XCircle className="w-24 h-24 text-destructive drop-shadow-xl" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-display font-bold text-destructive mb-2 uppercase tracking-tight">Virement refusé</h3>
                <p className="text-muted-foreground font-medium">{errorMsg}</p>
              </div>
              <button onClick={reset} className="px-8 py-3 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all">Réessayer</button>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
                <CheckCircle2 className="w-24 h-24 text-primary drop-shadow-xl" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-2 uppercase tracking-tight">Virement réussi</h3>
                <p className="text-muted-foreground font-medium">Votre demande a été enregistrée.</p>
              </div>
              <button onClick={reset} className="px-8 py-3 rounded-xl font-bold bg-primary text-white shadow-lg hover:shadow-primary/40 transition-all">Nouveau virement</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
