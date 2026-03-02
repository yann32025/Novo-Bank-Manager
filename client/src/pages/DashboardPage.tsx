import logoUrl from "@assets/IMG_8962_1772449348074.webp";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Home, CreditCard, Send, User, Lock, ShieldCheck, 
  UserCircle, LogOut, Camera, Search, Bell, Info, Gift, 
  HelpCircle, MessageCircle, Phone, Menu, X, Facebook, Instagram, Twitter, Youtube, ChevronRight, CheckCircle, Smartphone
} from "lucide-react";
import { useUser, useLogout } from "@/hooks/use-auth";
import { useAccount, useUpdateProfilePicture } from "@/hooks/use-banking";
import LoadingPage from "./LoadingPage";
import { NotificationBell } from "@/components/NotificationBell";
import { VisaCard } from "@/components/VisaCard";
import { TransferWizard } from "@/components/TransferWizard";

type Tab = "accueil" | "comptes" | "virement" | "vous" | "recherche" | "notifications" | "support" | "cadeaux";

export default function DashboardPage() {
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: account } = useAccount();
  const logout = useLogout();
  const updatePicture = useUpdateProfilePicture();

  const [isAppLoading, setIsAppLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("accueil");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isUserLoading || !user) return null;
  if (isAppLoading) return <LoadingPage />;

  const handleChangePicture = () => {
    const url = window.prompt("Entrez l'URL de votre nouvelle photo de profil:");
    if (url) updatePicture.mutate(url);
  };

  const ads = [
    "Profitez de nos nouveaux taux d'épargne exceptionnels !",
    "Sécurisez vos paiements en ligne avec la carte virtuelle.",
    "Découvrez notre accompagnement sur mesure pour vos projets 2026.",
    "Parrainez un proche et recevez 80€ offerts."
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "accueil":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-24">
            {/* Scrolling Ad */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl py-2 overflow-hidden relative">
              <motion.div 
                animate={{ x: ["100%", "-100%"] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="whitespace-nowrap flex gap-12 text-primary font-bold text-sm"
              >
                {ads.map((ad, i) => <span key={i}>{ad}</span>)}
              </motion.div>
            </div>

            {/* Main Balance Card */}
            <div className="bg-card rounded-3xl p-6 shadow-xl shadow-black/5 border border-border/50 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-muted-foreground font-medium mb-1 uppercase tracking-wider text-[10px]">Épargne & Placements</h2>
                  <p className="font-display text-4xl font-bold text-foreground">
                    {account?.balance ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(account.balance)) : "1 800 000,00 €"}
                  </p>
                </div>
                {account?.isBlocked && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-bold border border-destructive/20">
                    <Lock className="w-3 h-3" /> Bloqué
                  </div>
                )}
              </div>
            </div>

            {/* Expertise Promo */}
            <div className="relative rounded-2xl overflow-hidden aspect-[21/9] flex items-center p-6 text-white group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 z-0" />
              <div className="relative z-10 max-w-[70%]">
                <h4 className="font-display font-bold text-lg leading-tight mb-1">VOTRE EXPERTISE</h4>
                <p className="text-xs text-white/90">Un accompagnement sur mesure pour vos projets 2026</p>
              </div>
              <Shield className="absolute right-4 w-16 h-16 text-white/20 -rotate-12 group-hover:rotate-0 transition-transform" />
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setActiveTab("recherche")} className="p-4 bg-card rounded-2xl border border-border/50 flex flex-col items-center gap-2 hover:bg-primary/5 transition-colors">
                <Search className="w-6 h-6 text-primary" />
                <span className="text-xs font-bold">Recherche</span>
              </button>
              <button onClick={() => setActiveTab("notifications")} className="p-4 bg-card rounded-2xl border border-border/50 flex flex-col items-center gap-2 hover:bg-primary/5 transition-colors">
                <Bell className="w-6 h-6 text-primary" />
                <span className="text-xs font-bold">Alertes</span>
              </button>
              <button onClick={() => setActiveTab("support")} className="p-4 bg-card rounded-2xl border border-border/50 flex flex-col items-center gap-2 hover:bg-primary/5 transition-colors">
                <HelpCircle className="w-6 h-6 text-primary" />
                <span className="text-xs font-bold">Support</span>
              </button>
              <button onClick={() => setActiveTab("cadeaux")} className="p-4 bg-card rounded-2xl border border-border/50 flex flex-col items-center gap-2 hover:bg-primary/5 transition-colors">
                <Gift className="w-6 h-6 text-primary" />
                <span className="text-xs font-bold">Cadeaux</span>
              </button>
            </div>

            {/* Marketing Icons */}
            <div className="flex justify-around py-4">
              <div className="flex flex-col items-center gap-1 opacity-60">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-bold">Sécurité renforcée</span>
              </div>
              <div className="flex flex-col items-center gap-1 opacity-60">
                <Smartphone className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-bold">Interface intuitive</span>
              </div>
            </div>
          </motion.div>
        );

      case "comptes":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-24">
            <h3 className="font-display text-xl font-bold px-1">Comptes & Cartes</h3>
            <VisaCard 
              accountNumber={account?.accountNumber || "00056006910"} 
              accountHolder={user.fullName} 
            />
            <div className="bg-card rounded-2xl p-5 border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary"><CreditCard className="w-5 h-5" /></div>
                <h4 className="font-bold">Crédits & Prêts</h4>
              </div>
              <p className="text-2xl font-bold">0,00 €</p>
            </div>
          </motion.div>
        );

      case "virement":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
            <h3 className="font-display text-xl font-bold mb-4 px-1">Virements & Paiements</h3>
            <TransferWizard />
          </motion.div>
        );

      case "recherche":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-24">
            <h3 className="font-display text-xl font-bold px-1">Recherche & Agences</h3>
            <div className="bg-card rounded-2xl p-4 border border-border/50 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input placeholder="Rechercher une transaction..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border/50 outline-none" />
              </div>
              <button className="w-full py-4 bg-secondary rounded-xl font-bold flex items-center justify-center gap-2">
                <Smartphone className="w-5 h-5" /> Localiser une agence
              </button>
            </div>
          </motion.div>
        );

      case "notifications":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-24">
            <h3 className="font-display text-xl font-bold px-1">Alertes & Messages</h3>
            {["Alerte de solde", "Avis de transaction", "Message important"].map((msg, i) => (
              <div key={i} className="bg-card p-4 rounded-xl border border-border/50 flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-bold text-sm">{msg}</p>
                  <p className="text-xs text-muted-foreground">Notification système NOVO BANCO</p>
                </div>
              </div>
            ))}
          </motion.div>
        );

      case "support":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-24">
            <h3 className="font-display text-xl font-bold px-1">Support & Aide</h3>
            <div className="grid gap-3">
              {[
                { icon: <HelpCircle />, label: "Aide & FAQ" },
                { icon: <MessageCircle />, label: "Chat en ligne" },
                { icon: <Phone />, label: "Contacter conseiller" }
              ].map((item, i) => (
                <button key={i} className="bg-card p-4 rounded-xl border border-border/50 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="text-primary">{item.icon}</div>
                    <span className="font-bold text-sm">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </motion.div>
        );

      case "cadeaux":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-24">
            <h3 className="font-display text-xl font-bold px-1">Espace Cadeaux</h3>
            <div className="bg-card rounded-3xl p-8 border border-border/50 flex flex-col items-center text-center">
              <Gift className="w-16 h-16 text-primary mb-4" />
              <h4 className="text-lg font-bold">Vos récompenses</h4>
              <p className="text-sm text-muted-foreground mt-2">Vous n'avez pas encore de cadeaux disponibles. Continuez à utiliser votre compte pour en débloquer !</p>
            </div>
          </motion.div>
        );

      case "vous":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-24">
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary border-4 border-background shadow-md">
                    {user.profilePicture ? <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" /> : <UserCircle className="w-full h-full text-muted-foreground/50 p-2" />}
                  </div>
                  <button onClick={handleChangePicture} className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full"><Camera className="w-4 h-4" /></button>
                </div>
                <div>
                  <h4 className="font-display font-bold text-xl">{user.fullName}</h4>
                  <p className="text-muted-foreground text-sm">@{user.username}</p>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="p-4 rounded-xl bg-background border border-border">
                  <h4 className="font-bold text-foreground flex items-center gap-2 mb-1"><ShieldCheck className="w-4 h-4 text-primary" /> Assurances & Sécurité</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Protection financière & Technique</p>
                  <div className="space-y-1 text-xs">
                    <p>• Assurance : protection financière contre les risques.</p>
                    <p>• Sécurité : protection technique et prévention des fraudes.</p>
                  </div>
                </div>
                <button onClick={() => logout.mutate()} className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-destructive/10 text-destructive font-bold"><LogOut className="w-5 h-5" /> Déconnexion</button>
              </div>
            </div>

            {/* Socials */}
            <div className="flex justify-center gap-6 py-4">
              <Facebook className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
              <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
              <Youtube className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-2xl mx-auto md:border-x border-border/50 relative">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border/50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMenuOpen(true)} className="p-1 hover:bg-secondary rounded-lg transition-colors"><Menu className="w-6 h-6" /></button>
          <img src={logoUrl} alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
          <h1 className="font-display font-bold text-lg tracking-tight">NOVO BANCO</h1>
        </div>
        <NotificationBell />
      </header>

      {/* Hamburger Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed left-0 top-0 bottom-0 w-[80%] max-w-[300px] bg-card border-r border-border/50 z-50 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-xl" />
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                {[
                  { icon: <Home />, label: "Accueil", tab: "accueil" },
                  { icon: <CreditCard />, label: "Mes Comptes", tab: "comptes" },
                  { icon: <Send />, label: "Virements", tab: "virement" },
                  { icon: <Search />, label: "Recherche", tab: "recherche" },
                  { icon: <Bell />, label: "Notifications", tab: "notifications" },
                  { icon: <Gift />, label: "Cadeaux", tab: "cadeaux" },
                  { icon: <User />, label: "Mon Profil", tab: "vous" },
                  { icon: <HelpCircle />, label: "Support & Aide", tab: "support" }
                ].map((item) => (
                  <button key={item.tab} onClick={() => { setActiveTab(item.tab as Tab); setIsMenuOpen(false); }} className={`flex items-center gap-4 p-4 rounded-xl font-bold transition-all ${activeTab === item.tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-secondary text-foreground/80'}`}>
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
              <button onClick={() => logout.mutate()} className="mt-auto flex items-center gap-4 p-4 rounded-xl font-bold text-destructive hover:bg-destructive/10 transition-all"><LogOut /> Déconnexion</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 p-6 overflow-x-hidden">{renderTabContent()}</main>

      <nav className="fixed md:absolute bottom-0 left-0 right-0 bg-card border-t border-border/50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="flex justify-around items-center px-2 py-3 max-w-2xl mx-auto">
          <NavButton icon={<Home />} label="Accueil" isActive={activeTab === "accueil"} onClick={() => setActiveTab("accueil")} />
          <NavButton icon={<CreditCard />} label="Comptes" isActive={activeTab === "comptes"} onClick={() => setActiveTab("comptes")} />
          <div className="relative -top-6">
            <button onClick={() => setActiveTab("virement")} className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30 transition-transform ${activeTab === "virement" ? 'bg-primary scale-110' : 'bg-primary/90 hover:bg-primary hover:scale-105'}`}><Send className="w-6 h-6 ml-1" /></button>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Virement</span>
          </div>
          <NavButton icon={<User />} label="Vous" isActive={activeTab === "vous"} onClick={() => setActiveTab("vous")} />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
      <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>{icon}</div>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-primary' : ''}`}>{label}</span>
    </button>
  );
}
