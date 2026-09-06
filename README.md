# EasyCAD UI Template & Starter Kit

Una plantilla de interfaz de usuario moderna, desacoplada y de grado industrial para aplicaciones **CAD 3D, editores de diseño, suites creativas, simuladores y tableros técnicos**, extraída y purificada a partir del diseño de **EasyCAD**.

---

## 🌟 Características Principales

- **Diseño Ergonómico Grado Industrial**: Inspirado en la experiencia de usuario de herramientas líderes (*Autodesk Fusion 360, Blender, Onshape*).
- **100% Desacoplado**: Sin dependencias pesadas de OpenCASCADE WASM ni servicios cloud fijos. Carga en milisegundos.
- **Modo Dashboard & Workspaces**:
  - **Dashboard**: Vista de proyectos recientes, selector de plantillas y gestión de archivos.
  - **Espacios de Trabajo (Workspaces)**: Conmutador de vistas (Modelado 3D, Boceto 2D, Render Fotorealista, Planos Técnicos).
- **Barra Superior (FusionHeader)**:
  - Título editable del documento y estado de guardado.
  - Botones rápidos: Guardar, Deshacer/Rehacer, Pantalla Completa, Ajustes.
  - Selector de espacios de trabajo con dropdown animado.
- **Cinta de Herramientas Modular (RibbonBar)**:
  - Pestañas temáticas dinámicas según el espacio activo.
  - Botones de herramientas con icono, etiquetas y estado activo.
  - Plegado / desplegado suave de la cinta.
- **Panel Lateral Derecho (SidebarRight)**:
  - **Outliner**: Árbol jerárquico de objetos con renombrado in-place, visibilidad (ojo), bloqueo (candado), duplicación y eliminación.
  - **Librería de Componentes**: Catálogo visual de piezas reutilizables con buscador y categorías.
  - Plegado y desplegado interactivo con tirador flotante.
- **Inspector de Propiedades Flotante (ToolContextPanel)**:
  - Edición de posición X/Y/Z, escala L/A/H, paleta de colores y modos de manipulación 3D (Mover, Rotar, Escalar).
- **Barra Inferior (BottomBar)**:
  - Controles de navegación de cámara (Home, Ajustar vista, presets de proyección: Top, Front, Right, Isometric).
  - Selector de estilos de render (Sombreado CAD, Malla de alambre, Rayos X, Arcilla).
  - Toggles de grilla, ejes y snapping magnético.
  - Lectura de coordenadas en tiempo real.
- **Viewport 3D Ligero y Reactivo**:
  - Three.js (`@react-three/fiber` + `@react-three/drei`) con iluminación de estudio, sombras, aristas técnicas CAD y gizmos de transformación.
- **Sistema de Temas & Notificaciones**:
  - Soporte Dark / Light mode con variables CSS de alta precisión.
  - `WorkspaceNotice` para feedback no intrusivo en pantalla.
  - `SettingsModal` para configurar unidades y rendimiento visual.

---

## 🚀 Puesta en Marcha

### 1. Instalación de dependencias
```bash
npm install
```

### 2. Iniciar en desarrollo
```bash
npm run dev
```

### 3. Compilar para producción
```bash
npm run build
```

---

## 📂 Arquitectura del Proyecto

```
src/
├── components/
│   ├── dashboard/          # Selector y vista de bienvenida de proyectos
│   │   ├── Dashboard.tsx
│   │   └── ProjectCard.tsx
│   ├── layout/             # Layout principal
│   │   └── AppShell.tsx    # Ensambla Header, Ribbon, Viewport, Sidebar y BottomBar
│   ├── ui/                 # Componentes de UI desacoplados
│   │   ├── FusionHeader.tsx# Barra superior con menús y selector de workspaces
│   │   ├── RibbonBar.tsx   # Cinta de herramientas por pestañas
│   │   ├── SidebarRight.tsx# Outliner jerárquico y selector de panel
│   │   ├── LibraryPanel.tsx# Catálogo de recursos y piezas
│   │   ├── ToolContextPanel.tsx # Inspector de propiedades y transformación 3D
│   │   ├── BottomBar.tsx   # Barra inferior con presets de cámara y render
│   │   ├── WorkspaceNotice.tsx  # Notificaciones toast tipo CAD
│   │   └── SettingsModal.tsx    # Modal de ajustes y tema
│   └── viewport/           # Lienzo central
│       ├── CanvasViewport3D.tsx    # Viewport 3D Three.js
│       └── Canvas2DPlaceholder.tsx # Placeholder para vistas 2D
├── store/
│   ├── useUiStore.ts       # Estado de navegación, paneles, herramientas y cámara
│   └── useProjectStore.ts  # Estado de la escena, objetos, selección e historial undo/redo
├── data/
│   └── mockData.ts         # Datos iniciales de demostración
└── types/
    └── ui.ts               # Tipos TypeScript para objetos, herramientas y vistas
```

---

## 🛠️ Cómo Adaptar este Template para tu Proyecto

1. **Reemplazar el Viewport 3D**:
   - Si tu proyecto usa otro motor (Babylon.js, Pixi.js, Canvas 2D, SVG, OpenCASCADE o WebGPU), simplemente sustituye el componente `<CanvasViewport3D />` en [AppShell.tsx](src/components/layout/AppShell.tsx).
2. **Agregar Nuevas Herramientas al Ribbon**:
   - Edita las pestañas y botones en [RibbonBar.tsx](src/components/ui/RibbonBar.tsx) para conectar tus propias acciones.
3. **Personalizar el Catálogo de la Librería**:
   - Agrega o modifica los elementos en [mockData.ts](src/data/mockData.ts).
