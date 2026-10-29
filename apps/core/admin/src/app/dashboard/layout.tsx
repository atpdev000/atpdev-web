"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Settings, 
  LogOut, 
  BrainCircuit, 
  BarChart3, 
  Search, 
  Bell,
  Code2,
  X,
  Menu,
  User2,
  Briefcase,
  Gift,
  Download,
  Sun,
  Moon
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Theme Management (Dark / Light)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = (localStorage.getItem('admin_theme') as 'dark' | 'light') || 'dark';
    setTheme(saved);
    if (saved === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, []);

  const applyTheme = (next: 'dark' | 'light') => {
    setTheme(next);
    localStorage.setItem('admin_theme', next);
    if (next === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  const toggleTheme = () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-focus search input
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const navSections = [
    {
      title: "PORTAL & APPS",
      items: [
        { label: "Overview", icon: <LayoutDashboard size={17} />, href: "/dashboard" },
        { label: "Projects & Apps", icon: <FolderKanban size={17} />, href: "/dashboard/projects" },
      ]
    },
    {
      title: "PLATAFORMAS & SUBDOMINIOS",
      items: [
        { 
          label: "Chamba Pro", 
          icon: <Briefcase size={17} />, 
          href: "/dashboard/chamba",
          badge: "3005"
        },
        { 
          label: "Sorteos Pro", 
          icon: <Gift size={17} />, 
          href: "/dashboard/sorteos",
          badge: "3006"
        },
        { 
          label: "Descargador Pro", 
          icon: <Download size={17} />, 
          href: "/dashboard/descargador",
          badge: "3007"
        },
      ]
    },
    {
      title: "HERRAMIENTAS & CMS",
      items: [
        { label: "AI Models", icon: <BrainCircuit size={17} />, href: "/dashboard/ai-models" },
        { label: "Leads (CRM)", icon: <Users size={17} />, href: "/dashboard/leads" },
        { label: "Analytics", icon: <BarChart3 size={17} />, href: "/dashboard/analytics" },
        { label: "Perfil Pro.", icon: <User2 size={17} />, href: "/dashboard/profile" },
        { label: "Settings", icon: <Settings size={17} />, href: "/dashboard/settings" },
      ]
    }
  ];

  const navItems = navSections.flatMap(s => s.items);

  // Filter nav items by search
  const filteredNav = searchQuery
    ? navItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSearchNavigate = (href: string) => {
    router.push(href);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const [avatarUrl, setAvatarUrl] = useState("/avatar.png");
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, text: "Sistema de Notificaciones activo", time: "Hace 1 min", read: false },
    { id: 2, text: "Build exitoso en Vercel", time: "Hace 1 hora", read: true }
  ]);

  // Load avatar and notifications from Supabase
  useEffect(() => {
    // 1. Avatar
    supabase.from("site_config").select("avatar_url").single().then(({ data }) => {
      if (data?.avatar_url) setAvatarUrl(data.avatar_url);
    });

    // 2. Leads as Notifications
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(4).then(({ data }) => {
      if (data && data.length > 0) {
        const leadNotifs = data.map((lead: any) => ({
          id: lead.id,
          text: `Nuevo contacto: ${lead.name || lead.email}`,
          time: new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: lead.status === "contacted" || lead.status === "closed"
        }));
        setNotifications(leadNotifs);
      }
    });
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`h-screen flex font-sans overflow-hidden transition-colors duration-200 ${theme === 'dark' ? 'bg-[#0b0f19] text-gray-200' : 'bg-[#f1f5f9] text-slate-800'}`}>
      
      {/* SEARCH OVERLAY (Command Palette Style) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]" onClick={() => setSearchOpen(false)}>
          <div className={`w-full max-w-lg border rounded-2xl shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-[#181d28] border-gray-700' : 'bg-white border-slate-200'}`} onClick={e => e.stopPropagation()}>
            <div className={`flex items-center gap-3 px-5 py-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-slate-200'}`}>
              <Search size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-slate-400'} />
              <input 
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`flex-1 bg-transparent text-sm outline-none ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-slate-900 placeholder-slate-400'}`}
                placeholder="Buscar páginas, acciones..."
              />
              <kbd className={`text-[10px] font-bold px-2 py-0.5 rounded border ${theme === 'dark' ? 'text-gray-500 bg-gray-800 border-gray-700' : 'text-slate-500 bg-slate-100 border-slate-200'}`}>ESC</kbd>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {searchQuery === "" ? (
                <div className="p-4">
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Navegación Rápida</p>
                  {navItems.map(item => (
                    <button 
                      key={item.href}
                      onClick={() => handleSearchNavigate(item.href)}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-blue-600/10 hover:text-blue-400' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'}`}
                    >
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
              ) : filteredNav.length > 0 ? (
                <div className="p-4">
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Resultados</p>
                  {filteredNav.map(item => (
                    <button 
                      key={item.href}
                      onClick={() => handleSearchNavigate(item.href)}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-blue-600/10 hover:text-blue-400' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'}`}
                    >
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-500">No se encontraron resultados para &quot;{searchQuery}&quot;</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`w-64 border-r flex-col h-full shrink-0 relative transition-colors duration-200 ${theme === 'dark' ? 'bg-[#111622] border-gray-800' : 'bg-white border-slate-200 shadow-sm'} ${mobileMenuOpen ? 'flex fixed z-40 top-0 left-0' : 'hidden md:flex'}`}>
        
        {/* Top Header Logo */}
        <div className={`h-16 px-6 border-b flex items-center justify-between ${theme === 'dark' ? 'border-gray-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold">
              <Code2 size={16} />
            </div>
            <span className={`font-bold text-sm tracking-wide ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>ATP DEV</span>
          </div>
          {/* Mobile close */}
          <button className={`md:hidden ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`} onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* User Profile Info */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-600 border border-gray-700 overflow-hidden shrink-0">
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Percy (ATP DEV)</p>
              <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation by Sections */}
        <nav className="flex-1 px-4 space-y-4 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                {section.title}
              </p>
              {section.items.map((item: any) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                      isActive
                        ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                        : theme === 'dark'
                        ? "text-gray-400 hover:text-white hover:bg-white/5"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Widgets */}
        <div className="p-6">
          <div className={`border rounded-xl p-4 mb-4 ${theme === 'dark' ? 'bg-[#181d28] border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
            <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Quota Usage</p>
            <div className={`w-full h-1.5 rounded-full mb-2 overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-slate-200'}`}>
              <div className="h-full bg-blue-500 rounded-full w-[65%]"></div>
            </div>
            <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>65% of monthly tokens used.</p>
          </div>

          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex gap-3 text-[10px] text-gray-500 font-semibold">
              <a href="https://github.com/percydev" target="_blank" rel="noopener noreferrer" className={theme === 'dark' ? 'hover:text-white transition-colors' : 'hover:text-slate-900 transition-colors'}>GitHub</a>
              <a href="https://linkedin.com/in/percy-acha" target="_blank" rel="noopener noreferrer" className={theme === 'dark' ? 'hover:text-white transition-colors' : 'hover:text-slate-900 transition-colors'}>LinkedIn</a>
              <a href="https://x.com/atpdev" target="_blank" rel="noopener noreferrer" className={theme === 'dark' ? 'hover:text-white transition-colors' : 'hover:text-slate-900 transition-colors'}>Twitter</a>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 mt-4 w-full text-left rounded-xl transition-all font-medium text-xs text-gray-400 hover:text-rose-400 hover:bg-rose-500/10"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP BAR */}
        <header className={`h-16 border-b flex items-center justify-between px-6 shrink-0 z-10 transition-colors duration-200 ${theme === 'dark' ? 'bg-[#111622] border-gray-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button className={`md:hidden ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`} onClick={() => setMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            {/* Search trigger */}
            <button 
              onClick={() => setSearchOpen(true)}
              className={`hidden md:flex items-center gap-3 border rounded-lg px-4 py-2 text-sm transition-colors w-64 ${theme === 'dark' ? 'bg-[#181d28] border-gray-800 text-gray-400 hover:border-gray-600' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'}`}
            >
              <Search size={14} />
              <span>Buscar...</span>
              <kbd className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded border ${theme === 'dark' ? 'text-gray-600 bg-gray-800 border-gray-700' : 'text-slate-500 bg-slate-100 border-slate-200'}`}>⌘K</kbd>
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile search */}
            <button className={`md:hidden transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`} onClick={() => setSearchOpen(true)}>
              <Search size={18} />
            </button>

            {/* Segmented Theme Switcher (Oscuro | Claro) */}
            <div className={`flex items-center p-0.5 rounded-xl border transition-all ${
              theme === 'dark' ? 'bg-[#181d28] border-gray-700/80' : 'bg-slate-200/70 border-slate-300'
            }`}>
              <button
                type="button"
                onClick={() => applyTheme('dark')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Activar Modo Oscuro"
              >
                <Moon size={13} className={theme === 'dark' ? 'text-white' : 'text-slate-500'} />
                <span className="hidden sm:inline">Oscuro</span>
              </button>
              <button
                type="button"
                onClick={() => applyTheme('light')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Activar Modo Claro"
              >
                <Sun size={13} className={theme === 'light' ? 'text-amber-500' : 'text-gray-400'} />
                <span className="hidden sm:inline">Claro</span>
              </button>
            </div>
            
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button 
                className={`transition-colors relative p-1.5 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-blue-500 rounded-full border-2 border-white text-[9px] font-bold text-white flex items-center justify-center px-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifOpen && (
                <div className={`absolute right-0 top-12 w-80 border rounded-2xl shadow-2xl overflow-hidden z-50 ${theme === 'dark' ? 'bg-[#181d28] border-gray-800' : 'bg-white border-slate-200'}`}>
                  <div className={`px-5 py-4 border-b flex justify-between items-center ${theme === 'dark' ? 'border-gray-800' : 'border-slate-200'}`}>
                    <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Notificaciones</h3>
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">{unreadCount} nuevas</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`px-5 py-3.5 border-b hover:bg-blue-500/5 transition-colors cursor-pointer ${theme === 'dark' ? 'border-gray-800/50' : 'border-slate-100'} ${!n.read ? 'bg-blue-500/5' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>}
                          <div className={!n.read ? '' : 'pl-5'}>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{n.text}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/dashboard/leads" onClick={() => setNotifOpen(false)} className={`block px-5 py-3 text-center text-xs font-bold text-blue-500 hover:bg-blue-500/5 transition-colors border-t ${theme === 'dark' ? 'border-gray-800' : 'border-slate-200'}`}>
                    Ver todas las notificaciones →
                  </Link>
                </div>
              )}
            </div>

            {/* Avatar */}
            <Link href="/dashboard/settings">
              <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-blue-600 overflow-hidden cursor-pointer shadow-[0_0_10px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-shadow">
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </Link>
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className={`flex-1 overflow-y-auto p-6 md:p-8 transition-colors duration-200 ${theme === 'dark' ? 'bg-[#0b0f19] text-gray-200' : 'bg-[#f1f5f9] text-slate-800'}`}>
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
