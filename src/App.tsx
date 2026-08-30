import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar, NavTab } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { AuthScreen } from './components/AuthScreen';
import { StudiesList } from './components/studies/StudiesList';
import { StudyDetail } from './components/studies/StudyDetail';
import { GlossaryView } from './components/glossary/GlossaryView';
import { MethodologyView } from './components/methodology/MethodologyView';
import { AdviseesDashboard } from './components/advisees/AdviseesDashboard';
import { BibleStudy } from './types';
import { Anchor, Shield, BookOpen } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('studies');
  const [selectedStudy, setSelectedStudy] = useState<BibleStudy | null>(null);

  // Cada que se cambia de pestaña o vista, desplazarse automáticamente hasta arriba
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab, selectedStudy]);

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab !== 'studies') {
      setSelectedStudy(null);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a11] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 font-medium tracking-wide">Verificando sesión pastoral...</p>
        </div>
      </div>
    );
  }

  // Mandatory Authentication Gate: No one can access without logging in
  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleSelectTab} 
      />

      {/* Main View Router (Expansivo, aprovechando toda la pantalla con holgura) */}
      <main className="flex-1 w-full pb-20 md:pb-16">
        {activeTab === 'studies' && (
          selectedStudy ? (
            <StudyDetail 
              study={selectedStudy} 
              onBack={() => {
                setSelectedStudy(null);
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }} 
            />
          ) : (
            <StudiesList 
              onSelectStudy={(study) => {
                setSelectedStudy(study);
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }} 
            />
          )
        )}

        {activeTab === 'glossary' && (
          <GlossaryView />
        )}

        {activeTab === 'methodology' && (
          <MethodologyView />
        )}

        {activeTab === 'advisees' && (
          <AdviseesDashboard />
        )}
      </main>

      {/* Footer a pantalla completa */}
      <footer className="hidden md:block bg-[#05080e] border-t border-amber-500/10 py-6 text-center text-xs text-slate-500">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Anchor className="w-4 h-4 text-amber-500" />
            <span className="font-serif font-bold text-slate-300 text-sm">Ancla Consejería Bíblica</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 italic text-xs">"Firmeza en la Verdad, Gracia en el Corazón"</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Confidencialidad Pastoral</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Sola Scriptura</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileNav 
        activeTab={activeTab} 
        setActiveTab={handleSelectTab} 
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
