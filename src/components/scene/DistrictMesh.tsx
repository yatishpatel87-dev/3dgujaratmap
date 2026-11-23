import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import {
  DistrictRecord,
  Language,
  REGION_COLORS,
  RegionId,
  VfxPresetId,
} from '../../types/gujarat';
import { BuiltDistrictGeometry, createDistrictLabelTexture } from '../../utils/geoToThree';
import { DistrictSpecialtyDiorama } from './DistrictSpecialtyDiorama';

interface Props {
  district: DistrictRecord;
  index: number;
  totalCount: number;
  built: BuiltDistrictGeometry;
  terrainMap: THREE.CanvasTexture;
  terrainRoughnessMap: THREE.CanvasTexture;
  language: Language;
  isQuizMode: boolean;
  isSelected: boolean;
  isHovered: boolean;
  isDimmedByFilter: boolean;
  isQuizHighlighted: boolean;
  activePreset: VfxPresetId;
  timelineProgress: number;
  borderGlowIntensity: number;
  showLabels: boolean;
  activeRevealDistrictId: string | null;
  activeRegionReveal: RegionId | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

const REGION_ORDER: RegionId[] = ['north', 'central', 'south', 'saurashtra', 'kachchh'];

// Pre-allocated scratch colors to avoid GC in useFrame
const _targetColor = new THREE.Color();
const _targetEmissive = new THREE.Color();
const _baseColor = new THREE.Color();
const _goldColor = new THREE.Color('#f59e0b');
const _goldEmissive = new THREE.Color('#b45309');
const _cyanColor = new THREE.Color('#0284c7');
const _cyanEmissive = new THREE.Color('#06b6d4');
const _dimColor = new THREE.Color('#0c1526');
const _blackColor = new THREE.Color('#000000');

export const DistrictMesh: React.FC<Props> = ({
  district,
  index,
  totalCount,
  built,
  terrainMap,
  terrainRoughnessMap,
  language,
  isQuizMode,
  isSelected,
  isHovered,
  isDimmedByFilter,
  isQuizHighlighted,
  activePreset,
  timelineProgress,
  borderGlowIntensity,
  showLabels,
  activeRevealDistrictId,
  activeRegionReveal,
  onSelect,
  onHover,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const dioramaAnchorRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const borderMatRef = useRef<THREE.ShaderMaterial>(null);
  const spriteRef = useRef<THREE.Sprite>(null);
  const spriteMatRef = useRef<THREE.SpriteMaterial>(null);

  const regionAccent = REGION_COLORS[district.region];
  const isHighlighted =
    isSelected ||
    isQuizHighlighted ||
    activeRevealDistrictId === district.id ||
    (activeRegionReveal !== null && activeRegionReveal === district.region);

  const showDiorama =
    !isDimmedByFilter && ((isSelected && !isQuizMode) || isQuizHighlighted);

  const dioramaScale = useMemo(() => {
    if (district.id === 'kachchh') return 0.96;
    if (built.areaApprox > 0.65) return 0.85;
    if (built.areaApprox > 0.25) return 0.72;
    return 0.56;
  }, [district.id, built.areaApprox]);

  // Label texture (recreated only when highlight state changes)
  const labelTexture = useMemo(() => {
    return createDistrictLabelTexture(
      district.nameGu,
      district.nameEn,
      activePreset === 'golden' ? '#fbbf24' : regionAccent,
      isHighlighted || isHovered
    );
  }, [district.nameGu, district.nameEn, regionAccent, isHighlighted, isHovered, activePreset]);

  useEffect(() => {
    return () => {
      labelTexture.dispose();
    };
  }, [labelTexture]);

  // Custom glowing border shader with draw-progress support
  const borderShaderArgs = useMemo(
    () => ({
      uniforms: {
        uColor: { value: new THREE.Color(regionAccent) },
        uDrawProgress: { value: 1.0 },
        uGlowIntensity: { value: 1.4 },
        uTime: { value: 0 },
        uWaveMode: { value: 0 },
      },
      vertexShader: `
        attribute float aProgress;
        varying float vProgress;
        varying vec3 vWorldPos;
        void main() {
          vProgress = aProgress;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uDrawProgress;
        uniform float uGlowIntensity;
        uniform float uTime;
        uniform float uWaveMode;
        varying float vProgress;
        varying vec3 vWorldPos;

        void main() {
          if (vProgress > uDrawProgress) discard;

          float headTip = smoothstep(max(0.0, uDrawProgress - 0.12), uDrawProgress, vProgress);
          float pulse = 1.0;
          if (uWaveMode > 0.5) {
            float d = length(vWorldPos.xz);
            pulse = 0.75 + 0.55 * sin(d * 1.4 - uTime * 3.8);
          }

          vec3 tipGlow = vec3(1.0, 0.96, 0.8) * headTip * step(uDrawProgress, 0.995) * 1.5;
          vec3 finalCol = (uColor * uGlowIntensity * pulse) + tipGlow;
          gl_FragColor = vec4(finalCol, clamp(0.65 + uGlowIntensity * 0.25, 0.0, 1.0));
        }
      `,
      transparent: true,
      depthWrite: false,
    }),
    [regionAccent]
  );

  // Compute label base scale based on district size so labels don't clutter small central districts
  const labelScaleBase = useMemo(() => {
    if (district.id === 'kachchh') return 1.45;
    if (built.areaApprox > 0.6) return 1.15;
    if (built.areaApprox > 0.25) return 0.96;
    return 0.82;
  }, [district.id, built.areaApprox]);

  useFrame((state, delta) => {
    if (
      !groupRef.current ||
      !materialRef.current ||
      !borderMatRef.current ||
      !spriteRef.current ||
      !spriteMatRef.current
    ) {
      return;
    }

    const t = state.clock.elapsedTime;
    const dampSpeed = 7.5;

    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let targetScaleY = 1;
    let drawProg = 1.0;
    let glowBoost = borderGlowIntensity;
    let labelAlpha = showLabels ? 0.85 : 0.0;
    let waveMode = 0.0;

    _baseColor.set(district.baseColor);
    _targetColor.copy(_baseColor);
    _targetEmissive.copy(_blackColor);
    let targetEmissiveIntensity = 0.1;

    // 1. Evaluate VFX Presets A - I
    if (activePreset === 'reveal') {
      const startAt = (index / totalCount) * 0.75;
      const localT = THREE.MathUtils.clamp((timelineProgress - startAt) / 0.18, 0, 1);
      drawProg = THREE.MathUtils.clamp(localT * 1.35, 0, 1);
      if (localT < 0.05) {
        _targetColor.set('#080d18');
        glowBoost = 0.15;
        labelAlpha = 0;
      } else {
        _targetColor.copy(_baseColor).lerp(_cyanColor, 0.25 * (1 - localT));
        _targetEmissive.set(regionAccent);
        targetEmissiveIntensity = 0.45 * localT;
        targetY = 0.12 * Math.sin(localT * Math.PI);
        labelAlpha = showLabels ? localT : 0;
      }
    } else if (activePreset === 'explosion') {
      const bell = Math.sin(timelineProgress * Math.PI); // 0 -> 1 -> 0
      const floatWave = Math.sin(t * 2.1 + index * 0.45) * 0.14 * bell;
      targetX = built.explodeDirXZ[0] * bell * 2.15;
      targetZ = built.explodeDirXZ[1] * bell * 2.15;
      targetY = bell * (0.55 + (index % 5) * 0.22) + floatWave;
      _targetEmissive.set(regionAccent);
      targetEmissiveIntensity = 0.25 + bell * 0.35;
    } else if (activePreset === 'golden') {
      if (isSelected) {
        _targetColor.copy(_goldColor);
        _targetEmissive.copy(_goldEmissive);
        targetEmissiveIntensity = 0.85 + Math.sin(t * 3.0) * 0.15;
        targetY = 0.28;
        targetScaleY = 1.45;
        glowBoost = Math.max(borderGlowIntensity, 2.2);
        labelAlpha = 1.0;
      } else {
        _targetColor.copy(_dimColor);
        targetEmissiveIntensity = 0.04;
        glowBoost = borderGlowIntensity * 0.4;
        labelAlpha = showLabels ? 0.3 : 0;
      }
    } else if (activePreset === 'neon') {
      waveMode = 1.0;
      const dist = Math.hypot(built.centroidXZ[0], built.centroidXZ[1]);
      const wave = 0.5 + 0.5 * Math.sin(dist * 1.3 - t * 3.5);
      _targetColor.set('#0a1b33').lerp(_cyanColor, wave * 0.5);
      _targetEmissive.copy(_cyanEmissive);
      targetEmissiveIntensity = 0.35 + wave * 0.55;
      glowBoost = Math.max(borderGlowIntensity, 1.8) + wave * 0.8;
      targetY = wave * 0.09;
    } else if (activePreset === 'flyover') {
      if (activeRevealDistrictId === district.id) {
        _targetColor.set(regionAccent);
        _targetEmissive.set(regionAccent);
        targetEmissiveIntensity = 0.7;
        targetY = 0.22;
        glowBoost = Math.max(borderGlowIntensity, 2.2);
        labelAlpha = 1.0;
      } else {
        targetEmissiveIntensity = 0.12;
        labelAlpha = showLabels ? 0.65 : 0;
      }
    } else if (activePreset === 'borderDraw') {
      const startAt = (index / totalCount) * 0.65;
      const localT = THREE.MathUtils.clamp((timelineProgress - startAt) / 0.25, 0, 1);
      drawProg = THREE.MathUtils.clamp(localT * 1.4, 0, 1);
      const colorFill = THREE.MathUtils.clamp((localT - 0.35) / 0.65, 0, 1);
      _targetColor.set('#080d18').lerp(_baseColor, colorFill);
      _targetEmissive.set(regionAccent);
      targetEmissiveIntensity = colorFill * 0.3;
      labelAlpha = showLabels ? colorFill : 0;
    } else if (activePreset === 'spotlight') {
      if (isSelected) {
        _targetColor.set(regionAccent).lerp(_goldColor, 0.25);
        _targetEmissive.set(regionAccent);
        targetEmissiveIntensity = 0.78;
        targetY = 0.28;
        targetScaleY = 1.35;
        glowBoost = Math.max(borderGlowIntensity, 2.3);
        labelAlpha = 1.0;
      } else {
        _targetColor.set('#090f1d');
        targetEmissiveIntensity = 0.02;
        glowBoost = 0.25;
        labelAlpha = 0.0;
      }
    } else if (activePreset === 'regionReveal') {
      const regionIdx = REGION_ORDER.indexOf(district.region);
      const activeIdx = Math.min(4, Math.floor(timelineProgress * 5));
      if (regionIdx === activeIdx) {
        _targetColor.set(regionAccent);
        _targetEmissive.set(regionAccent);
        targetEmissiveIntensity = 0.65;
        targetY = 0.22;
        glowBoost = Math.max(borderGlowIntensity, 2.0);
        labelAlpha = 1.0;
      } else if (regionIdx < activeIdx) {
        _targetColor.copy(_baseColor);
        _targetEmissive.set(regionAccent);
        targetEmissiveIntensity = 0.2;
        labelAlpha = showLabels ? 0.75 : 0;
      } else {
        _targetColor.set('#0a101f');
        glowBoost = 0.2;
        labelAlpha = 0.0;
      }
    }

    // 2. Apply interactive selection / hover / quiz / region filter overrides
    if (isQuizHighlighted) {
      _targetColor.set('#10b981');
      _targetEmissive.set('#34d399');
      targetEmissiveIntensity = 0.85 + Math.sin(t * 5) * 0.15;
      targetY = Math.max(targetY, 0.26);
      targetScaleY = Math.max(targetScaleY, 1.35);
      glowBoost = Math.max(glowBoost, 2.4);
      labelAlpha = 1.0;
    } else if (isSelected && activePreset !== 'golden' && activePreset !== 'spotlight') {
      _targetColor.set(regionAccent).lerp(_baseColor, 0.28);
      _targetEmissive.set(regionAccent);
      targetEmissiveIntensity = 0.55;
      targetY = Math.max(targetY, 0.18);
      targetScaleY = Math.max(targetScaleY, 1.25);
      glowBoost = Math.max(glowBoost, 2.1);
      labelAlpha = 1.0;
    } else if (isHovered) {
      _targetEmissive.set('#38bdf8');
      targetEmissiveIntensity = Math.max(targetEmissiveIntensity, 0.45);
      targetY = Math.max(targetY, 0.12);
      glowBoost = Math.max(glowBoost, 1.85);
      labelAlpha = 1.0;
    }

    if (isDimmedByFilter) {
      _targetColor.set('#0a101d');
      targetEmissiveIntensity = 0.02;
      glowBoost = 0.22;
      labelAlpha = 0.0;
    }

    // Smoothly damp transforms & materials
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      targetX,
      dampSpeed,
      delta
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetY,
      dampSpeed,
      delta
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      targetZ,
      dampSpeed,
      delta
    );

    if (meshRef.current) {
      meshRef.current.scale.y = THREE.MathUtils.damp(
        meshRef.current.scale.y,
        targetScaleY,
        dampSpeed,
        delta
      );
    }

    const currentScaleY = meshRef.current ? meshRef.current.scale.y : targetScaleY;
    const topSurfaceY = (district.elevationHint + 0.025) * currentScaleY;
    if (dioramaAnchorRef.current) {
      dioramaAnchorRef.current.position.y = topSurfaceY;
    }

    materialRef.current.color.lerp(_targetColor, 1 - Math.exp(-dampSpeed * delta));
    materialRef.current.emissive.lerp(_targetEmissive, 1 - Math.exp(-dampSpeed * delta));
    materialRef.current.emissiveIntensity = THREE.MathUtils.damp(
      materialRef.current.emissiveIntensity,
      targetEmissiveIntensity,
      dampSpeed,
      delta
    );

    // Update border shader uniforms
    borderMatRef.current.uniforms.uDrawProgress.value = drawProg;
    borderMatRef.current.uniforms.uGlowIntensity.value = glowBoost;
    borderMatRef.current.uniforms.uTime.value = t;
    borderMatRef.current.uniforms.uWaveMode.value = waveMode;

    if (activePreset === 'golden' && isSelected) {
      borderMatRef.current.uniforms.uColor.value.set('#fde047');
    } else if (activePreset === 'neon') {
      borderMatRef.current.uniforms.uColor.value.set('#22d3ee');
    } else if (isQuizHighlighted) {
      borderMatRef.current.uniforms.uColor.value.set('#34d399');
    } else if (isSelected || isHovered) {
      borderMatRef.current.uniforms.uColor.value.set('#7dd3fc');
    } else {
      borderMatRef.current.uniforms.uColor.value.set(regionAccent);
    }

    // Smoothly update sprite label opacity & scale
    spriteMatRef.current.opacity = THREE.MathUtils.damp(
      spriteMatRef.current.opacity,
      labelAlpha,
      dampSpeed,
      delta
    );
    spriteRef.current.visible = spriteMatRef.current.opacity > 0.03;

    const zoomBoost = isSelected || isHovered || isQuizHighlighted ? 1.24 : 1.0;
    const sx = labelScaleBase * zoomBoost;
    const sy = (labelScaleBase * 112) / 384 * zoomBoost;
    spriteRef.current.scale.set(sx, sy, 1);

    const targetLabelY = showDiorama
      ? topSurfaceY + dioramaScale * 1.18 + 0.24
      : district.elevationHint * targetScaleY + 0.34;
    spriteRef.current.position.y = THREE.MathUtils.damp(
      spriteRef.current.position.y,
      targetLabelY,
      dampSpeed,
      delta
    );
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    onHover(district.id);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'default';
    onHover(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(district.id);
  };

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        geometry={built.extrudeGeometry}
        castShadow
        receiveShadow
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <meshStandardMaterial
          ref={materialRef}
          color={district.baseColor}
          map={terrainMap}
          roughnessMap={terrainRoughnessMap}
          roughness={0.58}
          metalness={0.22}
          emissive="#000000"
          emissiveIntensity={0.1}
        />
      </mesh>

      <lineSegments geometry={built.borderGeometry}>
        <shaderMaterial ref={borderMatRef} args={[borderShaderArgs]} />
      </lineSegments>

      {showDiorama && (
        <group
          ref={dioramaAnchorRef}
          position={[0, district.elevationHint + 0.025, 0]}
          onClick={handleClick}
        >
          <DistrictSpecialtyDiorama
            districtId={district.id}
            language={language}
            scale={dioramaScale}
            positionY={0}
            centroidXZ={built.centroidXZ}
          />
        </group>
      )}

      <sprite
        ref={spriteRef}
        position={[built.centroidXZ[0], district.elevationHint + 0.34, built.centroidXZ[1]]}
        renderOrder={12}
      >
        <spriteMaterial
          ref={spriteMatRef}
          map={labelTexture}
          transparent
          opacity={showLabels ? 0.85 : 0}
          depthTest={false}
        />
      </sprite>
    </group>
  );
};
