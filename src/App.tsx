import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BibleProvider } from './context/BibleContext';
import { Navbar, NavTab } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { AuthScreen } from './components/AuthScreen';
import { StudiesList } from './components/studies/StudiesList';
import { StudyDetail } from './components/studies/StudyDetail';
import { GlossaryView } from './components/glossary/GlossaryView';
import { MethodologyView } from './components/methodology/MethodologyView';
import { AdviseesDashboard } from './components/advisees/AdviseesDashboard';
import { BibleStudy, Advisee } from './types';
import { subscribeToAdvisees } from './services/adviseesService';
import { calculatePastoralAlerts } from './utils/reminders';
import { Anchor, Shield, BookOpen } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('studies');
  const [selectedStudy, setSelectedStudy] = useState<BibleStudy | null>(null);
  const [advisees, setAdvisees] = useState<Advisee[]>([]);

  // Cada que se cambia de pestaña o vista, desplazarse automáticamente hasta arriba
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab, selectedStudy]);

  // Sincronización en tiempo real para las alertas globales en el Navbar
  useEffect(() => {
    if (!user) {
      setAdvisees([]);
      return;
    }

    const unsubscribe = subscribeToAdvisees(
      user.uid,
      (data) => {
        setAdvisees(data);
      },
      (err) => {
        console.error('Error al escuchar alertas pastorales:', err);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const alerts = calculatePastoralAlerts(advisees);

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
        alerts={alerts}
        onSelectAdvisee={() => {
          setActiveTab('advisees');
        }}
      />

      {/* Main View Router */}
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
      <footer className="hidden md:block bg-[#05080e]/90 border-t border-white/[0.05] py-4 text-center text-[11px] text-slate-500">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Anchor className="w-3.5 h-3.5 text-amber-500/80" />
            <span className="font-serif font-semibold text-slate-300 text-xs">Ancla Consejería Bíblica</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 italic text-[11px]">"Firmeza en la Verdad, Gracia en el Corazón"</span>
          </div>

          <div className="flex items-center space-x-5 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Shield className="w-3 h-3 text-amber-400/80" />
              <span>Confidencialidad Pastoral</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <BookOpen className="w-3 h-3 text-amber-400/80" />
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
      <BibleProvider>
        <AppContent />
      </BibleProvider>
    </AuthProvider>
  );
};

export default App;
