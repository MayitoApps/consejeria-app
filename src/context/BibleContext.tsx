import React, { createContext, useContext, useState, Suspense, lazy } from 'react';

const BibleReaderModal = lazy(() => import('../components/bible/BibleReaderModal').then(m => ({ default: m.BibleReaderModal })));

interface BibleContextType {
  openBible: (reference?: string) => void;
  closeBible: () => void;
  isBibleOpen: boolean;
  currentReference: string;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

export const BibleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBibleOpen, setIsBibleOpen] = useState(false);
  const [currentReference, setCurrentReference] = useState('Efesios 4:22-24');

  const openBible = (reference?: string) => {
    if (reference) {
      setCurrentReference(reference);
    }
    setIsBibleOpen(true);
  };

  const closeBible = () => {
    setIsBibleOpen(false);
  };

  return (
    <BibleContext.Provider value={{ openBible, closeBible, isBibleOpen, currentReference }}>
      {children}
      {isBibleOpen && (
        <Suspense fallback={null}>
          <BibleReaderModal 
            isOpen={isBibleOpen}
            onClose={closeBible}
            initialReference={currentReference}
          />
        </Suspense>
      )}
    </BibleContext.Provider>
  );
};

export const useBible = (): BibleContextType => {
  const context = useContext(BibleContext);
  if (!context) {
    throw new Error('useBible must be used within a BibleProvider');
  }
  return context;
};
