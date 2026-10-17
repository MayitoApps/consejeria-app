import React, { useState } from 'react';
import { 
  Anchor, 
  BookOpen, 
  Library, 
  Compass, 
  FolderLock, 
  LogOut,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBible } from '../context/BibleContext';
import { AlertsDropdown } from './alerts/AlertsDropdown';
import { PastoralAlert } from '../types';

export type NavTab = 'studies' | 'notes' | 'glossary' | 'methodology' | 'advisees';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  alerts?: PastoralAlert[];
  onSelectAdvisee?: (adviseeId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab,
  alerts = [],
  onSelectAdvisee = () => {}
}) => {
  const { user, signOut } = useAuth();
  const { openBible } = useBible();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: 'studies' as NavTab, label: 'Estudios Bíblicos', icon: BookOpen },
    { id: 'notes' as NavTab, label: 'Notas de Consejería', icon: Sparkles },
    { id: 'glossary' as NavTab, label: 'Índice Didáctico', icon: Library },
    { id: 'methodology' as NavTab, label: 'Metodología', icon: Compass },
    { id: 'advisees' as NavTab, label: 'Expedientes', icon: FolderLock },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f2f4ee]/92 backdrop-blur-xl border-b border-[#d2daca] shadow-sm transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo & Marca */}
          <div 
            onClick={() => setActiveTab('studies')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage-600 via-sage-800 to-sage-900 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <div className="w-full h-full bg-[#fbfcfa] rounded-[6px] flex items-center justify-center">
                <Anchor className="w-4 h-4 text-sage-800" />
              </div>
            </div>
            <div>
              <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-sage-900 block leading-none">
                ANCLA
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#56685f] font-medium block mt-0.5">
                Consejería Bíblica
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-0.5 lg:space-x-1 bg-[#e6eae0] p-1 rounded-xl border border-[#d2daca]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 lg:px-3 lg:py-1.5 rounded-lg text-[11px] lg:text-xs font-medium transition-all select-none whitespace-nowrap ${
                    isActive
                      ? 'bg-sage-800 text-white shadow-sm font-semibold'
                      : 'text-sage-800 hover:text-sage-950 hover:bg-white/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-sage-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Lector Bíblico + Alertas Pastorales + User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Botón Lector Bíblico Integrado */}
            <button
              type="button"
              onClick={() => openBible()}
              className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-full bg-[#edf2ea] hover:bg-sage-200/80 border border-[#c4cfbc] hover:border-sage-400 text-sage-900 text-[11px] font-medium flex items-center space-x-1.5 transition-all shadow-xs group"
              title="Abrir La Biblia de las Américas (LBLA)"
            >
              <BookOpen className="w-3.5 h-3.5 text-sage-800 group-hover:scale-105 transition-transform" />
              <span className="hidden sm:inline font-medium tracking-tight">Biblia LBLA</span>
            </button>

            {/* Dropdown de Alertas Pastorales */}
            {user && (
              <AlertsDropdown
                alerts={alerts}
                onSelectAdvisee={(adviseeId) => {
                  setActiveTab('advisees');
                  onSelectAdvisee(adviseeId);
                }}
              />
            )}

            {/* User Profile / Logout */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-1 pl-2.5 pr-3 rounded-full bg-white border border-[#d2daca] hover:border-sage-600 transition-all text-xs shadow-sm"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'Consejero'} 
                      className="w-6 h-6 rounded-full border border-sage-300 object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-sage-100 border border-sage-300 flex items-center justify-center text-sage-900 font-bold text-[11px]">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'C'}
                    </div>
                  )}
                  <span className="hidden sm:inline font-medium text-sage-950 max-w-[120px] truncate text-xs">
                    {user.displayName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-sage-600" />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-2.5 shadow-2xl border border-stone-200 animate-fade-in text-xs z-50">
                    <div className="px-2.5 py-1.5 border-b border-stone-200 mb-1.5">
                      <p className="font-semibold text-slate-800 truncate text-xs">{user.displayName}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setActiveTab('advisees');
                      }}
                      className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-slate-700 hover:text-slate-900 hover:bg-stone-100 rounded-lg transition-all text-xs font-medium"
                    >
                      <FolderLock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Mis Expedientes</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        signOut();
                      }}
                      className="w-full flex items-center space-x-2 px-2.5 py-1.5 mt-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all text-xs font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Botón Acceder si el usuario visita un enlace público de notas */}
            {!user && (
              <button
                type="button"
                onClick={() => {
                  window.location.href = window.location.pathname;
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-600/30 text-amber-900 text-xs font-semibold transition-all shadow-sm"
              >
                Acceder
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
