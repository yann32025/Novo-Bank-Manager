import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle, ChevronLeft } from "lucide-react";
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

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-background border-2 border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono text-sm";

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/30 min-h-[400px] flex flex-col">
      {typeof step === "number" && (
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-display font-semibold text-lg">Nouveau virement</h3>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-2 w-8 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-secondary'}`}
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">IBAN du bénéficiaire</label>
                <input 
                  type="text" 
                  value={formData.iban} 
                  onChange={(e) => setFormData({...formData, iban: e.target.value.toUpperCase()})}
                  placeholder="FR76 0000 0000 0000 0000 0000 000"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Code BIC / SWIFT</label>
                <input 
                  type="text" 
                  value={formData.bic} 
                  onChange={(e) => setFormData({...formData, bic: e.target.value.toUpperCase()})}
                  placeholder="XXXXXXXX"
                  className={inputClasses}
                />
              </div>
            </div>
            <button 
              onClick={handleNext}
              disabled={!formData.iban || !formData.bic}
              className="mt-6 w-full py-4 rounded-xl font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              Étape suivante <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm font-medium mb-4 w-max transition-colors">
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
            <div className="flex-1 flex flex-col justify-center">
              <label className="block text-sm font-medium text-muted-foreground mb-2 text-center">Montant à virer</label>
              <div className="relative max-w-xs mx-auto w-full">
                <input 
                  type="number" 
                  value={formData.amount} 
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                  className="w-full bg-transparent text-center font-display text-5xl font-bold text-foreground border-b-2 border-border focus:border-primary outline-none py-2 pb-4 no-arrows"
                />
                <span className="absolute right-4 top-4 text-2xl font-bold text-muted-foreground">€</span>
              </div>
            </div>
            <button 
              onClick={handleNext}
              disabled={!formData.amount || Number(formData.amount) <= 0}
              className="mt-6 w-full py-4 rounded-xl font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              Vérifier le virement <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <button onClick={() => setStep(2)} className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm font-medium mb-4 w-max transition-colors">
              <ChevronLeft className="w-4 h-4" /> Modifier
            </button>
            
            <div className="flex-1 space-y-4">
              <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-muted-foreground text-sm">Montant</span>
                  <span className="font-display font-bold text-xl">{formData.amount} €</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs mb-1">Vers l'IBAN</span>
                  <span className="font-mono text-sm block">{formData.iban}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs mb-1">BIC</span>
                  <span className="font-mono text-sm block">{formData.bic}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleConfirm}
              disabled={createTransfer.isPending}
              className="mt-6 w-full py-4 rounded-xl font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
            >
              {createTransfer.isPending ? "Traitement..." : "Confirmer le virement"}
            </button>
          </motion.div>
        )}

        {step === "error" && (
          <motion.div 
            key="error"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-8"
          >
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, -10, 10, 0] }} 
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            >
              <XCircle className="w-32 h-32 text-destructive drop-shadow-lg" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-display font-bold text-destructive mb-2">Virement refusé</h3>
              <p className="text-muted-foreground">{errorMsg}</p>
            </div>
            <button 
              onClick={reset}
              className="mt-4 px-8 py-3 rounded-xl font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Retour
            </button>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-8"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
              <CheckCircle2 className="w-32 h-32 text-primary drop-shadow-lg" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-2">Virement réussi</h3>
              <p className="text-muted-foreground">Votre demande a été prise en compte.</p>
            </div>
            <button 
              onClick={reset}
              className="mt-4 px-8 py-3 rounded-xl font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Nouveau virement
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
