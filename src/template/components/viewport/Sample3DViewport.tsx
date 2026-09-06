import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useUIStore } from '../../useUIStore';

export const Sample3DViewport: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const store = useUIStore();
  const { toolParams, gridVisible, theme, setCursorPos, viewPreset } = store;

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const axesRef = useRef<THREE.AxesHelper | null>(null);

  // Orbit state
  const isRotating = useRef(false);
  const isPanning = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  const spherical = useRef(new THREE.Spherical(60, Math.PI / 3, Math.PI / 4));

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme === 'dark' ? 0x0f1117 : 0xf8fafc);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(50, 80, 50);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight2.position.set(-50, -30, -50);
    scene.add(dirLight2);

    // 5. Helpers (Grid & Axes)
    const grid = new THREE.GridHelper(
      100,
      50,
      theme === 'dark' ? 0x555555 : 0xaaaaaa,
      theme === 'dark' ? 0x222222 : 0xe2e8f0
    );
    grid.position.y = 0;
    scene.add(grid);
    gridRef.current = grid;

    const axes = new THREE.AxesHelper(15);
    scene.add(axes);
    axesRef.current = axes;

    // 6. Interactive Mesh
    createMesh();

    // 7. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  function updateCameraPosition() {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;
    camera.position.setFromSpherical(spherical.current).add(cameraTarget.current);
    camera.lookAt(cameraTarget.current);
  }

  // Update Theme Background & Grid colors
  useEffect(() => {
    if (!sceneRef.current || !gridRef.current) return;
    const bgColor = theme === 'dark' ? 0x0f1117 : 0xf8fafc;
    sceneRef.current.background = new THREE.Color(bgColor);

    sceneRef.current.remove(gridRef.current);
    gridRef.current.geometry.dispose();

    const newGrid = new THREE.GridHelper(
      100,
      50,
      theme === 'dark' ? 0x555555 : 0xaaaaaa,
      theme === 'dark' ? 0x222222 : 0xe2e8f0
    );
    sceneRef.current.add(newGrid);
    gridRef.current = newGrid;
    gridRef.current.visible = gridVisible;
  }, [theme]);

  // Update Grid visibility
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.visible = gridVisible;
    }
  }, [gridVisible]);

  // Handle Preset View changes
  useEffect(() => {
    if (!cameraRef.current) return;
    switch (viewPreset) {
      case 'iso':
        spherical.current.set(60, Math.PI / 3, Math.PI / 4);
        break;
      case 'top':
        spherical.current.set(60, 0.01, 0);
        break;
      case 'front':
        spherical.current.set(60, Math.PI / 2, 0);
        break;
      case 'right':
        spherical.current.set(60, Math.PI / 2, Math.PI / 2);
        break;
    }
    updateCameraPosition();
  }, [viewPreset]);

  // Re-create or Update Mesh on ToolParams change
  const createMesh = () => {
    if (!sceneRef.current) return;

    if (meshRef.current) {
      sceneRef.current.remove(meshRef.current);
      meshRef.current.geometry.dispose();
      if (Array.isArray(meshRef.current.material)) {
        meshRef.current.material.forEach((m) => m.dispose());
      } else {
        meshRef.current.material.dispose();
      }
    }

    let geometry: THREE.BufferGeometry;
    switch (toolParams.shape) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(8, 32, 32);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(6, 6, 14, 32);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(8, 2.8, 24, 64);
        break;
      case 'cube':
      default:
        geometry = new THREE.BoxGeometry(12, 12, 12);
        break;
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(toolParams.color),
      roughness: 0.3,
      metalness: 0.2,
      wireframe: toolParams.wireframe,
      transparent: toolParams.opacity < 1.0,
      opacity: toolParams.opacity,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(toolParams.posX, toolParams.posY + 6, toolParams.posZ);
    mesh.scale.setScalar(toolParams.scale);
    sceneRef.current.add(mesh);
    meshRef.current = mesh;
  };

  useEffect(() => {
    createMesh();
  }, [
    toolParams.shape,
    toolParams.color,
    toolParams.opacity,
    toolParams.wireframe,
    toolParams.scale,
    toolParams.posX,
    toolParams.posY,
    toolParams.posZ,
  ]);

  // Mouse Interaction for Camera Navigation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      isRotating.current = true;
    } else if (e.button === 2 || e.button === 1) {
      isPanning.current = true;
    }
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    if (isRotating.current) {
      spherical.current.theta -= deltaX * 0.008;
      spherical.current.phi = Math.max(0.01, Math.min(Math.PI - 0.01, spherical.current.phi - deltaY * 0.008));
      updateCameraPosition();
    } else if (isPanning.current && cameraRef.current) {
      const panSpeed = 0.05;
      const camera = cameraRef.current;
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);

      cameraTarget.current.addScaledVector(right, -deltaX * panSpeed);
      cameraTarget.current.addScaledVector(up, deltaY * panSpeed);
      updateCameraPosition();
    }

    // Update coordinate readout in store
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      setCursorPos({
        x: Number((normX * 50).toFixed(1)),
        y: Number((normY * 50).toFixed(1)),
        z: 0.0,
      });
    }

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isRotating.current = false;
    isPanning.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
    spherical.current.radius = Math.max(10, Math.min(250, spherical.current.radius * zoomFactor));
    updateCameraPosition();
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
      className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
    />
  );
};
