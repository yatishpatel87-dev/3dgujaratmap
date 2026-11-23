import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { DISTRICTS_DB } from '../../data/districtsDatabase';
import { useStudioStore } from '../../store/useStudioStore';
import { RegionId } from '../../types/gujarat';
import { buildAllDistrictGeometries, createTerrainTextures } from '../../utils/geoToThree';
import { soundEffects } from '../../utils/soundEffects';
import { CinematicBackground } from './CinematicBackground';
import { DistrictMesh } from './DistrictMesh';
import { VfxParticles } from './VfxParticles';

// Detect software WebGL (SwiftShader / llvmpipe / WARP) for rendering cost adjustments only
const isSoftwareGl = (() => {
  if (typeof document === 'undefined') return false;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
})();

const FLYOVER_TOUR_IDS = [
  'kachchh',
  'vav-tharad',
  'patan',
  'gandhinagar',
  'ahmedabad',
  'vadodara',
  'narmada',
  'surat',
  'dang',
  'bhavnagar',
  'gir-somnath',
  'devbhumi-dwarka',
  'rajkot',
];

const REGION_SEQUENCE: RegionId[] = ['north', 'central', 'south', 'saurashtra', 'kachchh'];

const _camGoalPos = new THREE.Vector3(0, 11.2, 10.6);
const _camGoalTarget = new THREE.Vector3(0, 0, 0);

interface SceneContentProps {
  builtMap: Record<string, ReturnType<typeof buildAllDistrictGeometries>[string]>;
  onContextLost: () => void;
}

const SceneContent: React.FC<SceneContentProps> = ({ builtMap, onContextLost }) => {
  const { gl, scene, camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const mapGroupRef = useRef<THREE.Group>(null);
  const userInteractingRef = useRef(false);
  const scriptedCamActiveRef = useRef(false);
  const lastFlyoverIdRef = useRef<string | null>(null);
  const lastRegionRef = useRef<RegionId | null>(null);
  const lastRevealIdRef = useRef<string | null>(null);

  const selectedDistrictId = useStudioStore((s) => s.selectedDistrictId);
  const hoveredDistrictId = useStudioStore((s) => s.hoveredDistrictId);
  const regionFilter = useStudioStore((s) => s.regionFilter);
  const quizHighlightDistrictId = useStudioStore((s) => s.quizHighlightDistrictId);
  const onMapClickInQuiz = useStudioStore((s) => s.onMapClickInQuiz);
  const appMode = useStudioStore((s) => s.appMode);
  const setAppMode = useStudioStore((s) => s.setAppMode);
  const language = useStudioStore((s) => s.language);
  const setSelectedDistrictId = useStudioStore((s) => s.setSelectedDistrictId);
  const setHoveredDistrictId = useStudioStore((s) => s.setHoveredDistrictId);

  const activePreset = useStudioStore((s) => s.activePreset);
  const isPlaying = useStudioStore((s) => s.isPlaying);
  const timelineProgress = useStudioStore((s) => s.timelineProgress);
  const durationSec = useStudioStore((s) => s.durationSec);
  const speed = useStudioStore((s) => s.speed);
  const borderGlowIntensity = useStudioStore((s) => s.borderGlowIntensity);
  const lightIntensity = useStudioStore((s) => s.lightIntensity);
  const particleDensity = useStudioStore((s) => s.particleDensity);
  const backgroundPreset = useStudioStore((s) => s.backgroundPreset);
  const showLabels = useStudioStore((s) => s.showLabels);
  const cameraZoom = useStudioStore((s) => s.cameraZoom);
  const cameraRotationDeg = useStudioStore((s) => s.cameraRotationDeg);
  const cameraViewPreset = useStudioStore((s) => s.cameraViewPreset);
  const cameraTriggerNonce = useStudioStore((s) => s.cameraTriggerNonce);
  const activeRevealDistrictId = useStudioStore((s) => s.activeRevealDistrictId);
  const activeRegionReveal = useStudioStore((s) => s.activeRegionReveal);

  const setTimelineProgress = useStudioStore((s) => s.setTimelineProgress);
  const setIsPlaying = useStudioStore((s) => s.setIsPlaying);
  const setActiveRevealState = useStudioStore((s) => s.setActiveRevealState);
  const setCanvasElement = useStudioStore((s) => s.setCanvasElement);
  const autoTourDistricts = useStudioStore((s) => s.autoTourDistricts);

  // Studio Environment Map (RoomEnvironment + PMREMGenerator) & Canvas Registration
  useEffect(() => {
    setCanvasElement(gl.domElement);
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.12;

    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const handleLost = (e: Event) => {
      e.preventDefault();
      onContextLost();
    };
    gl.domElement.addEventListener('webglcontextlost', handleLost);

    return () => {
      gl.domElement.removeEventListener('webglcontextlost', handleLost);
      envTex.dispose();
      scene.environment = null;
      setCanvasElement(null);
    };
  }, [gl, scene, setCanvasElement, onContextLost]);

  // Procedural terrain PBR textures
  const terrainTextures = useMemo(() => {
    const maxAniso = isSoftwareGl ? 1 : Math.min(8, gl.capabilities.getMaxAnisotropy());
    return createTerrainTextures(maxAniso);
  }, [gl]);

  useEffect(() => {
    return () => {
      terrainTextures.map.dispose();
      terrainTextures.roughnessMap.dispose();
    };
  }, [terrainTextures]);

  // Camera View Presets (Perspective / Top / Front) + Zoom/Rotation controls
  useEffect(() => {
    if (cameraTriggerNonce === 0 && activePreset !== 'rotation') return;
    const baseDist = 15.2 / Math.max(0.5, cameraZoom);
    const rotRad = (cameraRotationDeg * Math.PI) / 180;

    if (cameraViewPreset === 'top') {
      _camGoalPos.set(Math.sin(rotRad) * 0.4, baseDist * 1.05, Math.cos(rotRad) * 0.4);
    } else if (cameraViewPreset === 'front') {
      _camGoalPos.set(Math.sin(rotRad) * baseDist, baseDist * 0.28, Math.cos(rotRad) * baseDist);
    } else {
      _camGoalPos.set(Math.sin(rotRad) * baseDist * 0.68, baseDist * 0.72, Math.cos(rotRad) * baseDist * 0.68);
    }
    _camGoalTarget.set(0, 0, 0);
    scriptedCamActiveRef.current = true;
  }, [cameraViewPreset, cameraTriggerNonce, cameraZoom, cameraRotationDeg, activePreset]);

  // Smooth GSAP camera focus when Golden preset, Auto-Tour narration, or Quiz Answer highlights a district
  const focusDistrictId =
    quizHighlightDistrictId ||
    (activePreset === 'golden' || autoTourDistricts ? selectedDistrictId : null);
  useEffect(() => {
    if (!focusDistrictId) return;
    const built = builtMap[focusDistrictId];
    if (!built) return;
    const [cx, cz] = built.centroidXZ;

    if (activePreset === 'golden' || quizHighlightDistrictId || autoTourDistricts) {
      userInteractingRef.current = false;
      scriptedCamActiveRef.current = false;
      const dist = activePreset === 'golden' ? 5.6 : autoTourDistricts ? 6.6 : 7.5;
      gsap.to(camera.position, {
        x: cx + 1.8,
        y: dist * 0.92,
        z: cz + dist * 0.78,
        duration: 1.15,
        ease: 'power3.out',
      });
      if (controlsRef.current) {
        gsap.to(controlsRef.current.target, {
          x: cx,
          y: 0.2,
          z: cz,
          duration: 1.15,
          ease: 'power3.out',
        });
      }
    }
  }, [focusDistrictId, activePreset, quizHighlightDistrictId, autoTourDistricts, builtMap, camera]);

  // Main Animation Timeline & Camera Driver
  useFrame((state, delta) => {
    // 1. Advance timeline when playing
    let prog = timelineProgress;
    if (isPlaying && activePreset !== 'none') {
      const step = (delta * speed) / Math.max(2, durationSec);
      prog = timelineProgress + step;
      if (prog >= 1) {
        if (activePreset === 'rotation' || activePreset === 'neon') {
          prog = prog % 1;
        } else {
          prog = 1;
          setIsPlaying(false);
        }
      }
      setTimelineProgress(prog);
    }

    // 2. Compute active district / region reveal states for HUD & presets
    if (activePreset === 'flyover') {
      const idx = Math.min(
        FLYOVER_TOUR_IDS.length - 1,
        Math.floor(prog * FLYOVER_TOUR_IDS.length)
      );
      const targetId = FLYOVER_TOUR_IDS[idx];
      if (lastFlyoverIdRef.current !== targetId) {
        lastFlyoverIdRef.current = targetId;
        setActiveRevealState(targetId, null);
      }
      const built = builtMap[targetId];
      if (built && !userInteractingRef.current && isPlaying) {
        const [cx, cz] = built.centroidXZ;
        _camGoalPos.set(cx + 1.4, 4.8, cz + 4.4);
        _camGoalTarget.set(cx, 0.25, cz);
        scriptedCamActiveRef.current = true;
      }
    } else if (activePreset === 'regionReveal') {
      const rIdx = Math.min(4, Math.floor(prog * 5));
      const reg = REGION_SEQUENCE[rIdx];
      if (lastRegionRef.current !== reg) {
        lastRegionRef.current = reg;
        setActiveRevealState(null, reg);
      }
    } else if (activePreset === 'reveal') {
      const dIdx = Math.min(DISTRICTS_DB.length - 1, Math.floor(prog * DISTRICTS_DB.length));
      const dId = DISTRICTS_DB[dIdx].id;
      if (lastRevealIdRef.current !== dId) {
        lastRevealIdRef.current = dId;
        setActiveRevealState(dId, null);
      }
    } else if (lastFlyoverIdRef.current || lastRegionRef.current || lastRevealIdRef.current) {
      lastFlyoverIdRef.current = null;
      lastRegionRef.current = null;
      lastRevealIdRef.current = null;
      setActiveRevealState(null, null);
    }

    // 3. 3D Rotation preset rotates entire map group smoothly
    if (mapGroupRef.current) {
      if (activePreset === 'rotation' && isPlaying) {
        mapGroupRef.current.rotation.y += delta * 0.45 * speed;
      } else {
        const targetRotY = (cameraRotationDeg * Math.PI) / 180;
        mapGroupRef.current.rotation.y = THREE.MathUtils.damp(
          mapGroupRef.current.rotation.y,
          targetRotY,
          6,
          delta
        );
      }
    }

    // 4. Smoothly interpolate scripted camera transitions when user isn't dragging
    if (scriptedCamActiveRef.current && !userInteractingRef.current && controlsRef.current) {
      camera.position.lerp(_camGoalPos, 1 - Math.exp(-3.6 * delta));
      controlsRef.current.target.lerp(_camGoalTarget, 1 - Math.exp(-3.6 * delta));
      controlsRef.current.update();

      if (
        camera.position.distanceTo(_camGoalPos) < 0.04 &&
        controlsRef.current.target.distanceTo(_camGoalTarget) < 0.04
      ) {
        scriptedCamActiveRef.current = false;
      }
    }
  });

  const handleDistrictSelect = (id: string) => {
    soundEffects.playDistrictSelect();
    if (appMode === 'quiz' && onMapClickInQuiz) {
      onMapClickInQuiz(id);
      return;
    }
    setSelectedDistrictId(id, true);
    if (appMode === 'explore') {
      setAppMode('learn');
    }
  };

  const handleDistrictHover = (id: string | null) => {
    if (id && id !== hoveredDistrictId) {
      soundEffects.playDistrictHover();
    }
    setHoveredDistrictId(id);
  };

  const focusXZ = useMemo<[number, number] | null>(() => {
    const id = quizHighlightDistrictId || selectedDistrictId;
    if (!id || !builtMap[id]) return null;
    return builtMap[id].centroidXZ;
  }, [quizHighlightDistrictId, selectedDistrictId, builtMap]);

  return (
    <>
      <CinematicBackground preset={backgroundPreset} lightIntensity={lightIntensity} />

      {/* Three-Point Studio Lighting Rig (warm key, cool hemisphere fill, cool rim) */}
      <hemisphereLight args={['#7dd3fc', '#0f172a', 0.65 * lightIntensity]} />
      <directionalLight
        position={[9, 15, 10]}
        intensity={1.55 * lightIntensity}
        color="#fff4e0"
        castShadow={!isSoftwareGl}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-11}
        shadow-camera-right={11}
        shadow-camera-top={11}
        shadow-camera-bottom={-11}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <directionalLight
        position={[-10, 8, -10]}
        intensity={0.75 * lightIntensity}
        color="#38bdf8"
      />

      {/* Focused Spotlight for Golden & Spotlight presets */}
      {(activePreset === 'spotlight' || activePreset === 'golden') && focusXZ && (
        <spotLight
          position={[focusXZ[0], 8.5, focusXZ[1] + 2.0]}
          angle={0.42}
          penumbra={0.7}
          intensity={activePreset === 'golden' ? 28 : 34}
          color={activePreset === 'golden' ? '#fbbf24' : '#7dd3fc'}
        />
      )}

      {/* Main 3D Gujarat Map Group (34 Individual Extruded District Meshes) */}
      <group ref={mapGroupRef}>
        {DISTRICTS_DB.map((district, index) => {
          const built = builtMap[district.id];
          if (!built) return null;
          const isDimmedByFilter =
            regionFilter !== 'all' && district.region !== regionFilter;

          return (
            <DistrictMesh
              key={district.id}
              district={district}
              index={index}
              totalCount={DISTRICTS_DB.length}
              built={built}
              terrainMap={terrainTextures.map}
              terrainRoughnessMap={terrainTextures.roughnessMap}
              language={language}
              isQuizMode={appMode === 'quiz'}
              isSelected={selectedDistrictId === district.id}
              isHovered={hoveredDistrictId === district.id}
              isDimmedByFilter={isDimmedByFilter}
              isQuizHighlighted={quizHighlightDistrictId === district.id}
              activePreset={activePreset}
              timelineProgress={timelineProgress}
              borderGlowIntensity={borderGlowIntensity}
              showLabels={showLabels}
              activeRevealDistrictId={activeRevealDistrictId}
              activeRegionReveal={activeRegionReveal}
              onSelect={handleDistrictSelect}
              onHover={handleDistrictHover}
            />
          );
        })}
      </group>

      <VfxParticles
        density={particleDensity}
        activePreset={activePreset}
        backgroundPreset={backgroundPreset}
        focusXZ={focusXZ}
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping={!isSoftwareGl}
        dampingFactor={0.07}
        minDistance={2.8}
        maxDistance={26}
        minPolarAngle={0.05}
        maxPolarAngle={Math.PI * 0.44}
        onStart={() => {
          userInteractingRef.current = true;
          scriptedCamActiveRef.current = false;
        }}
        onEnd={() => {
          userInteractingRef.current = false;
        }}
      />
    </>
  );
};

export const GujaratMapScene: React.FC = () => {
  const [contextLost, setContextLost] = useState(false);

  const builtMap = useMemo(() => {
    const depthMap: Record<string, number> = {};
    for (const d of DISTRICTS_DB) {
      depthMap[d.id] = d.elevationHint;
    }
    return buildAllDistrictGeometries(depthMap);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(builtMap).forEach((b) => {
        b.extrudeGeometry.dispose();
        b.borderGeometry.dispose();
      });
    };
  }, [builtMap]);

  if (contextLost) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#060B16] text-slate-200 p-6 text-center">
        <p className="font-display text-xl font-semibold text-cyan-300 mb-2">
          3D WebGL Context Interrupted
        </p>
        <p className="text-sm text-slate-400 max-w-md mb-4">
          The browser paused the 3D graphics context. Reload or restore the scene to continue viewing the 3D Gujarat Map.
        </p>
        <button
          onClick={() => setContextLost(false)}
          className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium text-sm hover:bg-cyan-400 transition-colors"
        >
          Restore 3D Viewport
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-[#060B16]">
      <Canvas
        shadows={!isSoftwareGl}
        dpr={isSoftwareGl ? 1 : [1, 2]}
        camera={{ position: [0, 11.2, 10.6], fov: 44, near: 0.1, far: 120 }}
        gl={{
          antialias: !isSoftwareGl,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
        }}
      >
        <SceneContent builtMap={builtMap} onContextLost={() => setContextLost(true)} />
      </Canvas>
    </div>
  );
};
