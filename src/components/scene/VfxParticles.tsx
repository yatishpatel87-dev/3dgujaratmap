import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { BackgroundPresetId, VfxPresetId } from '../../types/gujarat';

interface Props {
  density: number; // 0..100
  activePreset: VfxPresetId;
  backgroundPreset: BackgroundPresetId;
  focusXZ: [number, number] | null;
}

const MAX_PARTICLES = 420;

export const VfxParticles: React.FC<Props> = ({
  density,
  activePreset,
  backgroundPreset,
  focusXZ,
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, baseOffsets, speeds } = useMemo(() => {
    const pos = new Float32Array(MAX_PARTICLES * 3);
    const offsets = new Float32Array(MAX_PARTICLES * 3);
    const spd = new Float32Array(MAX_PARTICLES);

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const angle = Math.random() * Math.PI * 2;
      const rad = Math.random() * 9.5;
      const x = Math.cos(angle) * rad;
      const y = 0.2 + Math.random() * 4.5;
      const z = Math.sin(angle) * rad;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      offsets[i * 3] = x;
      offsets[i * 3 + 1] = y;
      offsets[i * 3 + 2] = z;
      spd[i] = 0.4 + Math.random() * 0.9;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return { geometry: geo, baseOffsets: offsets, speeds: spd };
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  const activeCount = Math.floor((density / 100) * MAX_PARTICLES);

  const particleColor = useMemo(() => {
    if (activePreset === 'golden' || backgroundPreset === 'golden') return '#fbbf24';
    if (activePreset === 'neon') return '#22d3ee';
    if (activePreset === 'spotlight') return '#fde047';
    return '#38bdf8';
  }, [activePreset, backgroundPreset]);

  useFrame((state) => {
    if (!pointsRef.current || activeCount <= 0) return;
    const t = state.clock.elapsedTime;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const isFocused = (activePreset === 'golden' || activePreset === 'spotlight') && focusXZ !== null;
    const fx = focusXZ ? focusXZ[0] : 0;
    const fz = focusXZ ? focusXZ[1] : 0;

    geometry.setDrawRange(0, activeCount);

    for (let i = 0; i < activeCount; i++) {
      const bx = baseOffsets[i * 3];
      const by = baseOffsets[i * 3 + 1];
      const bz = baseOffsets[i * 3 + 2];
      const sp = speeds[i];

      if (isFocused) {
        // Swirl golden particles around the focused district
        const angle = t * sp * 0.9 + i * 0.37;
        const r = 0.55 + (i % 12) * 0.14;
        const h = ((by + t * sp * 0.85) % 3.4) + 0.3;
        posAttr.setXYZ(i, fx + Math.cos(angle) * r, h, fz + Math.sin(angle) * r);
      } else {
        const y = ((by + t * sp * 0.35) % 4.6) + 0.15;
        const x = bx + Math.sin(t * 0.4 + i) * 0.18;
        const z = bz + Math.cos(t * 0.35 + i) * 0.18;
        posAttr.setXYZ(i, x, y, z);
      }
    }
    posAttr.needsUpdate = true;
  });

  if (activeCount === 0) return null;

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color={particleColor}
        size={activePreset === 'golden' ? 0.11 : 0.08}
        transparent
        opacity={activePreset === 'golden' || backgroundPreset === 'golden' ? 0.9 : 0.65}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
