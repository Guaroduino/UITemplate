import React from 'react';
import { RibbonHeader } from './components/header/RibbonHeader';
import { ViewportContainer } from './components/viewport/ViewportContainer';
import { Sample3DViewport } from './components/viewport/Sample3DViewport';
import { SplitSidebar } from './components/sidebar/SplitSidebar';
import { BottomBar } from './components/bottom/BottomBar';
import { SettingsModal } from './components/modals/SettingsModal';
import type { RibbonTab } from './types';

export interface AppLayoutProps {
  appTitle?: string;
  appBadge?: string;
  workspaces?: { id: string; name: string }[];
  tabs?: RibbonTab[];
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  appTitle = 'LOGO / MARCA (CABECERA SUPERIOR)',
  appBadge = 'BADGE SUPERIOR',
  workspaces,
  tabs,
  children,
}) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground font-sans select-none antialiased">
      {/* 1. Cabecera Principal y Cinta Ribbon */}
      <RibbonHeader
        appTitle={appTitle}
        appBadge={appBadge}
        workspaces={workspaces}
        tabs={tabs}
      />

      {/* 2. Área Central de Trabajo (Viewport + Split Sidebar) */}
      <div className="flex-1 flex w-full overflow-hidden relative">
        <ViewportContainer>
          {children || <Sample3DViewport />}
        </ViewportContainer>

        {/* 3. Columna Lateral Derecha con Divisor Deslizable */}
        <SplitSidebar />
      </div>

      {/* 4. Barra Inferior de Navegación y Estado */}
      <BottomBar />

      {/* 5. Modales Globales */}
      <SettingsModal />
    </div>
  );
};
