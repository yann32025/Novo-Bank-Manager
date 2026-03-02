import { useState } from "react";
import { useLogin } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function AuthPage() {
  const [username, setUsername] = useState("Manoel11");
  const [password, setPassword] = useState("1515");
  const [rememberMe, setRememberMe] = useState(false);
  
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ username, password });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
      {/* Beautiful background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      {/* Login Box */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm px-4"
      >
        <div className="glass-panel rounded-3xl p-8 flex flex-col items-center">
          
          <div className="mb-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
              <Shield className="text-white w-8 h-8" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">NOVO BANCO</h1>
            <p className="text-muted-foreground text-sm mt-1">Espace Client Sécurisé</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div>
              <input
                type="text"
                placeholder="Identifiant"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-white/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/70 font-medium"
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-white/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/70 font-medium font-mono tracking-widest"
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-1 ${rememberMe ? 'bg-primary' : 'bg-white/50 border border-white'}`}>
                  <motion.div 
                    layout
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                    animate={{ x: rememberMe ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={rememberMe} 
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">Se souvenir de moi</span>
              </label>
            </div>

            {login.isError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
                {login.error.message}
              </div>
            )}

            <button
              type="submit"
              disabled={login.isPending || !username || !password}
              className="w-full py-4 mt-2 rounded-xl font-bold text-white bg-primary shadow-[0_8px_20px_-4px_rgba(34,197,94,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(34,197,94,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-200"
            >
              {login.isPending ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-8 w-full flex flex-col gap-3 text-center text-sm font-medium text-primary hover:text-primary/80">
            <button className="transition-colors hover:underline underline-offset-4">Identifiant oublié</button>
            <button className="transition-colors hover:underline underline-offset-4">Mot de passe oublié</button>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-6" />

          <button className="text-foreground text-sm font-bold hover:text-primary transition-colors">
            Ouvrir un compte
          </button>
        </div>
      </motion.div>
    </div>
  );
}
