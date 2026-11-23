import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { BackgroundPresetId } from '../../types/gujarat';

interface Props {
  preset: BackgroundPresetId;
  lightIntensity: number;
}

const BG_COLORS: Record<BackgroundPresetId, string> = {
  black: '#04060b',
  darkblue: '#061124',
  space: '#030611',
  golden: '#0e0904',
  grid: '#040b18',
  satellite: '#061322',
};

const ACCENT_COLORS: Record<BackgroundPresetId, string> = {
  black: '#38bdf8',
  darkblue: '#38bdf8',
  space: '#818cf8',
  golden: '#f59e0b',
  grid: '#22d3ee',
  satellite: '#2dd4bf',
};

export const CinematicBackground: React.FC<Props> = ({ preset, lightIntensity }) => {
  const { scene } = useThree();
  const gridMatRef = useRef<THREE.ShaderMaterial>(null);
  const satMatRef = useRef<THREE.ShaderMaterial>(null);
  const auraMatRef = useRef<THREE.ShaderMaterial>(null);
  const skyMatRef = useRef<THREE.ShaderMaterial>(null);
  const starsRef = useRef<THREE.Points>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const color = new THREE.Color(BG_COLORS[preset]);
    scene.background = color;
    scene.fog = new THREE.FogExp2(color.getHex(), preset === 'black' ? 0.024 : 0.017);
  }, [preset, scene]);

  // Multi-layer starfield geometry (visible vibrantly in space, subtle in darkblue/golden)
  const starGeometry = useMemo(() => {
    const count = 1100;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const radius = 20 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(radius * Math.cos(phi)) * 0.85 + 0.8;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      c.setHSL(0.52 + Math.random() * 0.14, 0.75, 0.72 + Math.random() * 0.28);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  useEffect(() => {
    return () => {
      starGeometry.dispose();
    };
  }, [starGeometry]);

  // Atmospheric horizon aurora dome shader
  const skyDomeShaderArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uBaseColor: { value: new THREE.Color(BG_COLORS[preset]) },
        uAccentColor: { value: new THREE.Color(ACCENT_COLORS[preset]) },
        uIntensity: { value: 1.0 },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPos;
        uniform float uTime;
        uniform vec3 uBaseColor;
        uniform vec3 uAccentColor;
        uniform float uIntensity;

        void main() {
          vec3 dir = normalize(vWorldPos);
          float horizon = pow(1.0 - clamp(abs(dir.y), 0.0, 1.0), 3.2);
          float angle = atan(dir.z, dir.x);
          float aurora = 0.55 + 0.45 * sin(angle * 3.0 + uTime * 0.45) * cos(angle * 2.0 - uTime * 0.3);
          vec3 col = mix(uBaseColor, uAccentColor * 0.42, horizon * (0.35 + 0.35 * aurora) * uIntensity);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    }),
    []
  );

  // Subtle radar & concentric wave pulse floor shader around Gujarat
  const auraFloorShaderArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(ACCENT_COLORS[preset]) },
        uIntensity: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vWorldXZ;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldXZ = wp.xz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        varying vec2 vWorldXZ;
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uIntensity;

        void main() {
          float dist = length(vWorldXZ);
          float angle = atan(vWorldXZ.y, vWorldXZ.x);

          // Expanding soft radar rings
          float pulse = fract(dist * 0.14 - uTime * 0.22);
          float ring = smoothstep(0.06, 0.0, abs(pulse - 0.5)) * 0.42;

          // Subtle radial sweep beam
          float sweep = smoothstep(0.65, 1.0, cos(angle - uTime * 0.55));
          float radialRings = smoothstep(0.05, 0.0, abs(fract(dist * 0.35) - 0.5)) * 0.12;

          float fade = smoothstep(22.0, 4.5, dist) * smoothstep(2.0, 6.0, dist);
          float alpha = (ring + radialRings + sweep * 0.09) * fade * clamp(uIntensity, 0.4, 1.6);

          gl_FragColor = vec4(uColor * (0.85 + sweep * 0.4), clamp(alpha, 0.0, 0.55));
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
    []
  );

  // Digital grid floor shader
  const gridShaderArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#0ea5e9') },
        uIntensity: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vWorldXZ;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldXZ = wp.xz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        varying vec2 vWorldXZ;
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uIntensity;

        void main() {
          vec2 coord = vWorldXZ * 1.1;
          vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
          float line = min(grid.x, grid.y);
          float gridAlpha = 1.0 - min(line, 1.0);

          float dist = length(vWorldXZ);
          float wave = 0.5 + 0.5 * sin(dist * 0.9 - uTime * 2.2);
          float radialFade = exp(-dist * 0.085);

          vec3 col = uColor * (0.45 + 0.55 * wave) * uIntensity;
          float alpha = gridAlpha * radialFade * 0.58;
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    }),
    []
  );

  // Satellite ocean & bathymetric backdrop strictly around Gujarat (no neighboring states)
  const satelliteShaderArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec2 vWorldXZ;
        void main() {
          vUv = uv;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldXZ = wp.xz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec2 vWorldXZ;
        uniform float uTime;
        uniform float uIntensity;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
          );
        }

        void main() {
          float dist = length(vWorldXZ);
          float n = noise(vWorldXZ * 0.45 + uTime * 0.04) * 0.5 +
                    noise(vWorldXZ * 1.2 - uTime * 0.03) * 0.25;

          // Deep Arabian Sea bathymetry & subtle lat/lon grid
          vec3 deepSea = vec3(0.02, 0.07, 0.14);
          vec3 shallowSea = vec3(0.04, 0.17, 0.29);
          float coastalBand = smoothstep(14.0, 2.5, dist);
          vec3 col = mix(deepSea, shallowSea, coastalBand * (0.4 + 0.6 * n));

          // Subtle coordinate lines
          vec2 coord = vWorldXZ * 0.6;
          vec2 g = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
          float gridLine = 1.0 - min(min(g.x, g.y), 1.0);
          col += vec3(0.06, 0.22, 0.34) * gridLine * 0.25;

          float fade = smoothstep(32.0, 8.0, dist);
          gl_FragColor = vec4(col * uIntensity, fade * 0.92);
        }
      `,
      transparent: true,
      depthWrite: false,
    }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (skyMatRef.current) {
      skyMatRef.current.uniforms.uTime.value = t;
      skyMatRef.current.uniforms.uBaseColor.value.set(BG_COLORS[preset]);
      skyMatRef.current.uniforms.uAccentColor.value.set(ACCENT_COLORS[preset]);
      skyMatRef.current.uniforms.uIntensity.value =
        preset === 'black' ? 0.25 * lightIntensity : lightIntensity;
    }
    if (auraMatRef.current) {
      auraMatRef.current.uniforms.uTime.value = t;
      auraMatRef.current.uniforms.uColor.value.set(ACCENT_COLORS[preset]);
      auraMatRef.current.uniforms.uIntensity.value =
        preset === 'black' ? 0.35 * lightIntensity : lightIntensity;
    }
    if (gridMatRef.current) {
      gridMatRef.current.uniforms.uTime.value = t;
      gridMatRef.current.uniforms.uIntensity.value = lightIntensity;
    }
    if (satMatRef.current) {
      satMatRef.current.uniforms.uTime.value = t;
      satMatRef.current.uniforms.uIntensity.value = lightIntensity;
    }
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * (preset === 'space' ? 0.022 : 0.008);
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.06;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 0.09;
    }
  });

  return (
    <group>
      {/* Horizon Aurora Atmospheric Dome */}
      <mesh>
        <sphereGeometry args={[58, 32, 20]} />
        <shaderMaterial ref={skyMatRef} args={[skyDomeShaderArgs]} />
      </mesh>

      {/* Grounded plinth disc beneath Gujarat */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
        <circleGeometry args={[18, 64]} />
        <meshStandardMaterial
          color={
            preset === 'golden'
              ? '#171108'
              : preset === 'satellite'
              ? '#07182a'
              : '#070d1b'
          }
          roughness={0.85}
          metalness={0.15}
        />
      </mesh>

      {/* Animated Radar Pulse & Sweeping Aura Ring beneath Gujarat */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.028, 0]}>
        <circleGeometry args={[22, 64]} />
        <shaderMaterial ref={auraMatRef} args={[auraFloorShaderArgs]} />
      </mesh>

      {/* Rotating Dual Compass Telemetry Rings around Gujarat */}
      <mesh ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.022, 0]}>
        <ringGeometry args={[8.9, 9.04, 96]} />
        <meshBasicMaterial
          color={ACCENT_COLORS[preset]}
          transparent
          opacity={preset === 'black' ? 0.14 : 0.34}
        />
      </mesh>

      <mesh ref={innerRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <ringGeometry args={[9.45, 9.52, 64, 1, 0, Math.PI * 1.45]} />
        <meshBasicMaterial
          color={preset === 'golden' ? '#fde047' : '#7dd3fc'}
          transparent
          opacity={preset === 'black' ? 0.1 : 0.28}
        />
      </mesh>

      {preset === 'grid' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
          <planeGeometry args={[52, 52]} />
          <shaderMaterial ref={gridMatRef} args={[gridShaderArgs]} />
        </mesh>
      )}

      {preset === 'satellite' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
          <planeGeometry args={[64, 64]} />
          <shaderMaterial ref={satMatRef} args={[satelliteShaderArgs]} />
        </mesh>
      )}

      {(preset === 'space' || preset === 'darkblue' || preset === 'golden') && (
        <points ref={starsRef} geometry={starGeometry} frustumCulled={false}>
          <pointsMaterial
            color={preset === 'golden' ? '#fde68a' : '#ffffff'}
            size={preset === 'space' ? 0.16 : 0.09}
            vertexColors={preset === 'space'}
            transparent
            opacity={preset === 'space' ? 0.9 : 0.36}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
};
