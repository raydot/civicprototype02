import { createContext, useContext, useState } from 'react';
import { Mode } from '@/types/api';

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  hasUpcomingBallots: boolean;
  setHasUpcomingBallots: (has: boolean) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('current');
  const [hasUpcomingBallots, setHasUpcomingBallots] = useState(false);

  return (
    <ModeContext.Provider 
      value={{ 
        mode, 
        setMode, 
        hasUpcomingBallots, 
        setHasUpcomingBallots 
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
