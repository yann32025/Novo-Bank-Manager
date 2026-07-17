import bgUrl from "@assets/59dfb3fc-cf2e-4f27-a14f-815070a6fffb_1772449777977.jpeg";
import { useState } from "react";
import { useLogin } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ username, password });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={bgUrl} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[330px] px-4"
      >
        <div className="bg-white/12 backdrop-blur-xl border border-white/25 rounded-3xl p-7 flex flex-col items-center shadow-2xl">
          {/* Logo & Bank Name */}
          <div className="mb-7 flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/30 shadow-xl flex items-center justify-center overflow-hidden">
              <img src="/assets/logo.png" alt="BNP Paribas" className="w-16 h-16 object-contain" />
            </div>
            <div className="text-center">
              <h1 className="font-display text-xl font-black text-white tracking-tight">BNP Paribas</h1>
              <p className="text-white/60 text-xs font-medium mt-0.5">Espace Client Sécurisé</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-3.5">
            {/* Username */}
            <div className="flex flex-col gap-1">
              <label className="text-white/70 text-[11px] font-bold uppercase tracking-wider px-1">Identifiant</label>
              <input
                type="text"
                placeholder="Saisir votre identifiant"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 focus:border-white/60 focus:bg-white/20 outline-none transition-all placeholder:text-white/35 text-white font-medium text-sm"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-white/70 text-[11px] font-bold uppercase tracking-wider px-1">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Saisir votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 focus:border-white/60 focus:bg-white/20 outline-none transition-all placeholder:text-white/35 text-white font-medium text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 px-1">
              <button type="button" onClick={() => setRememberMe(!rememberMe)} className="flex items-center gap-2">
                <div className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${rememberMe ? 'bg-primary' : 'bg-white/25'}`}>
                  <motion.div
                    layout
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                    animate={{ x: rememberMe ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
                <span className="text-xs font-semibold text-white/80">Se souvenir de moi</span>
              </button>
            </div>

            {login.isError && (
              <div className="p-3 rounded-xl bg-red-500/25 border border-red-400/40 text-white text-xs font-semibold text-center">
                {login.error.message}
              </div>
            )}

            <button
              type="submit"
              disabled={login.isPending || !username || !password}
              className="w-full py-3.5 rounded-xl font-black text-white bg-primary shadow-xl hover:shadow-primary/50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 text-sm tracking-wide"
            >
              {login.isPending ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-5 w-full flex justify-around text-[11px] font-semibold text-white/65">
            <button className="hover:text-white transition-colors">Identifiant oublié</button>
            <span className="text-white/30">|</span>
            <button className="hover:text-white transition-colors">Mot de passe oublié</button>
          </div>

          <div className="w-full h-px bg-white/15 my-4" />
          <button className="text-white/80 text-xs font-bold hover:text-white transition-colors">
            Ouvrir un compte
          </button>
        </div>
      </motion.div>
    </div>
  );
}
