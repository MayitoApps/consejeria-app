import React from 'react';
import { BookOpen, Library, Compass, FolderLock, BookMarked, Sparkles } from 'lucide-react';
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
    { id: 'notes' as NavTab, label: 'Notas', icon: Sparkles },
    { id: 'bible' as const, label: 'Biblia', icon: BookMarked, isSpecial: true },
    { id: 'glossary' as NavTab, label: 'Índice', icon: Library },
    { id: 'methodology' as NavTab, label: 'Método', icon: Compass },
    { id: 'advisees' as NavTab, label: 'Expedientes', icon: FolderLock },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#f2f4ee]/96 backdrop-blur-lg border-t border-[#d2daca] px-1 py-1 shadow-lg">
      <div className="grid grid-cols-6 gap-0.5">
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
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all ${
                item.isSpecial
                  ? 'text-sage-800 hover:text-sage-950 font-semibold'
                  : isActive 
                  ? 'text-sage-900 bg-sage-200/80 font-bold' 
                  : 'text-[#56685f] hover:text-[#192722]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${item.isSpecial ? 'text-sage-800' : isActive ? 'text-sage-900' : 'text-[#56685f]'}`} />
              <span className="text-[9px] mt-0.5 tracking-tight truncate leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
