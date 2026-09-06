import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { useProjectStore } from '../../store/useProjectStore';
import { useUiStore } from '../../store/useUiStore';
import type { SceneObject, CameraPreset } from '../../types/ui';

interface ObjectMeshProps {
  obj: SceneObject;
  isSelected: boolean;
  renderStyle: string;
  onSelect: () => void;
}

const ObjectMesh: React.FC<ObjectMeshProps> = ({
  obj,
  isSelected,
  renderStyle,
  onSelect,
}) => {
  if (!obj.visible) return null;

  const isWireframe = renderStyle === 'wireframe';
  const isXRay = renderStyle === 'xray';
  const isClay = renderStyle === 'clay';

  const materialProps = {
    color: isClay ? '#e2e8f0' : obj.color,
    roughness: isClay ? 0.8 : 0.3,
    metalness: isClay ? 0.05 : 0.2,
    wireframe: isWireframe,
    transparent: isXRay,
    opacity: isXRay ? 0.45 : 1,
    emissive: isSelected ? '#1e3a8a' : '#000000',
    emissiveIntensity: isSelected ? 0.4 : 0,
  };

  const renderGeometry = () => {
    switch (obj.type) {
      case 'cylinder':
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      case 'sphere':
        return <sphereGeometry args={[0.6, 32, 32]} />;
      case 'torus':
        return <torusGeometry args={[0.6, 0.2, 16, 64]} />;
      case 'box':
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh
      position={obj.position}
      rotation={obj.rotation}
      scale={obj.scale}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      castShadow
      receiveShadow
    >
      {renderGeometry()}
      <meshStandardMaterial {...materialProps} />
      {/* Aristas técnicas estilo CAD cuando está sombreado */}
      {!isWireframe && (
        <Edges
          scale={1.001}
          threshold={15}
          color={isSelected ? '#38bdf8' : '#1e293b'}
        />
      )}
    </mesh>
  );
};

// Componente para sincronizar la cámara según los presets de la BottomBar
const CameraController: React.FC<{ preset: CameraPreset }> = ({ preset }) => {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const camera = controls.object as THREE.PerspectiveCamera;

    const dist = 7;
    switch (preset) {
      case 'top':
        camera.position.set(0, dist, 0);
        break;
      case 'bottom':
        camera.position.set(0, -dist, 0);
        break;
      case 'front':
        camera.position.set(0, 1.5, dist);
        break;
      case 'back':
        camera.position.set(0, 1.5, -dist);
        break;
      case 'left':
        camera.position.set(-dist, 1.5, 0);
        break;
      case 'right':
        camera.position.set(dist, 1.5, 0);
        break;
      case 'isometric':
      default:
        camera.position.set(5, 5, 5);
        break;
    }
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
    controls.update();
  }, [preset]);

  return <OrbitControls ref={controlsRef} makeDefault dampingFactor={0.1} />;
};

export const CanvasViewport3D: React.FC = () => {
  const {
    objects,
    selectedObjectId,
    selectObject,
    updateObject,
  } = useProjectStore();

  const {
    cameraPreset,
    renderStyle,
    showGrid,
    showAxes,
    transformMode,
  } = useUiStore();

  const selectedObject = objects.find((o) => o.id === selectedObjectId);

  return (
    <div className="w-full h-full relative bg-[#0d0e12] overflow-hidden select-none">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 45, near: 0.1, far: 1000 }}
        shadows
        onPointerMissed={() => selectObject(null)}
      >
        <CameraController preset={cameraPreset} />

        {/* Iluminación de Estudio CAD */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-10, 8, -10]} intensity={0.4} />

        {/* Rejilla Paramétrica Infinita */}
        {showGrid && (
          <Grid
            renderOrder={-1}
            position={[0, -0.01, 0]}
            infiniteGrid
            cellSize={0.5}
            cellThickness={0.6}
            cellColor="#27272a"
            sectionSize={2.5}
            sectionThickness={1.2}
            sectionColor="#3f3f46"
            fadeDistance={30}
            fadeStrength={1.5}
          />
        )}

        {/* Ejes Cartesiano (X = Rojo, Y = Verde, Z = Azul) */}
        {showAxes && <axesHelper args={[2.5]} />}

        {/* Renderizado de Sólidos */}
        {objects.map((obj) => (
          <ObjectMesh
            key={obj.id}
            obj={obj}
            isSelected={selectedObjectId === obj.id}
            renderStyle={renderStyle}
            onSelect={() => selectObject(obj.id)}
          />
        ))}

        {/* Gizmo de Transformación 3D (Mover, Rotar, Escalar) si hay objeto seleccionado */}
        {selectedObject && transformMode !== 'none' && (
          <TransformControls
            object={undefined}
            position={selectedObject.position}
            rotation={selectedObject.rotation}
            scale={selectedObject.scale}
            mode={transformMode}
            onObjectChange={(e: any) => {
              if (e?.target?.object) {
                const { position, rotation, scale } = e.target.object;
                updateObject(selectedObject.id, {
                  position: [position.x, position.y, position.z],
                  rotation: [rotation.x, rotation.y, rotation.z],
                  scale: [scale.x, scale.y, scale.z],
                });
              }
            }}
          />
        )}
      </Canvas>
    </div>
  );
};
