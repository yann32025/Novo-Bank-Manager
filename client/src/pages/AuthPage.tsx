import logoUrl from "@assets/IMG_8962_1772449348074.webp";
import bgUrl from "@assets/59dfb3fc-cf2e-4f27-a14f-815070a6fffb_1772449777977.jpeg";
import { useState } from "react";
import { useLogin } from "@/hooks/use-auth";
import { motion } from "framer-motion";

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
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={bgUrl} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      </div>

      {/* Login Box */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[320px] px-4"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex flex-col items-center shadow-2xl">
          
          <div className="mb-6 flex flex-col items-center">
            <img src={logoUrl} alt="NOVO BANCO" className="w-24 h-auto mb-4 rounded-xl shadow-lg" />
            <h1 className="font-display text-xl font-bold text-white tracking-tight">NOVO BANCO</h1>
            <p className="text-white/70 text-xs mt-1">Espace Client Sécurisé</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <input
                type="text"
                placeholder="Identifiant"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-white/50 text-white font-medium text-sm"
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-white/50 text-white font-medium font-mono tracking-widest text-sm"
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-8 h-5 rounded-full transition-colors relative flex items-center px-1 ${rememberMe ? 'bg-primary' : 'bg-white/30 border border-white/20'}`}>
                  <motion.div 
                    layout
                    className="w-3 h-3 bg-white rounded-full shadow-sm"
                    animate={{ x: rememberMe ? 12 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={rememberMe} 
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="text-xs font-medium text-white/90 group-hover:text-white transition-colors">Se souvenir de moi</span>
              </label>
            </div>

            {login.isError && (
              <div className="p-2 rounded-lg bg-destructive/20 border border-destructive/30 text-white text-xs font-medium text-center">
                {login.error.message}
              </div>
            )}

            <button
              type="submit"
              disabled={login.isPending || !username || !password}
              className="w-full py-3 mt-2 rounded-xl font-bold text-white bg-primary shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all duration-200 text-sm"
            >
              {login.isPending ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 w-full flex flex-col gap-2 text-center text-xs font-medium text-white/80">
            <button className="hover:text-white transition-colors">Identifiant oublié</button>
            <button className="hover:text-white transition-colors">Mot de passe oublié</button>
          </div>

          <div className="w-full h-px bg-white/10 my-4" />

          <button className="text-white text-xs font-bold hover:text-primary transition-colors">
            Ouvrir un compte
          </button>
        </div>
      </motion.div>
    </div>
  );
}
