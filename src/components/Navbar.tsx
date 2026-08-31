import React, { useState } from 'react';
import { 
  Anchor, 
  BookOpen, 
  Library, 
  Compass, 
  FolderLock, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavTab = 'studies' | 'glossary' | 'methodology' | 'advisees';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, signOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: 'studies' as NavTab, label: 'Estudios Bíblicos', icon: BookOpen },
    { id: 'glossary' as NavTab, label: 'Índice Didáctico', icon: Library },
    { id: 'methodology' as NavTab, label: 'Metodología', icon: Compass },
    { id: 'advisees' as NavTab, label: 'Expedientes', icon: FolderLock },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070a11]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-sm transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo & Marca */}
          <div 
            onClick={() => setActiveTab('studies')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-gold-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <div className="w-full h-full bg-[#090d16] rounded-[6px] flex items-center justify-center">
                <Anchor className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="font-serif text-base sm:text-lg font-bold tracking-tight gold-gradient-text block leading-none">
                ANCLA
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-medium block mt-0.5">
                Consejería Bíblica
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-white/[0.05]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all select-none ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-gold-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-200' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile / Logout */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1 pl-2.5 pr-3 rounded-full bg-slate-900/80 border border-white/[0.08] hover:border-amber-500/30 transition-all text-xs"
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'Consejero'} 
                    className="w-6 h-6 rounded-full border border-amber-400/40 object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-amber-600/25 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-[11px]">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'C'}
                  </div>
                )}
                <span className="hidden sm:inline font-medium text-slate-300 max-w-[120px] truncate text-xs">
                  {user.displayName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl p-2.5 shadow-navy-lg border border-amber-500/20 animate-fade-in text-xs z-50">
                  <div className="px-2.5 py-1.5 border-b border-slate-800 mb-1.5">
                    <p className="font-semibold text-slate-200 truncate text-xs">{user.displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveTab('advisees');
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-lg transition-all text-xs font-medium"
                  >
                    <FolderLock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mis Expedientes</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      signOut();
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 mt-1 text-rose-300 hover:text-rose-200 hover:bg-rose-950/30 rounded-lg transition-all text-xs font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
