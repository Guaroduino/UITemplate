import React from 'react';
import { useUiStore } from './store/useUiStore';
import { Dashboard } from './components/dashboard/Dashboard';
import { AppShell } from './components/layout/AppShell';

export const App: React.FC = () => {
  const { view } = useUiStore();

  return (
    <div className="h-full w-full overflow-hidden bg-background text-foreground select-none">
      {view === 'dashboard' ? <Dashboard /> : <AppShell />}
    </div>
  );
};

export default App;
