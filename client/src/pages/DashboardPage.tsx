import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, CreditCard, Send, User, Lock,
  UserCircle, LogOut, Camera, Search, Bell, Gift,
  HelpCircle, MessageCircle, ChevronRight,
  Facebook, Instagram, Twitter, Youtube,
  Award, TrendingUp, MapPin,
  PiggyBank, AlertTriangle, ArrowLeft, X,
  Star, Shield, Menu, ArrowDownLeft, ArrowUpRight,
  SendHorizonal, ShieldCheck
} from "lucide-react";
import { useUser, useLogout } from "@/hooks/use-auth";
import { useAccount, useUpdateProfilePicture } from "@/hooks/use-banking";
import LoadingPage from "./LoadingPage";
import { VisaCard } from "@/components/VisaCard";
import { TransferWizard } from "@/components/TransferWizard";

type Tab = "accueil" | "comptes" | "virement" | "vous";
type SubPage = null | "cadeaux" | "credits" | "assurances" | "epargne" | "profil";

const LCL_GREEN = "#005b4f";
const BANK_NAME = "LCL";
const BANK_LOGO = "/assets/lcl-logo.webp";

const NOTIFS = [
  {
    id: 1,
    icon: "🔒",
    title: "Compte bloqué",
    body: "Votre compte est bloqué. Consultez les informations de simulation affichées ou contactez votre conseiller.",
    unread: true,
  },
  {
    id: 2,
    icon: "ℹ️",
    title: "Mise à jour des conditions",
    body: "Les conditions générales d'utilisation de LCL ont été mises à jour.",
    unread: false,
  },
];

export default function DashboardPage() {
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: account } = useAccount();
  const logout = useLogout();
  const updatePicture = useUpdateProfilePicture();

  const [isAppLoading, setIsAppLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("accueil");
  const [subPage, setSubPage] = useState<SubPage>(null);

  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [readNotifs, setReadNotifs] = useState<number[]>([]);

  const [searchTab, setSearchTab] = useState<"transactions" | "localisation">("transactions");
  const [searchQuery, setSearchQuery] = useState("");

  const [chatActive, setChatActive] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatMessages, setChatMessages] = useState<{ from: "bot" | "user"; text: string }[]>([
    { from: "bot", text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const DURATION = 15000;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / DURATION) * 100));
      setLoadProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setIsAppLoading(false);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatActive]);

  if (isUserLoading || !user) return null;
  if (isAppLoading) return <LoadingPage progress={loadProgress} />;

  const balance = account?.balance ? Number(account.balance) : 5000000;
  const releaseFee = account?.releaseFee ? Number(account.releaseFee) : 70000;
  const fmt4 = (v: number) => new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v) + " €";
  const iban = "FR76 0005 6006 910";
  const unreadCount = NOTIFS.filter(n => n.unread && !readNotifs.includes(n.id)).length;

  const goSub = (p: SubPage) => { setSubPage(p); setHamburgerOpen(false); };
  const goTab = (t: Tab) => { setActiveTab(t); setSubPage(null); setHamburgerOpen(false); };

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    const userText = chatMsg.trim();
    setChatMessages(prev => [...prev, { from: "user", text: userText }]);
    setChatMsg("");
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        from: "bot",
        text: "Merci pour votre message. Un conseiller va vous répondre dans les plus brefs délais. Pour toute urgence, appelez le 3009."
      }]);
    }, 1000);
  };

  const transactions = [
    { dir: "in", label: "Virement reçu – Trésor Public", amount: "+900,00 €" },
    { dir: "out", label: "Frais bancaires mensuels", amount: "-7,50 €" },
    { dir: "out", label: "Prélèvement assurance ha…", amount: "-12,00 €" },
    { dir: "in", label: "Remboursement santé", amount: "+45,00 €" },
    { dir: "out", label: "Cotisation carte bancaire", amount: "-45,00 €" },
  ].filter(t => !searchQuery || t.label.toLowerCase().includes(searchQuery.toLowerCase()));

  /* ── LCL Logo component ── */
  const LCLLogo = ({ size = 10, rounded = "xl" }: { size?: number; rounded?: string }) => (
    <div className={`bg-white rounded-${rounded} flex items-center justify-center shadow-sm border border-white/50`} style={{ width: size * 4, height: size * 4 }}>
      <img src={BANK_LOGO} alt={BANK_NAME} className="object-contain" style={{ width: size * 3, height: size * 3 }} />
    </div>
  );

  /* ─── SUB-PAGES ─── */
  const renderSubPage = () => {
    switch (subPage) {
      case "profil":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="pb-28">
            {/* Dark card header */}
            <div className="rounded-3xl overflow-hidden mb-5" style={{ background: "linear-gradient(160deg, #1a1a2e 0%, #111111 100%)" }}>
              <div className="flex items-center p-4 gap-2">
                <button onClick={() => setSubPage(null)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <span className="text-white font-bold text-base flex-1 text-center">Profil & Paramètres</span>
                <div className="w-8" />
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center pb-8 pt-2">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full border-4 border-amber-400 overflow-hidden bg-zinc-700">
                    {user.profilePicture
                      ? <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                      : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white font-black text-3xl">{user.fullName?.charAt(0) || "A"}</span>
                        </div>
                      )}
                  </div>
                  <button
                    onClick={() => {
                      const u = prompt("Entrez l'URL de votre photo de profil :");
                      if (u) updatePicture.mutate(u);
                    }}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-zinc-900"
                    style={{ background: "#f59e0b" }}
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-white font-black text-2xl">{user.fullName}</p>
                <p className="text-zinc-400 text-sm mt-1">Identifiant : {user.username}</p>
              </div>
            </div>

            {/* PARAMÈTRES */}
            <p className="text-zinc-400 text-[11px] font-black uppercase tracking-widest mb-2 px-1">PARAMÈTRES</p>
            <div className="space-y-3 mb-6">
              {[
                { icon: <ShieldCheck className="w-5 h-5 text-white" />, label: "Sécurité du compte", sub: "Mot de passe, Face ID" },
                { icon: <Bell className="w-5 h-5 text-white" />, label: "Notifications", sub: "Alertes et SMS" },
                { icon: <HelpCircle className="w-5 h-5 text-white" />, label: "Aide & Support", sub: "FAQ et contact" },
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-colors" style={{ background: "#1c1c1e" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#2c2c2e" }}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{item.label}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{item.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>
              ))}
            </div>

            {/* Déconnexion */}
            <button
              onClick={() => logout.mutate()}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-red-400 text-base border border-red-900/50"
              style={{ background: "#2d0c0c" }}
            >
              <LogOut className="w-5 h-5" /> Déconnexion
            </button>
          </motion.div>
        );

      case "cadeaux":
        return (
          <SubPageLayout title="Espace Cadeaux" onBack={() => setSubPage(null)}>
            <div className="rounded-3xl overflow-hidden p-5" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <p className="text-purple-200 text-[10px] font-black uppercase tracking-widest">VOTRE SOLDE</p>
                  <p className="text-white font-black text-4xl">0 <span className="text-2xl">pts</span></p>
                </div>
              </div>
              <div className="flex gap-8 mb-4">
                <div><p className="text-purple-300 text-[10px] font-bold">Statut</p><p className="text-white text-sm font-black">🥈 Argent</p></div>
                <div><p className="text-purple-300 text-[10px] font-bold">Prochain palier</p><p className="text-white text-sm font-black">🥇 Or — 500 pts</p></div>
              </div>
              <p className="text-purple-300 text-[10px] font-bold mb-1.5 flex justify-between"><span>Progression vers Or</span><span>0/500 pts</span></p>
              <div className="w-full h-2.5 bg-purple-900/60 rounded-full"><div className="h-full w-0 bg-yellow-400 rounded-full" /></div>
            </div>
            <div className="bg-card rounded-2xl p-4 border border-border/50">
              <h4 className="font-black text-sm flex items-center gap-2 mb-3"><Star className="w-4 h-4 text-purple-500" /> Comment gagner des points ?</h4>
              <div className="grid grid-cols-3 gap-2">
                {["+5 pts\nPaiement carte", "+10 pts\nVirement effectué", "+100 pts\nParrainage"].map((t, i) => (
                  <div key={i} className="bg-purple-50 dark:bg-purple-500/10 rounded-xl p-3 text-center border border-purple-200/50">
                    {t.split("\n").map((l, j) => <p key={j} className={j === 0 ? "font-black text-purple-700 dark:text-purple-300 text-sm" : "text-muted-foreground text-[10px] mt-0.5"}>{l}</p>)}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2"><Gift className="w-4 h-4 text-purple-500" /><h4 className="font-black text-sm">Catalogue récompenses</h4></div>
              {[
                { emoji: "🎮", name: "Bon d'achat FNAC", pts: 500, val: "Valeur 20 €", avail: true },
                { emoji: "📦", name: "Carte cadeau Amazon", pts: 750, val: "Valeur 30 €", avail: true },
                { emoji: "🎬", name: "Abonnement Netflix 1 mois", pts: 400, val: "Valeur 15 €", avail: false },
                { emoji: "🏖️", name: "Chèque vacances", pts: 1500, val: "Valeur 50 €", avail: true },
                { emoji: "❤️", name: "Don à une association", pts: 200, val: "Valeur 10 €", avail: true },
                { emoji: "🏦", name: "Réduction frais bancaires", pts: 300, val: "1 mois offert", avail: true },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-border/30 last:border-0">
                  <span className="text-2xl">{r.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{r.name}</p>
                    <p className="text-muted-foreground text-xs flex items-center gap-1.5 mt-0.5"><Star className="w-3 h-3 text-yellow-500 fill-yellow-400" /> {r.pts} points · {r.val}</p>
                  </div>
                  <button className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-black border ${r.avail ? "bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200/50" : "bg-secondary text-muted-foreground border-border/50"}`}>
                    {r.avail ? "Échanger" : "Indispo"}
                  </button>
                </div>
              ))}
            </div>
          </SubPageLayout>
        );

      case "credits":
        return (
          <SubPageLayout title="Crédits & Prêts" onBack={() => setSubPage(null)}>
            <div className="rounded-3xl p-6 text-white" style={{ background: "linear-gradient(135deg, #1e3a6e 0%, #0d244a 100%)" }}>
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-2">ENCOURS TOTAL</p>
              <p className="font-black text-4xl mb-1">0,00 €</p>
              <p className="text-blue-200 text-sm">Aucun crédit actif sur votre compte.</p>
            </div>
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <div className="px-4 py-3.5 border-b border-border/50"><h4 className="font-black text-sm">Offres de crédit disponibles</h4></div>
              {[
                { emoji: "🏠", name: "Crédit immobilier", desc: "Financez votre achat ou travaux", rate: "À partir de 3,20 %/an" },
                { emoji: "💵", name: "Prêt personnel", desc: "Jusqu'à 75 000 € sans justificatif", rate: "À partir de 5,90 %/an" },
                { emoji: "🚗", name: "Crédit auto", desc: "Neuf ou occasion, LOA incluse", rate: "À partir de 4,50 %/an" },
                { emoji: "🎓", name: "Prêt étudiant", desc: "Études en France ou à l'étranger", rate: "À partir de 1,00 %/an" },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-4 border-b border-border/30 last:border-0">
                  <span className="text-2xl">{c.emoji}</span>
                  <div className="flex-1"><p className="font-bold text-sm">{c.name}</p><p className="text-muted-foreground text-xs">{c.desc}</p><p className="text-primary text-xs font-bold mt-1">{c.rate}</p></div>
                  <button className="shrink-0 px-3 py-1.5 bg-secondary rounded-full text-xs font-bold text-primary border border-primary/20">Simuler</button>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/40 rounded-2xl">
              <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-blue-700 dark:text-blue-300 text-xs font-medium">Pour souscrire à un crédit, votre compte doit être actif. Contactez votre conseiller au 3009.</p>
            </div>
          </SubPageLayout>
        );

      case "assurances":
        return (
          <SubPageLayout title="Assurances & Sécurité" onBack={() => setSubPage(null)}>
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /><h4 className="font-bold text-sm">Mes Assurances</h4></div>
              {[
                { name: "Assurance Habitation", desc: "Protection de votre logement contre sinistres" },
                { name: "Assurance Auto", desc: "Couverture accidents, vol, bris de glace" },
                { name: "Assurance Vie", desc: "Épargne et protection de vos proches" },
                { name: "Prévoyance", desc: "Incapacité de travail, décès, invalidité" },
              ].map((a, i) => (
                <div key={i} className="flex items-start justify-between px-4 py-4 border-b border-border/30 last:border-0 gap-3">
                  <div><p className="font-bold text-sm">{a.name}</p><p className="text-muted-foreground text-xs mt-0.5">{a.desc}</p></div>
                  <div className="text-right shrink-0"><p className="text-orange-500 text-xs font-bold">Non souscrit</p><button className="text-primary text-xs font-black mt-0.5">Souscrire</button></div>
                </div>
              ))}
            </div>
            <div className="bg-card rounded-2xl border border-border/50 p-4">
              <h4 className="font-bold text-sm flex items-center gap-2 mb-3"><Lock className="w-4 h-4 text-primary" /> Sécurité du compte</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" /> Protection 3D Secure active</p>
                <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" /> Authentification forte activée</p>
                <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-400" /> Compte temporairement bloqué</p>
              </div>
            </div>
          </SubPageLayout>
        );

      case "epargne":
        return (
          <SubPageLayout title="Épargne & Placements" onBack={() => setSubPage(null)}>
            <div className="rounded-3xl p-6 text-white" style={{ background: "linear-gradient(135deg, #007a3d 0%, #005029 100%)" }}>
              <div className="flex items-center gap-3 mb-2">
                <img src={BANK_LOGO} alt={BANK_NAME} className="w-10 h-10 object-contain rounded-lg" />
                <p className="text-green-200 text-[10px] font-black uppercase tracking-widest">ÉPARGNE {BANK_NAME}</p>
              </div>
              <p className="font-black text-4xl">{fmt4(balance)}</p>
            </div>
            <div className="bg-card rounded-2xl border border-border/50 p-4">
              <h4 className="font-bold text-sm mb-3">Produits d'épargne</h4>
              {[
                { name: "Livret A", taux: "3,00 %", plafond: "22 950 €" },
                { name: "LDDS", taux: "3,00 %", plafond: "12 000 €" },
                { name: "Assurance Vie", taux: "Variable", plafond: "Non limité" },
              ].map((p, i) => (
                <div key={i} className="flex justify-between items-center py-3.5 border-b border-border/30 last:border-0">
                  <div><p className="font-bold text-sm">{p.name}</p><p className="text-muted-foreground text-xs">Plafond {p.plafond}</p></div>
                  <p className="text-primary font-black text-sm">{p.taux}</p>
                </div>
              ))}
            </div>
          </SubPageLayout>
        );

      default: return null;
    }
  };

  /* ─── TABS ─── */
  const renderTab = () => {
    if (subPage) return renderSubPage();

    switch (activeTab) {

      case "accueil":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pb-28">
            {/* ⚠️ ALERT — ABOVE balance */}
            {account?.isBlocked && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600/60 rounded-2xl">
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm font-black">Certaines fonctionnalités de votre compte sont désactivées.</p>
                   <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-0.5 font-semibold">Montant bloqué : {fmt4(balance)} · Frais affichés (simulation) : {fmt4(releaseFee)}.</p>
                </div>
              </div>
            )}

            {/* Balance card */}
            <div className="rounded-3xl p-5 text-white shadow-xl" style={{ background: "linear-gradient(135deg, #007a3d 0%, #005029 100%)" }}>
              <p className="text-green-200 text-[10px] font-black uppercase tracking-widest mb-1">COMPTE COURANT BLOQUÉ</p>
              <div className="flex justify-between items-start">
                <p className="font-black text-4xl">{fmt4(balance)}</p>
                {account?.isBlocked && (
                  <span className="flex items-center gap-1 bg-white/15 border border-white/30 text-white text-[10px] font-black px-3 py-1.5 rounded-xl">
                    <Lock className="w-3 h-3" /> BLOQUÉ
                  </span>
                )}
              </div>
              <p className="text-green-200 text-xs font-mono mt-2">{iban}</p>
            </div>

            {/* Offre LCL */}
            <div className="rounded-3xl p-5 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #005029 0%, #007a3d 100%)" }}>
              <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-xl translate-x-8 -translate-y-8" />
               <p className="text-green-300 text-[10px] font-black uppercase tracking-widest mb-1">OFFRE {BANK_NAME}</p>
              <h3 className="font-black text-xl mb-1">Crédit Immobilier</h3>
               <p className="text-green-200 text-xs mb-4">Réalisez votre projet maison avec {BANK_NAME}</p>
              <button onClick={() => goSub("credits")} className="bg-white text-primary font-black text-sm px-5 py-2.5 rounded-xl">Simuler</button>
              <span className="absolute right-5 bottom-4 text-4xl">🏠</span>
            </div>

            {/* Accès rapide */}
            <div>
              <p className="text-muted-foreground text-[11px] font-black uppercase tracking-widest mb-3 px-1">ACCÈS RAPIDE</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { emoji: "💰", label: "Épargne", action: () => goSub("epargne") },
                  { emoji: "🏦", label: "Crédits", action: () => goSub("credits") },
                  { emoji: "🛡️", label: "Assurances", action: () => goSub("assurances") },
                  { emoji: "📄", label: "Documents", action: () => {} },
                  { emoji: "🎁", label: "Cadeaux", action: () => goSub("cadeaux") },
                  { emoji: "📍", label: "Agences", action: () => {} },
                ].map((item, i) => (
                  <button key={i} onClick={item.action} className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-primary/30 transition-all active:scale-95">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-xs font-bold text-foreground/80">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 rounded-2xl p-4">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm"><Award className="w-4 h-4 text-purple-600" /></div>
                <h4 className="font-black text-sm">Expertise reconnue</h4>
                <p className="text-muted-foreground text-xs mt-1.5 leading-relaxed">Plus de 150 ans d'expertise bancaire au service de votre réussite financière.</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 rounded-2xl p-4">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm"><TrendingUp className="w-4 h-4 text-amber-600" /></div>
                <h4 className="font-black text-sm">Investissez malin</h4>
                <p className="text-muted-foreground text-xs mt-1.5 leading-relaxed">Nos conseillers vous accompagnent dans la construction de votre patrimoine.</p>
              </div>
            </div>

            {/* VOTRE EXPERTISE — logo visible */}
            <div className="rounded-3xl p-5 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #007a3d 0%, #005029 100%)" }}>
               <img src={BANK_LOGO} alt={BANK_NAME} className="absolute right-4 bottom-4 w-14 h-14 object-contain opacity-60 rounded-xl" />
              <p className="text-green-300 text-[10px] font-black uppercase tracking-widest mb-1">VOTRE EXPERTISE</p>
              <h3 className="font-black text-lg leading-tight max-w-[65%]">Un accompagnement sur mesure pour vos projets</h3>
              <button className="mt-4 bg-white/20 border border-white/30 text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2">En savoir plus →</button>
            </div>

            {/* LCL Banner */}
            <div className="flex items-center gap-4 bg-card border border-border/50 rounded-2xl px-5 py-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center" style={{ background: LCL_GREEN }}>
                <img src={BANK_LOGO} alt={BANK_NAME} className="w-10 h-10 object-contain" />
              </div>
              <div>
                <p className="font-black text-base">{BANK_NAME}</p>
                <p className="text-muted-foreground text-xs">Banque de proximité</p>
              </div>
            </div>

            {/* Social */}
            <div className="bg-card border border-border/50 rounded-2xl p-5">
              <p className="font-bold text-sm mb-4">Suivez-nous sur</p>
              <div className="flex gap-3">
                {[{ Icon: Facebook, bg: "#1877F2" }, { Icon: Instagram, bg: "#E4405F" }, { Icon: Twitter, bg: "#000000" }, { Icon: Youtube, bg: "#FF0000" }].map(({ Icon, bg }, i) => (
                  <button key={i} className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md" style={{ backgroundColor: bg }}>
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            <p className="text-muted-foreground text-[10px] text-center px-4 leading-relaxed">
              Interface de démonstration — aucune opération bancaire réelle<br />
              Les informations affichées sont fictives.
            </p>
          </motion.div>
        );

      case "comptes":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pb-28">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: LCL_GREEN }}>
                <img src={BANK_LOGO} alt={BANK_NAME} className="w-6 h-6 object-contain" />
              </div>
              <h3 className="font-black text-xl">Comptes & Cartes</h3>
            </div>
            <div className="bg-card border border-border/50 rounded-3xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">COMPTE COURANT</p>
                  <p className="font-black text-base mt-0.5">{user.fullName}</p>
                </div>
                {account?.isBlocked && (
                  <span className="flex items-center gap-1 bg-red-50 text-red-600 text-[10px] font-black px-3 py-1.5 rounded-xl border border-red-200">
                    <Lock className="w-3 h-3" /> Bloqué
                  </span>
                )}
              </div>
               <p className="text-muted-foreground text-xs mb-1">Somme bloquée</p>
              <p className="text-primary font-black text-3xl mb-1">{fmt4(balance)}</p>
               <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                 <p className="text-amber-800 text-[10px] font-black uppercase tracking-wider">Information de simulation</p>
                 <p className="text-amber-700 text-xs mt-1">Frais affichés pour le déblocage : <strong>{fmt4(releaseFee)}</strong></p>
               </div>
              <p className="text-muted-foreground text-xs font-mono mb-4">{iban}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/60 rounded-xl p-3"><p className="text-muted-foreground text-[10px] font-bold">Plafond carte</p><p className="font-black text-sm mt-0.5">1 500,00 €</p></div>
                <div className="bg-secondary/60 rounded-xl p-3"><p className="text-muted-foreground text-[10px] font-bold">Découvert auth.</p><p className="font-black text-sm mt-0.5">0,00 €</p></div>
              </div>
            </div>
            <VisaCard accountNumber={account?.accountNumber || "00056006910"} accountHolder={user.fullName} isBlocked={account?.isBlocked} />
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50"><h4 className="font-black text-sm">Dernières opérations</h4></div>
              <div className="px-4 py-8 text-center text-muted-foreground text-sm">Aucune opération récente</div>
            </div>
          </motion.div>
        );

      case "virement":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-28">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: LCL_GREEN }}>
                <img src={BANK_LOGO} alt={BANK_NAME} className="w-6 h-6 object-contain" />
              </div>
              <h3 className="font-black text-xl">Virements & Paiements</h3>
            </div>
            <TransferWizard />
          </motion.div>
        );

      case "vous":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-28 min-h-screen bg-white dark:bg-background">
            {/* Profile header — green gradient */}
            <div className="rounded-3xl overflow-hidden mb-6" style={{ background: "linear-gradient(160deg, #007a3d 0%, #005029 100%)" }}>
              <div className="flex flex-col items-center pt-8 pb-8 px-4">
                <div className="relative mb-4">
                  <div className="w-[88px] h-[88px] rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.25)" }}>
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-white/80">
                      {user.profilePicture
                        ? <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center">
                            <span className="font-black text-3xl" style={{ color: LCL_GREEN }}>{user.fullName?.charAt(0) || "D"}</span>
                          </div>
                      }
                    </div>
                  </div>
                  <button
                    onClick={() => { const u = prompt("URL de votre photo :"); if (u) updatePicture.mutate(u); }}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg bg-amber-400"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-white font-black text-2xl">{user.fullName}</p>
                <p className="text-green-200 text-sm mt-1">Identifiant : {user.username}</p>
              </div>
            </div>

            {/* PARAMÈTRES */}
            <div className="px-4">
              <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-3">PARAMÈTRES</p>
              <div className="space-y-2.5 mb-6">
                {[
                  {
                    icon: <ShieldCheck className="w-5 h-5" style={{ color: LCL_GREEN }} />,
                    bg: "#e8f5ee",
                    label: "Sécurité du compte",
                    sub: "Mot de passe, Face ID",
                    action: () => setSecurityOpen(true),
                  },
                  {
                    icon: <Bell className="w-5 h-5" style={{ color: LCL_GREEN }} />,
                    bg: "#e8f5ee",
                    label: "Notifications",
                    sub: "Alertes et SMS",
                    action: () => setNotifOpen(true),
                  },
                  {
                    icon: <HelpCircle className="w-5 h-5" style={{ color: LCL_GREEN }} />,
                    bg: "#e8f5ee",
                    label: "Aide & Support",
                    sub: "FAQ et contact",
                    action: () => setSupportOpen(true),
                  },
                ].map((item, i) => (
                  <button key={i} onClick={item.action} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left bg-white border border-gray-100 shadow-sm transition-all active:scale-[0.98]">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.bg }}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold text-sm">{item.label}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{item.sub}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </button>
                ))}
              </div>

              {/* Déconnexion */}
              <button
                onClick={() => logout.mutate()}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-red-500 text-base border-2 border-red-100 bg-red-50 transition-all active:scale-[0.98]"
              >
                <LogOut className="w-5 h-5" /> Déconnexion
              </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 dark:bg-background flex flex-col max-w-2xl mx-auto md:border-x border-border/50 relative">

      {/* GREEN HEADER */}
      <header className="sticky top-0 z-30 px-4 py-3 flex justify-between items-center" style={{ background: LCL_GREEN }}>
        <div className="flex items-center gap-2.5">
          <img src={BANK_LOGO} alt={BANK_NAME} className="w-9 h-9 object-contain rounded-lg" />
          <div>
            <p className="font-black text-white text-sm leading-tight">{BANK_NAME}</p>
            <p className="text-white/70 text-[10px] leading-none">{user.fullName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSearchOpen(true)}>
            <Search className="w-5 h-5 text-white/90" />
          </button>
          <button onClick={() => { setNotifOpen(true); }} className="relative">
            <Bell className="w-5 h-5 text-white/90" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button onClick={() => setSupportOpen(true)}>
            <HelpCircle className="w-5 h-5 text-white/90" />
          </button>
          <button onClick={() => setHamburgerOpen(true)}>
            <Menu className="w-5 h-5 text-white/90" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-x-hidden">{renderTab()}</main>

      {/* BOTTOM NAV */}
      <nav className="fixed md:absolute bottom-0 left-0 right-0 max-w-2xl mx-auto bg-card border-t border-border/40 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-40">
        <div className="flex justify-around items-center px-2 py-3">
          {([
            { icon: <Home className="w-5 h-5" />, label: "Accueil", tab: "accueil" as Tab },
            { icon: <CreditCard className="w-5 h-5" />, label: "Comptes", tab: "comptes" as Tab },
            { icon: <Send className="w-5 h-5" />, label: "Virement", tab: "virement" as Tab },
            { icon: <User className="w-5 h-5" />, label: "Vous", tab: "vous" as Tab },
          ] as const).map(item => {
            const isActive = activeTab === item.tab && !subPage;
            return (
              <button key={item.tab} onClick={() => goTab(item.tab)} className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                <motion.div animate={{ scale: isActive ? 1.1 : 1 }}>{item.icon}</motion.div>
                <span className={`text-[10px] font-black uppercase tracking-wide ${isActive ? "text-primary" : ""}`}>{item.label}</span>
                {isActive && <span className="w-1 h-1 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ─── NOTIFICATIONS MODAL ─── */}
      <AnimatePresence>
        {notifOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNotifOpen(false)} className="fixed inset-0 bg-black/40 z-50" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-card rounded-t-3xl z-50 p-5 shadow-2xl max-h-[75vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="font-black text-xl">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={() => setReadNotifs(NOTIFS.map(n => n.id))} className="text-primary text-xs font-bold">Tout lire</button>
                  )}
                  <button onClick={() => setNotifOpen(false)} className="p-2 hover:bg-secondary rounded-full"><X className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="space-y-3">
                {NOTIFS.map(notif => {
                  const isUnread = notif.unread && !readNotifs.includes(notif.id);
                  return (
                    <button key={notif.id} onClick={() => setReadNotifs(prev => [...prev, notif.id])} className={`w-full text-left flex items-start gap-4 p-4 rounded-2xl transition-colors border ${isUnread ? "bg-primary/5 border-primary/20" : "bg-secondary/40 border-border/30"}`}>
                      <span className="text-2xl shrink-0">{notif.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-sm">{notif.title}</p>
                          {isUnread && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                        </div>
                        <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{notif.body}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {NOTIFS.length === 0 && (
                <div className="text-center py-10">
                  <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                  <p className="text-muted-foreground text-sm">Aucune notification</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── HAMBURGER DRAWER ─── */}
      <AnimatePresence>
        {hamburgerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setHamburgerOpen(false)} className="fixed inset-0 bg-black/40 z-50" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 220 }} className="fixed left-0 top-0 bottom-0 w-[82%] max-w-[300px] bg-card z-50 flex flex-col shadow-2xl overflow-y-auto">
              <div className="px-5 py-4 flex justify-between items-start" style={{ background: LCL_GREEN }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-md">
                    <img src={BANK_LOGO} alt={BANK_NAME} className="w-7 h-7 object-contain" />
                  </div>
                  <div>
                    <p className="font-black text-white text-sm">{user.fullName}</p>
                    <p className="text-white/70 text-xs">Compte particulier</p>
                  </div>
                </div>
                <button onClick={() => setHamburgerOpen(false)} className="p-1.5 hover:bg-white/20 rounded-full"><X className="w-5 h-5 text-white" /></button>
              </div>
              <div className="mx-4 mt-4 p-4 bg-green-50 dark:bg-primary/10 rounded-2xl border border-primary/20">
                <p className="text-muted-foreground text-xs font-medium">Somme bloquée</p>
                <p className="font-black text-xl text-primary mt-0.5">{fmt4(balance)}</p>
                {account?.isBlocked && <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1.5">🔒 Compte bloqué</p>}
              </div>
              <div className="px-4 pt-5">
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2">MON ESPACE</p>
                <div className="space-y-0.5">
                  {[
                    { icon: <CreditCard className="w-5 h-5 text-primary" />, label: "Comptes & Cartes", action: () => goTab("comptes") },
                    { icon: <PiggyBank className="w-5 h-5 text-blue-500" />, label: "Épargne & Placements", action: () => goSub("epargne") },
                    { icon: <Send className="w-5 h-5 text-purple-500" />, label: "Virements & Paiements", action: () => goTab("virement") },
                    { icon: <TrendingUp className="w-5 h-5 text-orange-500" />, label: "Crédits & Prêts", action: () => goSub("credits") },
                    { icon: <Shield className="w-5 h-5 text-red-500" />, label: "Assurances & Sécurité", action: () => goSub("assurances") },
                    { icon: <Gift className="w-5 h-5 text-pink-500" />, label: "Espace Cadeaux", action: () => goSub("cadeaux") },
                  ].map((item, i) => (
                    <button key={i} onClick={item.action} className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-secondary transition-colors text-left">
                      <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0">{item.icon}</div>
                      <span className="font-semibold text-sm flex-1">{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-4 pt-4">
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2">MON PROFIL</p>
                <div className="space-y-0.5">
                  {[
                    { icon: <User className="w-5 h-5 text-primary" />, label: "Profil & Paramètres", action: () => goSub("profil") },
                    { icon: <HelpCircle className="w-5 h-5 text-green-500" />, label: "Support & Aide", action: () => { setHamburgerOpen(false); setSupportOpen(true); } },
                  ].map((item, i) => (
                    <button key={i} onClick={item.action} className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-secondary transition-colors text-left">
                      <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0">{item.icon}</div>
                      <span className="font-semibold text-sm flex-1">{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1" />
              <div className="p-4 border-t border-border/50">
                <button onClick={() => logout.mutate()} className="w-full flex items-center gap-3 p-3 rounded-xl text-destructive hover:bg-destructive/10 font-bold text-sm transition-colors">
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── SÉCURITÉ MODAL ─── */}
      <AnimatePresence>
        {securityOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSecurityOpen(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto rounded-t-3xl z-50 p-5 shadow-2xl max-h-[75vh] overflow-y-auto" style={{ background: "#1c1c1e" }}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <h3 className="font-black text-xl text-white">Sécurité du compte</h3>
                </div>
                <button onClick={() => setSecurityOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5 text-zinc-400" /></button>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  { icon: "🔑", label: "Changer le mot de passe", sub: "Modifier votre mot de passe actuel" },
                  { icon: "👤", label: "Face ID / Biométrie", sub: "Connexion par reconnaissance faciale" },
                  { icon: "📱", label: "Appareils connectés", sub: "Gérer vos sessions actives" },
                  { icon: "🛡️", label: "Double authentification", sub: "Sécurité renforcée par SMS" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-4 rounded-2xl" style={{ background: "#2c2c2e" }}>
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{item.label}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">{item.sub}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl border border-orange-800/40" style={{ background: "#2d1a00" }}>
                <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <p className="text-orange-300 text-xs font-medium leading-relaxed">Votre compte est bloqué (procédure successorale). Pour toute modification de sécurité, contactez votre conseiller au <strong>3009</strong>.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── RECHERCHE MODAL ─── */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSearchOpen(false)} className="fixed inset-0 bg-black/40 z-50" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-card rounded-t-3xl z-50 p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-xl">Recherche</h3>
                <button onClick={() => setSearchOpen(false)} className="p-2 hover:bg-secondary rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Rechercher une transaction..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border/50 outline-none text-sm focus:border-primary transition-colors" />
              </div>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setSearchTab("transactions")} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all ${searchTab === "transactions" ? "text-white shadow-sm" : "bg-secondary text-muted-foreground"}`} style={searchTab === "transactions" ? { background: LCL_GREEN } : {}}>
                  <ArrowUpRight className="w-4 h-4" /> Transactions
                </button>
                <button onClick={() => setSearchTab("localisation")} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all ${searchTab === "localisation" ? "text-white shadow-sm" : "bg-secondary text-muted-foreground"}`} style={searchTab === "localisation" ? { background: LCL_GREEN } : {}}>
                  <MapPin className="w-4 h-4" /> Localisation
                </button>
              </div>
              {searchTab === "transactions" ? (
                <div className="space-y-1">
                  {transactions.length === 0
                    ? <p className="text-center text-muted-foreground py-8 text-sm">Aucun résultat trouvé</p>
                    : transactions.map((tx, i) => (
                      <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-secondary transition-colors">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tx.dir === "in" ? "bg-green-100 dark:bg-green-500/10" : "bg-red-100 dark:bg-red-500/10"}`}>
                          {tx.dir === "in" ? <ArrowDownLeft className="w-4 h-4 text-green-600" /> : <ArrowUpRight className="w-4 h-4 text-red-500" />}
                        </div>
                        <span className="flex-1 text-sm font-medium">{tx.label}</span>
                        <span className={`font-black text-sm ${tx.dir === "in" ? "text-green-600" : "text-red-500"}`}>{tx.amount}</span>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <MapPin className="w-10 h-10 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground text-sm">Localisation des agences {BANK_NAME}</p>
                  <button className="px-5 py-2.5 text-white rounded-xl font-bold text-sm" style={{ background: LCL_GREEN }}>Activer la géolocalisation</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── SUPPORT MODAL ─── */}
      <AnimatePresence>
        {supportOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setSupportOpen(false); setChatActive(false); }} className="fixed inset-0 bg-black/40 z-50" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-card rounded-t-3xl z-50 p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-black text-xl">Support & Aide</h3>
                <button onClick={() => { setSupportOpen(false); setChatActive(false); }} className="p-2 hover:bg-secondary rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { icon: <MessageCircle className="w-6 h-6" />, label: "Chat en ligne", action: () => setChatActive(true) },
                  { icon: <User className="w-6 h-6" />, label: "Mon conseiller", action: () => {} },
                  { icon: <HelpCircle className="w-6 h-6" />, label: "Aide & FAQ", action: () => {} },
                ].map((s, i) => (
                  <button key={i} onClick={s.action} className={`flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-primary/10 transition-colors ${chatActive && i === 0 ? "bg-primary/10 border border-primary/30" : "bg-secondary"}`}>
                    <div className="text-primary">{s.icon}</div>
                    <span className="text-xs font-bold text-center">{s.label}</span>
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {chatActive && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-5 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 rounded-t-2xl" style={{ background: LCL_GREEN }}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                        <MessageCircle className="w-4 h-4 text-white" />
                        <p className="font-black text-white text-sm">Chat {BANK_NAME}</p>
                      </div>
                      <p className="text-green-200 text-xs font-bold">Conseiller en ligne</p>
                    </div>
                    <div className="bg-secondary/50 border border-border/30 min-h-[180px] max-h-[220px] overflow-y-auto p-4 space-y-3">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${msg.from === "user" ? "text-white rounded-tr-sm" : "bg-card border border-border/50 text-foreground rounded-tl-sm"}`} style={msg.from === "user" ? { background: LCL_GREEN } : {}}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="flex gap-2 border border-border/50 border-t-0 rounded-b-2xl bg-card p-3">
                      <input type="text" value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Écrivez votre message..." className="flex-1 bg-secondary rounded-xl px-3 py-2 text-sm outline-none" />
                      <button onClick={sendChat} disabled={!chatMsg.trim()} className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40" style={{ background: LCL_GREEN }}>
                        <SendHorizonal className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="bg-secondary/50 rounded-2xl p-4 mb-5">
                <p className="text-muted-foreground text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Contacter votre conseiller</p>
                <div className="bg-card rounded-xl p-4 border border-border/50">
                  <p className="font-black text-sm">Marie Dupont</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Conseillère patrimoniale — Agence Bordeaux Centre</p>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 py-2.5 text-white rounded-xl text-xs font-black" style={{ background: LCL_GREEN }}>Envoyer un message</button>
                    <button className="flex-1 py-2.5 border-2 rounded-xl text-xs font-black text-primary" style={{ borderColor: LCL_GREEN }}>Prendre RDV</button>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-black text-sm flex items-center gap-2 mb-3"><HelpCircle className="w-4 h-4 text-primary" /> Questions fréquentes</p>
                {["Mon compte est bloqué, que faire ?", "Comment changer mon mot de passe ?", "Comment faire opposition à ma carte ?", "Comment effectuer un virement ?", "Comment télécharger un relevé de compte ?"].map((q, i) => (
                  <div key={i} className="flex items-center justify-between py-3.5 border-b border-border/30 last:border-0">
                    <span className="text-sm">{q}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubPageLayout({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 pb-28">
      <button onClick={onBack} className="flex items-center gap-1.5 text-primary text-sm font-bold">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>
      <h3 className="font-black text-2xl px-1">{title}</h3>
      {children}
    </motion.div>
  );
}
