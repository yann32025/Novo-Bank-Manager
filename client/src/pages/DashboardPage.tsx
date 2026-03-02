import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Home, CreditCard, Send, User, Lock, ShieldCheck, UserCircle, LogOut, Camera } from "lucide-react";
import { useUser, useLogout } from "@/hooks/use-auth";
import { useAccount, useUpdateProfilePicture } from "@/hooks/use-banking";
import LoadingPage from "./LoadingPage";
import { NotificationBell } from "@/components/NotificationBell";
import { VisaCard } from "@/components/VisaCard";
import { TransferWizard } from "@/components/TransferWizard";

type Tab = "accueil" | "comptes" | "virement" | "vous";

export default function DashboardPage() {
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: account } = useAccount();
  const logout = useLogout();
  const updatePicture = useUpdateProfilePicture();

  const [isAppLoading, setIsAppLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("accueil");

  // Simulate the 2.5s loading screen on initial dashboard mount
  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isUserLoading || !user) return null;
  
  if (isAppLoading) {
    return <LoadingPage />;
  }

  const handleChangePicture = () => {
    const url = window.prompt("Entrez l'URL de votre nouvelle photo de profil:");
    if (url) {
      updatePicture.mutate(url);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "accueil":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-24">
            
            {/* Section 2: Epargne & Placements (Balance) */}
            <div className="bg-card rounded-3xl p-8 shadow-xl shadow-black/5 border border-border/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-muted-foreground font-medium mb-1 uppercase tracking-wider text-xs">Épargne & Placements</h2>
                  <p className="font-display text-4xl md:text-5xl font-bold text-foreground">
                    {account?.balance ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(account.balance)) : "1 800 000,00 €"}
                  </p>
                </div>
                {account?.isBlocked && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 text-destructive rounded-full text-sm font-bold border border-destructive/20 shadow-sm">
                    <Lock className="w-4 h-4" /> Bloqué
                  </div>
                )}
              </div>
            </div>

            {/* Section 1: Comptes & Cartes (Visa Card) */}
            <div>
              <h3 className="font-display text-xl font-bold mb-4 px-1">Comptes & Cartes</h3>
              <VisaCard 
                accountNumber={account?.accountNumber || "00056006910"} 
                accountHolder={user.fullName} 
              />
            </div>

          </motion.div>
        );

      case "comptes":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-24">
            {/* Section 4: Crédits & Prêts */}
            <div className="bg-card rounded-2xl p-6 shadow-lg shadow-black/5 border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-secondary rounded-xl text-primary">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl">Crédits & Prêts</h3>
              </div>
              <div className="p-6 bg-background rounded-xl border border-border flex flex-col items-center justify-center py-10">
                <p className="font-display text-3xl font-bold text-foreground">0,00 €</p>
                <p className="text-muted-foreground text-sm mt-2">Aucun crédit en cours</p>
              </div>
            </div>
          </motion.div>
        );

      case "virement":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
            {/* Section 3: Virements & Paiements */}
            <h3 className="font-display text-xl font-bold mb-4 px-1">Virements & Paiements</h3>
            <TransferWizard />
          </motion.div>
        );

      case "vous":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-24">
            
            {/* Section 6: Profil & Paramètres */}
            <div className="bg-card rounded-2xl p-6 shadow-lg shadow-black/5 border border-border/50">
              <h3 className="font-display font-bold text-xl mb-6">Profil & Paramètres</h3>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary border-4 border-background shadow-md">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-full h-full text-muted-foreground/50 p-2" />
                    )}
                  </div>
                  <button 
                    onClick={handleChangePicture}
                    className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h4 className="font-display font-bold text-xl">{user.fullName}</h4>
                  <p className="text-muted-foreground text-sm">@{user.username}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => logout.mutate()}
                  className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-destructive/10 text-destructive font-bold hover:bg-destructive text-white hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" /> Déconnexion
                </button>
              </div>
            </div>

            {/* Section 5: Assurances & Sécurité */}
            <div className="bg-card rounded-2xl p-6 shadow-lg shadow-black/5 border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-secondary rounded-xl text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl">Assurances & Sécurité</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-background border border-border">
                  <h4 className="font-bold text-foreground flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-primary" /> Assurance
                  </h4>
                  <p className="text-sm text-muted-foreground">protection financière contre les risques.</p>
                </div>
                
                <div className="p-4 rounded-xl bg-background border border-border">
                  <h4 className="font-bold text-foreground flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-primary" /> Sécurité
                  </h4>
                  <p className="text-sm text-muted-foreground">protection technique et prévention des fraudes.</p>
                </div>
              </div>
            </div>

          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-2xl mx-auto md:border-x border-border/50 shadow-2xl relative">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border/50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
            <Shield className="text-white w-5 h-5" />
          </div>
          <h1 className="font-display font-bold text-lg tracking-tight">NOVO BANCO</h1>
        </div>
        <NotificationBell />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed md:absolute bottom-0 left-0 right-0 bg-card border-t border-border/50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="flex justify-around items-center px-2 py-3 max-w-2xl mx-auto">
          <NavButton 
            icon={<Home />} label="Accueil" 
            isActive={activeTab === "accueil"} 
            onClick={() => setActiveTab("accueil")} 
          />
          <NavButton 
            icon={<CreditCard />} label="Comptes" 
            isActive={activeTab === "comptes"} 
            onClick={() => setActiveTab("comptes")} 
          />
          <div className="relative -top-6">
            <button 
              onClick={() => setActiveTab("virement")}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30 transition-transform ${activeTab === "virement" ? 'bg-primary scale-110' : 'bg-primary/90 hover:bg-primary hover:scale-105'}`}
            >
              <Send className="w-6 h-6 ml-1" />
            </button>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Virement</span>
          </div>
          <NavButton 
            icon={<User />} label="Vous" 
            isActive={activeTab === "vous"} 
            onClick={() => setActiveTab("vous")} 
          />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
    >
      <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-primary' : ''}`}>
        {label}
      </span>
    </button>
  );
}
