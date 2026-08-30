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
    { id: 'glossary' as NavTab, label: 'Glosario & Libros', icon: Library },
    { id: 'methodology' as NavTab, label: 'Metodología', icon: Compass },
    { id: 'advisees' as NavTab, label: 'Expedientes', icon: FolderLock },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080c14]/90 backdrop-blur-xl border-b border-amber-500/15 shadow-sm transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Marca */}
          <div 
            onClick={() => setActiveTab('studies')}
            className="flex items-center space-x-3.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-gold-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Anchor className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight gold-gradient-text block leading-none">
                ANCLA
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold block mt-1">
                Consejería Bíblica Reformada
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all select-none ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-gold-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-200' : 'text-slate-400'}`} />
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
                className="flex items-center space-x-2.5 p-1.5 pl-3 pr-3.5 rounded-full bg-slate-900/90 border border-amber-500/25 hover:border-amber-400 transition-all text-xs"
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'Consejero'} 
                    className="w-7 h-7 rounded-full border border-amber-400/50 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-300 font-bold text-xs">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'C'}
                  </div>
                )}
                <span className="hidden sm:inline font-medium text-slate-200 max-w-[120px] truncate text-xs">
                  {user.displayName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2.5 w-60 glass-card rounded-2xl p-3 shadow-navy-lg border border-amber-500/30 animate-fade-in text-xs z-50">
                  <div className="px-3 py-2 border-b border-slate-800 mb-2">
                    <p className="font-semibold text-slate-200 truncate">{user.displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveTab('advisees');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all font-medium"
                  >
                    <FolderLock className="w-4 h-4 text-amber-400" />
                    <span>Mis Expedientes</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      signOut();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 mt-1.5 text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 rounded-xl transition-all font-medium"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
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
