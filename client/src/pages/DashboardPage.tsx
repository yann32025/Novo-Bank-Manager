import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, CreditCard, Send, User, Lock, ShieldCheck,
  UserCircle, LogOut, Camera, Search, Bell, Gift,
  HelpCircle, MessageCircle, Phone, Menu, X,
  Facebook, Instagram, Twitter, Youtube, ChevronRight,
  Smartphone, Star, TrendingUp, Zap, Award, AlertTriangle,
  ArrowUpRight, ArrowDownLeft, Wallet, BarChart2
} from "lucide-react";
import { useUser, useLogout } from "@/hooks/use-auth";
import { useAccount, useUpdateProfilePicture } from "@/hooks/use-banking";
import LoadingPage from "./LoadingPage";
import { NotificationBell } from "@/components/NotificationBell";
import { VisaCard } from "@/components/VisaCard";
import { TransferWizard } from "@/components/TransferWizard";

type Tab = "accueil" | "comptes" | "virement" | "cadeaux" | "vous";

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
    const url = window.prompt("URL de votre nouvelle photo de profil :");
    if (url) updatePicture.mutate(url);
  };

  const formatBalance = (balance?: string | number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(Number(balance || 167000));

  const renderTabContent = () => {
    switch (activeTab) {

      /* ──────────────── ACCUEIL ──────────────── */
      case "accueil":
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-28">

            {/* Hero Balance Card */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-green-800 p-6 text-white shadow-2xl shadow-primary/30">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/15 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest mb-1">Épargne & Placements</p>
                    <p className="font-display text-[2.6rem] font-black leading-none">{formatBalance(account?.balance)}</p>
                  </div>
                  <img src="/assets/logo.png" alt="BNP" className="w-10 h-10 object-contain opacity-90" />
                </div>
                {account?.isBlocked && (
                  <div className="mt-3 flex items-center gap-2 bg-red-600/80 backdrop-blur-sm border border-red-400/40 rounded-xl px-3 py-2">
                    <Lock className="w-3.5 h-3.5 text-white shrink-0" />
                    <p className="text-white text-[11px] font-bold leading-tight">
                      COMPTE BLOQUÉ — Certaines fonctionnalités désactivées. <span className="font-normal opacity-90">Motif : Procédure successorale.</span>
                    </p>
                  </div>
                )}
                <div className="mt-4 flex gap-3">
                  <button onClick={() => setActiveTab("virement")} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/25 rounded-xl px-4 py-2 text-xs font-bold transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5" /> Virer
                  </button>
                  <button onClick={() => setActiveTab("comptes")} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/25 rounded-xl px-4 py-2 text-xs font-bold transition-all">
                    <CreditCard className="w-3.5 h-3.5" /> Ma carte
                  </button>
                </div>
              </div>
            </div>

            {/* Scrolling ticker */}
            <div className="overflow-hidden rounded-xl border border-primary/15 bg-primary/5 py-2.5">
              <motion.div
                animate={{ x: ["100%", "-150%"] }}
                transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
                className="whitespace-nowrap text-primary text-xs font-bold flex gap-10"
              >
                {["Profitez de nos taux d'épargne exceptionnels !", "Sécurisez vos paiements avec la carte virtuelle.", "Un accompagnement sur mesure — 2026.", "Parrainez un proche et recevez 80 € offerts.", "Consultez vos conseillers en ligne 24h/24."].map((t, i) => <span key={i} className="px-4">{t}</span>)}
              </motion.div>
            </div>

            {/* VOTRE EXPERTISE section */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-primary/80" />
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #00b050 0%, transparent 60%)" }} />
              <div className="relative z-10 p-6 flex items-center justify-between min-h-[140px]">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-primary/30 border border-primary/40 rounded-full px-3 py-1 mb-3">
                    <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                    <span className="text-yellow-200 text-[10px] font-black uppercase tracking-widest">Premium</span>
                  </div>
                  <h3 className="text-white font-display font-black text-xl leading-tight">VOTRE EXPERTISE</h3>
                  <p className="text-white/70 text-xs mt-1.5 max-w-[180px] leading-relaxed">Un accompagnement sur mesure pour vos projets 2026.</p>
                </div>
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-primary/30 border border-primary/40 flex items-center justify-center shadow-xl shadow-primary/30">
                    <BarChart2 className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-3.5 h-3.5 text-yellow-900" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Send className="w-5 h-5" />, label: "Virement", tab: "virement" as Tab, color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10" },
                { icon: <Gift className="w-5 h-5" />, label: "Cadeaux", tab: "cadeaux" as Tab, color: "text-pink-500 bg-pink-50 dark:bg-pink-500/10" },
                { icon: <HelpCircle className="w-5 h-5" />, label: "Support", tab: "vous" as Tab, color: "text-orange-500 bg-orange-50 dark:bg-orange-500/10" },
              ].map((item) => (
                <button key={item.tab} onClick={() => setActiveTab(item.tab)} className="p-4 bg-card rounded-2xl border border-border/50 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className={`p-2 rounded-xl ${item.color}`}>{item.icon}</div>
                  <span className="text-xs font-bold">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Recent activity placeholder */}
            <div className="bg-card rounded-2xl border border-border/50 p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-sm">Activité récente</h4>
                <button className="text-xs text-primary font-bold">Voir tout</button>
              </div>
              <div className="space-y-3">
                {[
                  { icon: <ArrowDownLeft className="w-4 h-4 text-green-500" />, label: "Virement reçu", amount: "+ 2 400,00 €", color: "text-green-600" },
                  { icon: <ArrowUpRight className="w-4 h-4 text-red-400" />, label: "Prélèvement", amount: "- 128,50 €", color: "text-red-500" },
                  { icon: <Wallet className="w-4 h-4 text-blue-500" />, label: "Dépôt épargne", amount: "+ 10 000,00 €", color: "text-blue-600" },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-xl">{tx.icon}</div>
                    <span className="text-sm flex-1 font-medium">{tx.label}</span>
                    <span className={`text-sm font-black ${tx.color}`}>{tx.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      /* ──────────────── COMPTES ──────────────── */
      case "comptes":
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-28">
            <h3 className="font-display text-2xl font-black px-1">Comptes & Cartes</h3>
            <VisaCard accountNumber={account?.accountNumber || "00056006910"} accountHolder={user.fullName} />
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-2xl p-4 border border-border/50">
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Solde disponible</p>
                <p className="font-display font-black text-xl">{formatBalance(account?.balance)}</p>
                {account?.isBlocked && <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full"><Lock className="w-2.5 h-2.5" /> Bloqué</span>}
              </div>
              <div className="bg-card rounded-2xl p-4 border border-border/50">
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Crédits & Prêts</p>
                <p className="font-display font-black text-xl">0,00 €</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-4 border border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-xl"><ShieldCheck className="w-5 h-5 text-primary" /></div>
                <h4 className="font-bold">Sécurité du compte</h4>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" /> Protection 3D Secure active</p>
                <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" /> Authentification forte activée</p>
              </div>
            </div>
          </motion.div>
        );

      /* ──────────────── VIREMENT ──────────────── */
      case "virement":
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pb-28">
            <h3 className="font-display text-2xl font-black mb-4 px-1">Virements & Paiements</h3>
            <TransferWizard />
          </motion.div>
        );

      /* ──────────────── CADEAUX ──────────────── */
      case "cadeaux":
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 pb-28">
            <h3 className="font-display text-2xl font-black px-1">Espace Cadeaux</h3>

            {/* Hero cadeau */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 p-6 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl border border-white/30 flex items-center justify-center shadow-lg">
                  <Gift className="w-9 h-9 text-white" />
                </div>
                <div>
                  <h4 className="font-display font-black text-xl leading-tight">Vos récompenses</h4>
                  <p className="text-white/80 text-xs mt-1">Accumulez des points et gagnez des cadeaux exclusifs.</p>
                </div>
              </div>
            </div>

            {/* Points counter */}
            <div className="bg-card rounded-2xl p-5 border border-border/50 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Vos points</p>
                <p className="font-display font-black text-4xl">0 <span className="text-base font-bold text-muted-foreground">pts</span></p>
              </div>
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Star className="w-8 h-8 text-primary fill-primary/20" />
              </div>
            </div>

            {/* Offers grid */}
            <h4 className="font-bold text-sm px-1 text-muted-foreground uppercase tracking-wider">Offres disponibles</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Zap className="w-6 h-6 text-yellow-500" />, name: "Cashback 5%", pts: "500 pts", bg: "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200/50" },
                { icon: <Award className="w-6 h-6 text-blue-500" />, name: "Bon d'achat", pts: "1 000 pts", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200/50" },
                { icon: <TrendingUp className="w-6 h-6 text-green-500" />, name: "Taux boosté", pts: "2 000 pts", bg: "bg-green-50 dark:bg-green-500/10 border-green-200/50" },
                { icon: <Star className="w-6 h-6 text-pink-500" />, name: "Accès VIP", pts: "5 000 pts", bg: "bg-pink-50 dark:bg-pink-500/10 border-pink-200/50" },
              ].map((offer, i) => (
                <button key={i} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-center hover:shadow-md hover:-translate-y-0.5 transition-all ${offer.bg}`}>
                  <div className="p-2 bg-white/70 dark:bg-black/20 rounded-xl shadow-sm">{offer.icon}</div>
                  <span className="text-sm font-black leading-tight">{offer.name}</span>
                  <span className="text-[10px] font-bold text-muted-foreground bg-background/80 rounded-full px-2 py-0.5">{offer.pts}</span>
                </button>
              ))}
            </div>

            <div className="bg-secondary/50 rounded-2xl p-4 text-center">
              <p className="text-muted-foreground text-xs">Utilisez votre carte BNP Paribas pour accumuler des points à chaque transaction.</p>
            </div>
          </motion.div>
        );

      /* ──────────────── VOUS ──────────────── */
      case "vous":
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-28">
            {/* Profile card */}
            <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm">
              <div className="flex items-center gap-4 mb-5">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary border-4 border-background shadow-lg">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-full h-full text-muted-foreground/40" />
                    )}
                  </div>
                  <button onClick={handleChangePicture} className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full shadow-lg border-2 border-background">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <h4 className="font-display font-black text-xl leading-tight">{user.fullName}</h4>
                  <p className="text-muted-foreground text-sm">@{user.username}</p>
                  {account?.isBlocked && (
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-black text-destructive bg-destructive/10 border border-destructive/20 px-2.5 py-1 rounded-full">
                      <Lock className="w-2.5 h-2.5" /> COMPTE BLOQUÉ
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { icon: <ShieldCheck className="w-4 h-4 text-primary" />, label: "Assurances & Sécurité" },
                  { icon: <Bell className="w-4 h-4 text-primary" />, label: "Notifications & Alertes" },
                  { icon: <Smartphone className="w-4 h-4 text-primary" />, label: "Mes appareils" },
                  { icon: <HelpCircle className="w-4 h-4 text-primary" />, label: "Aide & Support" },
                ].map((item, i) => (
                  <button key={i} className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-secondary transition-colors text-left">
                    <div className="p-1.5 bg-primary/10 rounded-lg">{item.icon}</div>
                    <span className="font-semibold text-sm flex-1">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="bg-card rounded-2xl p-4 border border-border/50">
              <h5 className="font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wider">Contacter BNP Paribas</h5>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: <MessageCircle className="w-5 h-5" />, label: "Chat" },
                  { icon: <Phone className="w-5 h-5" />, label: "Appel" },
                  { icon: <Search className="w-5 h-5" />, label: "Agences" },
                ].map((s, i) => (
                  <button key={i} className="flex flex-col items-center gap-1.5 p-3 bg-secondary rounded-xl hover:bg-primary/10 transition-colors">
                    <div className="text-primary">{s.icon}</div>
                    <span className="text-[11px] font-bold">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => logout.mutate()} className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 bg-destructive/10 text-destructive font-black border border-destructive/20 hover:bg-destructive/20 transition-colors">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>

            <div className="flex justify-center gap-6 py-1 opacity-50">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => <Icon key={i} className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity" />)}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-2xl mx-auto md:border-x border-border/50 relative">

      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border/40 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2.5">
          <button onClick={() => setIsMenuOpen(true)} className="p-1.5 hover:bg-secondary rounded-xl transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <img src="/assets/logo.png" alt="BNP" className="w-7 h-7 object-contain" />
          <h1 className="font-display font-black text-base tracking-tight">BNP Paribas</h1>
        </div>
        <div className="flex items-center gap-2">
          {account?.isBlocked && <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />}
          <NotificationBell />
        </div>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 220 }} className="fixed left-0 top-0 bottom-0 w-[78%] max-w-[290px] bg-card border-r border-border/50 z-50 flex flex-col shadow-2xl">
              <div className="p-5 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/assets/logo.png" alt="BNP" className="w-8 h-8 object-contain" />
                  <div>
                    <p className="font-black text-sm">BNP Paribas</p>
                    <p className="text-[10px] text-muted-foreground">Espace Client</p>
                  </div>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-secondary rounded-xl"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 p-4 space-y-1 overflow-y-auto">
                {[
                  { icon: <Home className="w-4 h-4" />, label: "Accueil", tab: "accueil" },
                  { icon: <CreditCard className="w-4 h-4" />, label: "Mes Comptes", tab: "comptes" },
                  { icon: <Send className="w-4 h-4" />, label: "Virements", tab: "virement" },
                  { icon: <Gift className="w-4 h-4" />, label: "Espace Cadeaux", tab: "cadeaux" },
                  { icon: <User className="w-4 h-4" />, label: "Mon Profil", tab: "vous" },
                ].map((item) => (
                  <button key={item.tab} onClick={() => { setActiveTab(item.tab as Tab); setIsMenuOpen(false); }} className={`w-full flex items-center gap-3 p-3.5 rounded-2xl font-bold text-sm transition-all ${activeTab === item.tab ? "bg-primary text-white shadow-lg shadow-primary/25" : "hover:bg-secondary text-foreground/80"}`}>
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-border/50">
                <button onClick={() => logout.mutate()} className="w-full flex items-center gap-3 p-3.5 rounded-2xl font-bold text-sm text-destructive hover:bg-destructive/10 transition-all">
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 p-4 overflow-x-hidden">{renderTabContent()}</main>

      {/* Bottom Nav */}
      <nav className="fixed md:absolute bottom-0 left-0 right-0 max-w-2xl mx-auto bg-card/95 backdrop-blur-xl border-t border-border/40 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-40">
        <div className="flex justify-around items-center px-2 py-3">
          {[
            { icon: <Home className="w-5 h-5" />, label: "Accueil", tab: "accueil" as Tab },
            { icon: <CreditCard className="w-5 h-5" />, label: "Comptes", tab: "comptes" as Tab },
            { icon: <Send className="w-5 h-5" />, label: "Virement", tab: "virement" as Tab, accent: true },
            { icon: <Gift className="w-5 h-5" />, label: "Cadeaux", tab: "cadeaux" as Tab },
            { icon: <User className="w-5 h-5" />, label: "Vous", tab: "vous" as Tab },
          ].map((item) => (
            item.accent ? (
              <button key={item.tab} onClick={() => setActiveTab(item.tab)} className="relative -top-5 flex flex-col items-center gap-0.5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all ${activeTab === item.tab ? "bg-primary scale-110 shadow-primary/40" : "bg-primary/90 hover:bg-primary hover:scale-105"}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wide mt-1 ${activeTab === item.tab ? "text-primary" : "text-muted-foreground"}`}>{item.label}</span>
              </button>
            ) : (
              <button key={item.tab} onClick={() => setActiveTab(item.tab)} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${activeTab === item.tab ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                <motion.div animate={{ scale: activeTab === item.tab ? 1.15 : 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>{item.icon}</motion.div>
                <span className="text-[10px] font-black uppercase tracking-wide">{item.label}</span>
              </button>
            )
          ))}
        </div>
      </nav>
    </div>
  );
}
