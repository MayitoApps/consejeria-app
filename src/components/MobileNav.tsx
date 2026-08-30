import React from 'react';
import { BookOpen, Library, Compass, FolderLock } from 'lucide-react';
import { NavTab } from './Navbar';

interface MobileNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'studies' as NavTab, label: 'Estudios', icon: BookOpen },
    { id: 'glossary' as NavTab, label: 'Glosario', icon: Library },
    { id: 'methodology' as NavTab, label: 'Método', icon: Compass },
    { id: 'advisees' as NavTab, label: 'Expedientes', icon: FolderLock },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070a11]/95 backdrop-blur-lg border-t border-white/[0.08] px-2 py-1 shadow-navy-lg">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                isActive 
                  ? 'text-amber-400 bg-amber-500/10 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
