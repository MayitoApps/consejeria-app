import React from 'react';
import { BookOpen, Library, Compass, FolderLock, BookMarked } from 'lucide-react';
import { NavTab } from './Navbar';
import { useBible } from '../context/BibleContext';

interface MobileNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const { openBible } = useBible();

  const navItems = [
    { id: 'studies' as NavTab, label: 'Estudios', icon: BookOpen },
    { id: 'glossary' as NavTab, label: 'Índice', icon: Library },
    { id: 'bible' as const, label: 'Biblia', icon: BookMarked, isSpecial: true },
    { id: 'methodology' as NavTab, label: 'Método', icon: Compass },
    { id: 'advisees' as NavTab, label: 'Expedientes', icon: FolderLock },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070a11]/95 backdrop-blur-lg border-t border-white/[0.08] px-2 py-1 shadow-navy-lg">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'bible') {
                  openBible();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                item.isSpecial
                  ? 'text-amber-300 hover:text-amber-200'
                  : isActive 
                  ? 'text-amber-400 bg-amber-500/10 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${item.isSpecial ? 'text-amber-400' : isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
