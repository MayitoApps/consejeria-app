import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BibleProvider } from './context/BibleContext';
import { Navbar, NavTab } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { BibleStudy, Advisee } from './types';
import { subscribeToAdvisees } from './services/adviseesService';
import { calculatePastoralAlerts } from './utils/reminders';
import { Anchor, Shield, BookOpen } from 'lucide-react';

// Carga perezosa de vistas y componentes pesados (Code-Splitting)
const AuthScreen = lazy(() => import('./components/AuthScreen').then(m => ({ default: m.AuthScreen })));
const StudiesList = lazy(() => import('./components/studies/StudiesList').then(m => ({ default: m.StudiesList })));
const StudyDetail = lazy(() => import('./components/studies/StudyDetail').then(m => ({ default: m.StudyDetail })));
const GlossaryView = lazy(() => import('./components/glossary/GlossaryView').then(m => ({ default: m.GlossaryView })));
const MethodologyView = lazy(() => import('./components/methodology/MethodologyView').then(m => ({ default: m.MethodologyView })));
const AdviseesDashboard = lazy(() => import('./components/advisees/AdviseesDashboard').then(m => ({ default: m.AdviseesDashboard })));
const CounselingNotesView = lazy(() => import('./components/notes/CounselingNotesView').then(m => ({ default: m.CounselingNotesView })));

const ViewFallbackLoader: React.FC = () => (
  <div className="w-full py-20 flex items-center justify-center animate-fade-in">
    <div className="text-center space-y-3">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-xs text-slate-400 font-medium tracking-wide">Cargando contenido pastoral...</p>
    </div>
  </div>
);

export const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  
  // Inicializar pestaña activa desde la URL si viene con parámetros (?tab=notes o ?nota=X)
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'notes' || params.has('nota') || params.has('note')) {
        return 'notes';
      }
      if (tabParam === 'glossary' || tabParam === 'methodology' || tabParam === 'advisees') {
        return tabParam as NavTab;
      }
    } catch {
      // fallback
    }
    return 'studies';
  });

  const [selectedStudy, setSelectedStudy] = useState<BibleStudy | null>(null);
  const [glossaryTarget, setGlossaryTarget] = useState<{ topicId: string; bookId?: string } | null>(null);
  const [advisees, setAdvisees] = useState<Advisee[]>([]);

  // Cada que se cambia de pestaña o vista, desplazarse automáticamente hasta arriba
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab, selectedStudy]);

  // Sincronización en tiempo real para las alertas globales en el Navbar (unificada para toda la app)
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

  // Memoización para evitar cálculos en cada render
  const alerts = useMemo(() => calculatePastoralAlerts(advisees), [advisees]);

  const handleSelectTab = (tab: NavTab) => {
    if (tab === 'advisees' && !user) {
      window.location.href = window.location.pathname;
      return;
    }
    setActiveTab(tab);
    if (tab !== 'studies') {
      setSelectedStudy(null);
    }
    if (tab !== 'glossary') {
      setGlossaryTarget(null);
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      if (tab !== 'notes') {
        url.searchParams.delete('nota');
        url.searchParams.delete('note');
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleNavigateToGlossary = (topicId: string, bookId?: string) => {
    setGlossaryTarget({ topicId, bookId });
    setActiveTab('glossary');
    setSelectedStudy(null);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f4ee] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-sage-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-sage-800 font-medium tracking-wide">Verificando sesión pastoral...</p>
        </div>
      </div>
    );
  }

  // Si no hay sesión: permitir ver notas si el enlace compartido apunta a ellas (?tab=notes o ?nota=X)
  const isDirectNoteLink = (() => {
    try {
      const p = new URLSearchParams(window.location.search);
      return p.get('tab') === 'notes' || p.has('nota') || p.has('note');
    } catch {
      return false;
    }
  })();

  if (!user && !isDirectNoteLink) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-[#f2f4ee] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-sage-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <AuthScreen />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f4ee] text-[#192722] flex flex-col font-sans selection:bg-sage-200 selection:text-sage-950">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleSelectTab} 
        alerts={alerts}
        onSelectAdvisee={() => {
          setActiveTab('advisees');
        }}
      />

      {/* Main View Router con Suspense granular */}
      <main className="flex-1 w-full pb-20 md:pb-16">
        <Suspense fallback={<ViewFallbackLoader />}>
          {activeTab === 'studies' && (
            selectedStudy ? (
              <StudyDetail 
                study={selectedStudy} 
                onBack={() => {
                  setSelectedStudy(null);
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }} 
                onNavigateToGlossary={handleNavigateToGlossary}
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

          {activeTab === 'notes' && (
            <CounselingNotesView />
          )}

          {activeTab === 'glossary' && (
            <GlossaryView 
              initialTopicId={glossaryTarget?.topicId}
              initialBookId={glossaryTarget?.bookId}
            />
          )}

          {activeTab === 'methodology' && (
            <MethodologyView />
          )}

          {activeTab === 'advisees' && (
            <AdviseesDashboard sharedAdvisees={advisees} />
          )}
        </Suspense>
      </main>

      {/* Footer a pantalla completa */}
      <footer className="hidden md:block bg-[#e6eae0] border-t border-[#d2daca] py-4 text-center text-[11px] text-[#475a52]">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Anchor className="w-3.5 h-3.5 text-sage-800" />
            <span className="font-serif font-semibold text-[#192722] text-xs">Ancla Consejería Bíblica</span>
            <span className="text-[#a6b6a0]">|</span>
            <span className="text-[#475a52] italic text-[11px]">"Firmeza en la Verdad, Gracia en el Corazón"</span>
          </div>

          <div className="flex items-center space-x-5 text-[11px] text-[#475a52]">
            <span className="flex items-center space-x-1.5">
              <Shield className="w-3 h-3 text-sage-800" />
              <span>Confidencialidad Pastoral</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <BookOpen className="w-3 h-3 text-sage-800" />
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
