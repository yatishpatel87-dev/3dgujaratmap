import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  DISTRICT_SPECIALTIES,
  SpecialtyDioramaId,
} from '../../data/districtSpecialties';
import { Language } from '../../types/gujarat';

interface Props {
  districtId: string;
  language: Language;
  scale: number;
  positionY: number;
  centroidXZ: [number, number];
}

function createSpecialtyPlaqueTexture(
  titleText: string,
  accentColor: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 448;
  canvas.height = 84;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const r = 10;
  const pad = 6;
  const w = canvas.width - pad * 2;
  const h = canvas.height - pad * 2;

  ctx.beginPath();
  ctx.moveTo(pad + r, pad);
  ctx.lineTo(pad + w - r, pad);
  ctx.quadraticCurveTo(pad + w, pad, pad + w, pad + r);
  ctx.lineTo(pad + w, pad + h - r);
  ctx.quadraticCurveTo(pad + w, pad + h, pad + w - r, pad + h);
  ctx.lineTo(pad + r, pad + h);
  ctx.quadraticCurveTo(pad, pad + h, pad, pad + h - r);
  ctx.lineTo(pad, pad + r);
  ctx.quadraticCurveTo(pad, pad, pad + r, pad);
  ctx.closePath();

  ctx.fillStyle = 'rgba(6, 12, 26, 0.92)';
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = accentColor;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 24px "Noto Sans Gujarati", "Outfit", sans-serif';
  ctx.fillStyle = '#FEF08A';
  ctx.fillText(titleText, canvas.width / 2, canvas.height / 2 + 1, canvas.width - 28);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

const DioramaModel: React.FC<{
  dioramaId: SpecialtyDioramaId;
  accentColor: string;
  spinnerRef: React.RefObject<THREE.Group | null>;
  secondaryMotionRef: React.RefObject<THREE.Group | null>;
}> = ({ dioramaId, accentColor, spinnerRef, secondaryMotionRef }) => {
  switch (dioramaId) {
    case 'ashramCharkha':
      return (
        <group>
          {/* Sabarmati Ashram veranda base & columns */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <boxGeometry args={[0.62, 0.06, 0.44]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.82} />
          </mesh>
          {[-0.24, 0.24].map((x) =>
            [-0.16, 0.16].map((z) => (
              <mesh key={`${x}-${z}`} position={[x, 0.2, z]} castShadow>
                <cylinderGeometry args={[0.022, 0.025, 0.22, 10]} />
                <meshStandardMaterial color="#92400e" roughness={0.78} />
              </mesh>
            ))
          )}
          {/* Sloped Mangalore-tile roof */}
          <mesh position={[0, 0.34, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[0.42, 0.16, 4]} />
            <meshStandardMaterial color="#b45309" roughness={0.75} />
          </mesh>
          {/* Spinning Charkha wheel in front */}
          <group ref={spinnerRef} position={[0, 0.2, 0.12]}>
            <mesh>
              <torusGeometry args={[0.11, 0.014, 10, 24]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.25} metalness={0.85} />
            </mesh>
            {[0, 1, 2, 3].map((i) => (
              <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
                <boxGeometry args={[0.21, 0.01, 0.01]} />
                <meshStandardMaterial color="#fde68a" roughness={0.3} metalness={0.8} />
              </mesh>
            ))}
          </group>
        </group>
      );

    case 'statueOfUnity':
      return (
        <group>
          {/* Narmada water ring */}
          <mesh position={[0, 0.045, 0]}>
            <cylinderGeometry args={[0.42, 0.44, 0.025, 28]} />
            <meshStandardMaterial color="#0284c7" roughness={0.14} metalness={0.35} />
          </mesh>
          {/* Sardar Sarovar stepped island & pedestal */}
          <mesh position={[0, 0.11, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.27, 0.11, 8]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.82} />
          </mesh>
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.17, 0.1, 8]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
          </mesh>
          {/* Bronze Statue torso, shawl & head */}
          <mesh position={[-0.03, 0.38, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.055, 0.28, 10]} />
            <meshStandardMaterial color="#b45309" roughness={0.28} metalness={0.85} />
          </mesh>
          <mesh position={[0.03, 0.38, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.055, 0.28, 10]} />
            <meshStandardMaterial color="#b45309" roughness={0.28} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0.57, 0]} castShadow>
            <cylinderGeometry args={[0.095, 0.08, 0.24, 12]} />
            <meshStandardMaterial color="#d97706" roughness={0.24} metalness={0.88} />
          </mesh>
          <mesh position={[0.04, 0.58, 0.045]} rotation={[0, 0, -0.25]} castShadow>
            <boxGeometry args={[0.12, 0.22, 0.035]} />
            <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0.74, 0]} castShadow>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.22} metalness={0.9} />
          </mesh>
        </group>
      );

    case 'diamondBourse':
      return (
        <group>
          {/* Twin glass diamond bourse towers */}
          <mesh position={[-0.18, 0.22, -0.05]} castShadow>
            <boxGeometry args={[0.16, 0.34, 0.16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.25} metalness={0.75} />
          </mesh>
          <mesh position={[0.18, 0.25, -0.05]} castShadow>
            <boxGeometry args={[0.16, 0.4, 0.16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.25} metalness={0.75} />
          </mesh>
          {/* Rotating crystal diamond centerpiece */}
          <group ref={spinnerRef} position={[0, 0.5, 0.06]}>
            <mesh position={[0, 0.06, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.2, 0.08, 8]} />
              <meshStandardMaterial
                color="#a5f3fc"
                emissive="#06b6d4"
                emissiveIntensity={0.35}
                roughness={0.08}
                metalness={0.3}
              />
            </mesh>
            <mesh position={[0, -0.07, 0]} castShadow>
              <coneGeometry args={[0.2, 0.18, 8]} />
              <meshStandardMaterial
                color="#cffafe"
                emissive="#22d3ee"
                emissiveIntensity={0.3}
                roughness={0.08}
                metalness={0.35}
              />
            </mesh>
          </group>
        </group>
      );

    case 'whiteRannBhunga':
      return (
        <group>
          {/* White Rann salt flat plate */}
          <mesh position={[0, 0.05, 0]} receiveShadow>
            <cylinderGeometry args={[0.42, 0.44, 0.03, 24]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.85} />
          </mesh>
          {/* Traditional Kachchhi Bhunga circular hut */}
          <mesh position={[-0.08, 0.18, 0.02]} castShadow>
            <cylinderGeometry args={[0.15, 0.16, 0.22, 18]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.82} />
          </mesh>
          {/* Decorative Mud-Mirror band */}
          <mesh position={[-0.08, 0.2, 0.02]}>
            <cylinderGeometry args={[0.156, 0.156, 0.04, 18]} />
            <meshStandardMaterial color="#e11d48" roughness={0.45} />
          </mesh>
          {/* Conical thatched Bhunga roof */}
          <mesh position={[-0.08, 0.37, 0.02]} castShadow>
            <coneGeometry args={[0.21, 0.2, 18]} />
            <meshStandardMaterial color="#b45309" roughness={0.88} />
          </mesh>
          {/* Khavda Solar Renewable Energy Panels */}
          {[0.16, 0.27].map((x, idx) => (
            <group key={x} position={[x, 0.14, -0.06 + idx * 0.14]} rotation={[-0.45, 0, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.13, 0.015, 0.1]} />
                <meshStandardMaterial color="#1d4ed8" roughness={0.18} metalness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      );

    case 'akshardhamTemple':
    case 'somnathTemple':
    case 'dwarkaTemple':
    case 'dakorTemple':
    case 'salangpurTemple': {
      const stoneColor =
        dioramaId === 'akshardhamTemple'
          ? '#f59e0b'
          : dioramaId === 'somnathTemple'
          ? '#fbbf24'
          : dioramaId === 'dwarkaTemple'
          ? '#fde68a'
          : '#f8fafc';
      const trimColor = dioramaId === 'dakorTemple' || dioramaId === 'salangpurTemple' ? '#f59e0b' : '#b45309';

      return (
        <group>
          {/* Coastal water rim for Somnath & Dwarka */}
          {(dioramaId === 'somnathTemple' || dioramaId === 'dwarkaTemple') && (
            <mesh position={[0, 0.045, 0]}>
              <cylinderGeometry args={[0.42, 0.44, 0.025, 24]} />
              <meshStandardMaterial color="#0284c7" roughness={0.15} metalness={0.35} />
            </mesh>
          )}
          {/* Stepped Jagati plinth */}
          <mesh position={[0, 0.09, 0]} castShadow>
            <boxGeometry args={[0.52, 0.08, 0.44]} />
            <meshStandardMaterial color={stoneColor} roughness={0.75} />
          </mesh>
          {/* Mandap pavilion */}
          <mesh position={[0, 0.19, 0.08]} castShadow>
            <boxGeometry args={[0.36, 0.13, 0.24]} />
            <meshStandardMaterial color={stoneColor} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.3, 0.08]} castShadow>
            <coneGeometry args={[0.17, 0.12, 8]} />
            <meshStandardMaterial color={trimColor} roughness={0.62} />
          </mesh>
          {/* Main tall multi-tier Shikhar */}
          <mesh position={[0, 0.27, -0.07]} castShadow>
            <cylinderGeometry args={[0.09, 0.15, 0.28, 8]} />
            <meshStandardMaterial color={stoneColor} roughness={0.68} />
          </mesh>
          <mesh position={[0, 0.48, -0.07]} castShadow>
            <coneGeometry args={[0.12, 0.2, 8]} />
            <meshStandardMaterial color={trimColor} roughness={0.55} />
          </mesh>
          {/* Golden Kalash & waving Dhwaja flag */}
          <mesh position={[0, 0.61, -0.07]}>
            <sphereGeometry args={[0.032, 12, 12]} />
            <meshStandardMaterial color="#fde047" roughness={0.15} metalness={0.95} />
          </mesh>
          <group ref={spinnerRef} position={[0, 0.66, -0.07]}>
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.12, 6]} />
              <meshStandardMaterial color="#fde047" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0.055, 0.075, 0]}>
              <boxGeometry args={[0.1, 0.04, 0.008]} />
              <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={0.3} roughness={0.6} />
            </mesh>
          </group>
        </group>
      );
    }

    case 'raniKiVav':
      return (
        <group>
          {/* Stepped terraced carved stone pavilions */}
          <mesh position={[0, 0.09, 0]} castShadow>
            <boxGeometry args={[0.56, 0.08, 0.44]} />
            <meshStandardMaterial color="#d97706" roughness={0.78} />
          </mesh>
          <mesh position={[0, 0.16, -0.06]} castShadow>
            <boxGeometry args={[0.42, 0.08, 0.28]} />
            <meshStandardMaterial color="#b45309" roughness={0.76} />
          </mesh>
          {/* Emerald water kund */}
          <mesh position={[0, 0.145, 0.09]}>
            <boxGeometry args={[0.26, 0.02, 0.18]} />
            <meshStandardMaterial color="#0d9488" roughness={0.12} metalness={0.35} />
          </mesh>
          {/* Pillars & carved pavilion */}
          {[-0.15, -0.05, 0.05, 0.15].map((x) => (
            <mesh key={x} position={[x, 0.27, -0.08]} castShadow>
              <cylinderGeometry args={[0.018, 0.02, 0.14, 8]} />
              <meshStandardMaterial color="#fde68a" roughness={0.7} />
            </mesh>
          ))}
          <mesh position={[0, 0.36, -0.08]} castShadow>
            <boxGeometry args={[0.4, 0.04, 0.14]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.65} />
          </mesh>
          {/* Patola color accent border */}
          <mesh position={[0, 0.055, 0.23]}>
            <boxGeometry args={[0.52, 0.025, 0.025]} />
            <meshStandardMaterial color="#ec4899" roughness={0.45} />
          </mesh>
        </group>
      );

    case 'sunTemple':
      return (
        <group>
          {/* Surya Kund stepped pool */}
          <mesh position={[0, 0.06, 0.1]} castShadow>
            <boxGeometry args={[0.46, 0.04, 0.24]} />
            <meshStandardMaterial color="#0284c7" roughness={0.14} metalness={0.3} />
          </mesh>
          {/* Sabha Mandap sandstone base & pillars */}
          <mesh position={[0, 0.12, -0.1]} castShadow>
            <boxGeometry args={[0.42, 0.1, 0.22]} />
            <meshStandardMaterial color="#d97706" roughness={0.76} />
          </mesh>
          {[-0.14, -0.05, 0.05, 0.14].map((x) => (
            <mesh key={x} position={[x, 0.23, -0.04]} castShadow>
              <cylinderGeometry args={[0.018, 0.02, 0.14, 8]} />
              <meshStandardMaterial color="#fbbf24" roughness={0.72} />
            </mesh>
          ))}
          <mesh position={[0, 0.32, -0.1]} castShadow>
            <coneGeometry args={[0.16, 0.1, 6]} />
            <meshStandardMaterial color="#b45309" roughness={0.7} />
          </mesh>
          {/* Radiant golden Sun Disc behind temple */}
          <group ref={spinnerRef} position={[0, 0.48, -0.14]}>
            <mesh>
              <cylinderGeometry args={[0.11, 0.11, 0.02, 20]} />
              <meshStandardMaterial
                color="#fde047"
                emissive="#f59e0b"
                emissiveIntensity={0.65}
                roughness={0.2}
                metalness={0.85}
              />
            </mesh>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <mesh key={i} rotation={[0, 0, (i * Math.PI) / 6]}>
                <boxGeometry args={[0.3, 0.018, 0.012]} />
                <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={0.5} />
              </mesh>
            ))}
          </group>
        </group>
      );

    case 'clockTowerCeramic':
      return (
        <group>
          {/* Glazed Ceramic Tile Mosaic Base */}
          <mesh position={[0, 0.06, 0]} castShadow>
            <boxGeometry args={[0.46, 0.04, 0.46]} />
            <meshStandardMaterial color="#e0f2fe" roughness={0.18} metalness={0.2} />
          </mesh>
          <mesh position={[-0.14, 0.085, 0.14]}>
            <boxGeometry args={[0.12, 0.015, 0.12]} />
            <meshStandardMaterial color="#0284c7" roughness={0.15} />
          </mesh>
          <mesh position={[0.14, 0.085, -0.14]}>
            <boxGeometry args={[0.12, 0.015, 0.12]} />
            <meshStandardMaterial color="#0d9488" roughness={0.15} />
          </mesh>
          {/* Tall Morbi Clock Tower */}
          <mesh position={[0, 0.29, 0]} castShadow>
            <boxGeometry args={[0.18, 0.42, 0.18]} />
            <meshStandardMaterial color="#fde68a" roughness={0.65} />
          </mesh>
          {/* Glowing Clock Face */}
          <mesh position={[0, 0.4, 0.095]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.015, 20]} />
            <meshStandardMaterial color="#ffffff" emissive="#fef08a" emissiveIntensity={0.35} />
          </mesh>
          {/* Cupola Dome */}
          <mesh position={[0, 0.54, 0]} castShadow>
            <sphereGeometry args={[0.095, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color="#b45309" roughness={0.35} metalness={0.65} />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <coneGeometry args={[0.02, 0.08, 8]} />
            <meshStandardMaterial color="#fde047" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      );

    case 'dairyRevolution':
      return (
        <group>
          {/* Clean Cooperative Plant Base */}
          <mesh position={[0, 0.11, -0.05]} castShadow>
            <boxGeometry args={[0.48, 0.12, 0.28]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.55} />
          </mesh>
          <mesh position={[0, 0.18, -0.05]}>
            <boxGeometry args={[0.5, 0.025, 0.3]} />
            <meshStandardMaterial color="#0284c7" roughness={0.35} />
          </mesh>
          {/* Twin Stainless Steel Milk Silos */}
          {[-0.13, 0.04].map((x) => (
            <group key={x} position={[x, 0.31, -0.06]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.07, 0.07, 0.28, 20]} />
                <meshStandardMaterial color="#e2e8f0" roughness={0.18} metalness={0.9} />
              </mesh>
              <mesh position={[0, 0.14, 0]}>
                <sphereGeometry args={[0.07, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.18} metalness={0.9} />
              </mesh>
            </group>
          ))}
          {/* Milk Can Monument in Front */}
          <mesh position={[0.19, 0.24, 0.12]} castShadow>
            <cylinderGeometry args={[0.055, 0.07, 0.18, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.22} metalness={0.75} />
          </mesh>
          {/* Floating Milk Droplet Crest */}
          <group ref={spinnerRef} position={[0, 0.56, 0.06]}>
            <mesh>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color="#ffffff" emissive="#bae6fd" emissiveIntensity={0.4} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0.065, 0]}>
              <coneGeometry args={[0.048, 0.08, 16]} />
              <meshStandardMaterial color="#ffffff" emissive="#bae6fd" emissiveIntensity={0.4} roughness={0.15} />
            </mesh>
          </group>
        </group>
      );

    case 'oilRefinery':
      return (
        <group>
          {/* Twin tall metallic distillation towers */}
          <mesh position={[-0.16, 0.32, -0.06]} castShadow>
            <cylinderGeometry args={[0.055, 0.07, 0.52, 16]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.22} metalness={0.88} />
          </mesh>
          <mesh position={[0.0, 0.26, -0.09]} castShadow>
            <cylinderGeometry args={[0.045, 0.055, 0.4, 16]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.85} />
          </mesh>
          {/* Flare tip */}
          <mesh position={[-0.16, 0.61, -0.06]}>
            <coneGeometry args={[0.03, 0.08, 10]} />
            <meshStandardMaterial color="#fb923c" emissive="#f97316" emissiveIntensity={1.2} />
          </mesh>
          {/* Spherical storage tanks */}
          {[0.17, 0.26].map((x, idx) => (
            <mesh key={x} position={[x, 0.14, 0.08 - idx * 0.14]} castShadow>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.8} />
            </mesh>
          ))}
          {/* Brass City Golden Gear */}
          <group ref={spinnerRef} position={[-0.08, 0.13, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.08, 0.022, 8, 16]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.18} metalness={0.92} />
            </mesh>
          </group>
        </group>
      );

    case 'girnarRopeway':
      return (
        <group>
          {/* Sculpted Mount Girnar Peaks */}
          <mesh position={[-0.08, 0.25, -0.04]} castShadow>
            <coneGeometry args={[0.26, 0.44, 6]} />
            <meshStandardMaterial color="#475569" roughness={0.85} />
          </mesh>
          <mesh position={[0.14, 0.18, 0.08]} castShadow>
            <coneGeometry args={[0.19, 0.28, 6]} />
            <meshStandardMaterial color="#334155" roughness={0.88} />
          </mesh>
          {/* Gorakhnath Summit Shrine */}
          <mesh position={[-0.08, 0.49, -0.04]} castShadow>
            <boxGeometry args={[0.07, 0.07, 0.07]} />
            <meshStandardMaterial color="#fde68a" roughness={0.6} />
          </mesh>
          <mesh position={[-0.08, 0.56, -0.04]}>
            <coneGeometry args={[0.045, 0.08, 4]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} />
          </mesh>
          {/* Ropeway Pylon & Animated Cable Cabin */}
          <mesh position={[0.22, 0.18, 0.14]}>
            <cylinderGeometry args={[0.012, 0.018, 0.24, 6]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0.07, 0.38, 0.05]} rotation={[0.42, -0.52, -0.78]}>
            <cylinderGeometry args={[0.005, 0.005, 0.42, 6]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.3} />
          </mesh>
          <group ref={secondaryMotionRef} position={[0.07, 0.34, 0.05]}>
            <mesh castShadow>
              <boxGeometry args={[0.065, 0.055, 0.05]} />
              <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.25} roughness={0.3} />
            </mesh>
          </group>
        </group>
      );

    case 'engineeringGear':
      return (
        <group>
          {/* Foundry Base */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <boxGeometry args={[0.52, 0.07, 0.38]} />
            <meshStandardMaterial color="#1e293b" roughness={0.55} metalness={0.45} />
          </mesh>
          {/* Large Precision Gear */}
          <group ref={spinnerRef} position={[-0.08, 0.31, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.17, 0.17, 0.05, 18]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.22} metalness={0.88} />
            </mesh>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <mesh key={i} rotation={[0, (i * Math.PI) / 6, 0]}>
                <boxGeometry args={[0.4, 0.045, 0.045]} />
                <meshStandardMaterial color="#7dd3fc" roughness={0.22} metalness={0.9} />
              </mesh>
            ))}
          </group>
          {/* Secondary Meshing Golden Gear */}
          <group ref={secondaryMotionRef} position={[0.18, 0.24, 0.04]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.11, 0.11, 0.05, 14]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.92} />
            </mesh>
            {[0, 1, 2, 3].map((i) => (
              <mesh key={i} rotation={[0, (i * Math.PI) / 4, 0]}>
                <boxGeometry args={[0.26, 0.045, 0.04]} />
                <meshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.92} />
              </mesh>
            ))}
          </group>
        </group>
      );

    case 'laxmiVilasPalace':
      return (
        <group>
          {/* Sayaji lawn & wide Indo-Saracenic facade */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.43, 0.45, 0.025, 24]} />
            <meshStandardMaterial color="#15803d" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.56, 0.16, 0.26]} />
            <meshStandardMaterial color="#d97706" roughness={0.72} />
          </mesh>
          {/* Central Clock Minaret */}
          <mesh position={[0, 0.34, 0.02]} castShadow>
            <boxGeometry args={[0.12, 0.26, 0.12]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.68} />
          </mesh>
          <mesh position={[0, 0.51, 0.02]} castShadow>
            <sphereGeometry args={[0.07, 14, 12]} />
            <meshStandardMaterial color="#fde68a" roughness={0.35} metalness={0.5} />
          </mesh>
          {/* Flanking Onion Domes */}
          {[-0.2, 0.2].map((x) => (
            <group key={x} position={[x, 0.27, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.065, 14, 12]} />
                <meshStandardMaterial color="#b45309" roughness={0.45} metalness={0.35} />
              </mesh>
              <mesh position={[0, 0.08, 0]}>
                <coneGeometry args={[0.018, 0.06, 8]} />
                <meshStandardMaterial color="#fde047" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          ))}
        </group>
      );

    case 'seemaDarshan':
      return (
        <group>
          {/* Narmada Canal shimmer & sandy border plinth */}
          <mesh position={[0, 0.05, 0.15]}>
            <boxGeometry args={[0.56, 0.025, 0.12]} />
            <meshStandardMaterial color="#0ea5e9" roughness={0.14} metalness={0.35} />
          </mesh>
          {/* Monumental Seema Darshan Gateway Columns */}
          {[-0.17, 0.17].map((x) => (
            <mesh key={x} position={[x, 0.24, -0.05]} castShadow>
              <boxGeometry args={[0.08, 0.34, 0.08]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
            </mesh>
          ))}
          {/* Arch Crossbeam */}
          <mesh position={[0, 0.42, -0.05]} castShadow>
            <boxGeometry args={[0.46, 0.07, 0.1]} />
            <meshStandardMaterial color="#f97316" roughness={0.45} />
          </mesh>
          {/* Beacon Tower & Tricolor Motif */}
          <mesh position={[0, 0.54, -0.05]}>
            <cylinderGeometry args={[0.035, 0.05, 0.16, 12]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.45} roughness={0.25} />
          </mesh>
        </group>
      );

    case 'saputaraWaterfall':
      return (
        <group>
          {/* Lush Green Sahyadri Hills */}
          <mesh position={[-0.1, 0.24, -0.08]} castShadow>
            <coneGeometry args={[0.26, 0.4, 7]} />
            <meshStandardMaterial color="#166534" roughness={0.85} />
          </mesh>
          <mesh position={[0.16, 0.19, -0.02]} castShadow>
            <coneGeometry args={[0.2, 0.3, 7]} />
            <meshStandardMaterial color="#15803d" roughness={0.85} />
          </mesh>
          {/* Gira Waterfall Stream */}
          <mesh position={[0.02, 0.22, 0.09]} rotation={[-0.35, 0, 0]}>
            <boxGeometry args={[0.1, 0.32, 0.025]} />
            <meshStandardMaterial
              color="#7dd3fc"
              emissive="#0284c7"
              emissiveIntensity={0.55}
              roughness={0.1}
              metalness={0.25}
            />
          </mesh>
          {/* Misty Splash Pool */}
          <mesh position={[0.02, 0.055, 0.16]}>
            <cylinderGeometry args={[0.18, 0.2, 0.025, 18]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.12} metalness={0.35} />
          </mesh>
        </group>
      );

    case 'hydroDam':
      return (
        <group>
          {/* Reservoir Water */}
          <mesh position={[0, 0.12, -0.14]}>
            <boxGeometry args={[0.48, 0.14, 0.22]} />
            <meshStandardMaterial color="#0284c7" roughness={0.14} metalness={0.35} />
          </mesh>
          {/* Massive Concrete Dam Wall */}
          <mesh position={[0, 0.19, 0.02]} castShadow>
            <boxGeometry args={[0.56, 0.26, 0.09]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.78} />
          </mesh>
          {/* Spillway Water Streams */}
          {[-0.14, 0, 0.14].map((x) => (
            <mesh key={x} position={[x, 0.15, 0.1]} rotation={[-0.45, 0, 0]}>
              <boxGeometry args={[0.06, 0.2, 0.02]} />
              <meshStandardMaterial color="#bae6fd" emissive="#38bdf8" emissiveIntensity={0.4} roughness={0.12} />
            </mesh>
          ))}
        </group>
      );

    case 'cableBridge':
      return (
        <group>
          {/* Narmada Estuary Water */}
          <mesh position={[0, 0.045, 0]}>
            <boxGeometry args={[0.6, 0.025, 0.34]} />
            <meshStandardMaterial color="#0369a1" roughness={0.14} metalness={0.35} />
          </mesh>
          {/* Bridge Deck */}
          <mesh position={[0, 0.17, 0]} castShadow>
            <boxGeometry args={[0.64, 0.03, 0.11]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.55} />
          </mesh>
          {/* Twin A-frame Cable Pylons */}
          {[-0.14, 0.14].map((x) => (
            <group key={x} position={[x, 0.3, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.018, 0.028, 0.36, 8]} />
                <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.7} />
              </mesh>
              <mesh position={[0.07, -0.02, 0]} rotation={[0, 0, -0.65]}>
                <cylinderGeometry args={[0.005, 0.005, 0.22, 6]} />
                <meshStandardMaterial color="#fef08a" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh position={[-0.07, -0.02, 0]} rotation={[0, 0, 0.65]}>
                <cylinderGeometry args={[0.005, 0.005, 0.22, 6]} />
                <meshStandardMaterial color="#fef08a" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          ))}
        </group>
      );

    case 'dandiMemorial':
      return (
        <group>
          {/* Salt mound base */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.42, 0.44, 0.03, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.85} />
          </mesh>
          {/* Iconic Salt Satyagraha Crystal Pyramid Monument */}
          <mesh position={[0, 0.34, 0]} castShadow>
            <coneGeometry args={[0.19, 0.5, 4]} />
            <meshStandardMaterial
              color="#e0f2fe"
              emissive="#38bdf8"
              emissiveIntensity={0.28}
              roughness={0.14}
              metalness={0.45}
            />
          </mesh>
          {/* Surrounding crystalline salt cones */}
          {[-0.22, 0.22].map((x) => (
            <mesh key={x} position={[x, 0.13, 0.14]} castShadow>
              <coneGeometry args={[0.08, 0.12, 6]} />
              <meshStandardMaterial color="#ffffff" roughness={0.75} />
            </mesh>
          ))}
        </group>
      );

    case 'dinosaurPark':
      return (
        <group>
          {/* Terracotta Cretaceous Rock Strata */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.38, 0.42, 0.07, 9]} />
            <meshStandardMaterial color="#9a3412" roughness={0.88} />
          </mesh>
          {/* Rajasaurus Dinosaur Sculpture */}
          <group position={[-0.04, 0.24, 0]}>
            {/* Body */}
            <mesh rotation={[0, 0, 0.2]} castShadow>
              <capsuleGeometry args={[0.075, 0.18, 6, 12]} />
              <meshStandardMaterial color="#65a30d" roughness={0.65} />
            </mesh>
            {/* Neck & Head */}
            <mesh position={[0.13, 0.12, 0]} rotation={[0, 0, -0.4]} castShadow>
              <cylinderGeometry args={[0.035, 0.055, 0.14, 10]} />
              <meshStandardMaterial color="#65a30d" roughness={0.65} />
            </mesh>
            <mesh position={[0.19, 0.19, 0]} castShadow>
              <boxGeometry args={[0.11, 0.065, 0.06]} />
              <meshStandardMaterial color="#84cc16" roughness={0.6} />
            </mesh>
            {/* Tail */}
            <mesh position={[-0.17, -0.02, 0]} rotation={[0, 0, 1.3]} castShadow>
              <coneGeometry args={[0.045, 0.2, 8]} />
              <meshStandardMaterial color="#4d7c0f" roughness={0.7} />
            </mesh>
            {/* Legs */}
            {[-0.04, 0.04].map((z) => (
              <mesh key={z} position={[0, -0.1, z]} castShadow>
                <cylinderGeometry args={[0.025, 0.028, 0.11, 8]} />
                <meshStandardMaterial color="#4d7c0f" roughness={0.7} />
              </mesh>
            ))}
          </group>
          {/* Fossilized Dinosaur Eggs */}
          {[0.16, 0.24].map((x) => (
            <mesh key={x} position={[x, 0.14, 0.14]} castShadow>
              <sphereGeometry args={[0.042, 12, 12]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.8} />
            </mesh>
          ))}
        </group>
      );

    case 'locomotiveTrain':
      return (
        <group>
          {/* Railway Track Bed & Rails */}
          <mesh position={[0, 0.055, 0]}>
            <boxGeometry args={[0.62, 0.025, 0.24]} />
            <meshStandardMaterial color="#475569" roughness={0.85} />
          </mesh>
          {[-0.06, 0.06].map((z) => (
            <mesh key={z} position={[0, 0.075, z]}>
              <boxGeometry args={[0.6, 0.015, 0.016]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
            </mesh>
          ))}
          {/* Locomotive Boiler & Cab */}
          <mesh position={[-0.04, 0.17, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.28, 16]} />
            <meshStandardMaterial color="#dc2626" roughness={0.35} metalness={0.45} />
          </mesh>
          <mesh position={[0.14, 0.21, 0]} castShadow>
            <boxGeometry args={[0.14, 0.19, 0.17]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.4} />
          </mesh>
          <mesh position={[-0.14, 0.28, 0]}>
            <cylinderGeometry args={[0.028, 0.02, 0.1, 10]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.35} />
          </mesh>
          {/* Wheels */}
          {[-0.14, -0.02, 0.12].map((x) =>
            [-0.075, 0.075].map((z) => (
              <mesh key={`${x}-${z}`} position={[x, 0.11, z]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.042, 0.042, 0.016, 14]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.25} />
              </mesh>
            ))
          )}
        </group>
      );

    case 'portContainerCrane':
      return (
        <group>
          {/* Harbor Water */}
          <mesh position={[0, 0.045, 0.1]}>
            <boxGeometry args={[0.56, 0.025, 0.24]} />
            <meshStandardMaterial color="#0284c7" roughness={0.15} metalness={0.35} />
          </mesh>
          {/* Cargo Ship Hull & Containers */}
          <mesh position={[0.02, 0.1, 0.12]} castShadow>
            <boxGeometry args={[0.42, 0.08, 0.13]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.4} />
          </mesh>
          <mesh position={[-0.05, 0.16, 0.12]} castShadow>
            <boxGeometry args={[0.12, 0.055, 0.09]} />
            <meshStandardMaterial color="#ef4444" roughness={0.55} />
          </mesh>
          <mesh position={[0.09, 0.16, 0.12]} castShadow>
            <boxGeometry args={[0.11, 0.055, 0.09]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.55} />
          </mesh>
          {/* Gantry Crane */}
          <mesh position={[-0.14, 0.24, -0.08]} castShadow>
            <boxGeometry args={[0.04, 0.34, 0.04]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.35} metalness={0.6} />
          </mesh>
          <mesh position={[0.12, 0.24, -0.08]} castShadow>
            <boxGeometry args={[0.04, 0.34, 0.04]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.35} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.4, 0.02]} castShadow>
            <boxGeometry args={[0.34, 0.035, 0.26]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.65} />
          </mesh>
        </group>
      );

    case 'saltAndCotton':
      return (
        <group>
          {/* Salt Pan Base */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.42, 0.44, 0.025, 24]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
          </mesh>
          {/* Kharaghoda Sparkling Salt Pyramids */}
          <mesh position={[-0.14, 0.17, 0.04]} castShadow>
            <coneGeometry args={[0.15, 0.22, 4]} />
            <meshStandardMaterial color="#ffffff" roughness={0.55} />
          </mesh>
          <mesh position={[0.06, 0.14, -0.1]} castShadow>
            <coneGeometry args={[0.12, 0.17, 4]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.55} />
          </mesh>
          {/* Chotila Hill Temple */}
          <mesh position={[0.16, 0.22, 0.06]} castShadow>
            <coneGeometry args={[0.13, 0.28, 7]} />
            <meshStandardMaterial color="#78716c" roughness={0.88} />
          </mesh>
          <mesh position={[0.16, 0.39, 0.06]}>
            <coneGeometry args={[0.04, 0.08, 6]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} />
          </mesh>
          {/* Cotton Boll Cluster */}
          <mesh position={[-0.02, 0.11, 0.18]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
        </group>
      );

    case 'mineralCrystals':
      return (
        <group>
          {/* Layered Bedrock Base */}
          <mesh position={[0, 0.07, 0]} castShadow>
            <cylinderGeometry args={[0.38, 0.43, 0.06, 7]} />
            <meshStandardMaterial color="#475569" roughness={0.88} />
          </mesh>
          {/* Glowing Fluorspar & Dolomite Crystal Cluster */}
          <mesh position={[0, 0.27, 0]} rotation={[0.1, 0.2, -0.12]} castShadow>
            <octahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial
              color="#34d399"
              emissive="#10b981"
              emissiveIntensity={0.45}
              roughness={0.12}
              metalness={0.35}
            />
          </mesh>
          <mesh position={[-0.15, 0.2, 0.09]} rotation={[0.2, 0, 0.35]} castShadow>
            <octahedronGeometry args={[0.1, 0]} />
            <meshStandardMaterial
              color="#67e8f9"
              emissive="#06b6d4"
              emissiveIntensity={0.35}
              roughness={0.12}
              metalness={0.35}
            />
          </mesh>
          <mesh position={[0.15, 0.19, -0.06]} rotation={[-0.2, 0.4, -0.3]} castShadow>
            <octahedronGeometry args={[0.09, 0]} />
            <meshStandardMaterial
              color="#a78bfa"
              emissive="#8b5cf6"
              emissiveIntensity={0.35}
              roughness={0.15}
              metalness={0.35}
            />
          </mesh>
        </group>
      );

    case 'mangoOrchard':
      return (
        <group>
          {/* Orchard Meadow Base */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.42, 0.44, 0.03, 24]} />
            <meshStandardMaterial color="#166534" roughness={0.85} />
          </mesh>
          {/* Mango Tree Trunk & Lush Canopy */}
          <mesh position={[-0.08, 0.16, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.05, 0.2, 10]} />
            <meshStandardMaterial color="#78350f" roughness={0.88} />
          </mesh>
          <mesh position={[-0.08, 0.34, 0]} castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#15803d" roughness={0.82} />
          </mesh>
          {/* Golden Valsadi Alphonso Mangoes */}
          {[
            [-0.17, 0.31, 0.12],
            [0.01, 0.33, 0.13],
            [-0.08, 0.27, -0.14],
          ].map(([x, y, z], idx) => (
            <mesh key={idx} position={[x, y, z]}>
              <sphereGeometry args={[0.042, 12, 12]} />
              <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.25} roughness={0.35} />
            </mesh>
          ))}
          {/* Udvada Sacred Flame Pedestal */}
          <mesh position={[0.2, 0.13, 0.08]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.14, 12]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
          </mesh>
          <mesh position={[0.2, 0.24, 0.08]}>
            <coneGeometry args={[0.035, 0.09, 10]} />
            <meshStandardMaterial color="#fb923c" emissive="#f97316" emissiveIntensity={1.1} />
          </mesh>
        </group>
      );

    case 'palitanaHill':
    case 'pavagadhFort':
    case 'ambajiHills':
    case 'poloForest':
    case 'buddhistStupa':
    case 'kirtiMandir':
    default: {
      const isStupa = dioramaId === 'buddhistStupa';
      const isKirti = dioramaId === 'kirtiMandir';
      const isPolo = dioramaId === 'poloForest';

      if (isStupa) {
        return (
          <group>
            <mesh position={[0, 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.32, 0.36, 0.08, 20]} />
              <meshStandardMaterial color="#b45309" roughness={0.82} />
            </mesh>
            <mesh position={[0, 0.14, 0]} castShadow>
              <sphereGeometry args={[0.24, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#d97706" roughness={0.78} />
            </mesh>
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[0.09, 0.06, 0.09]} />
              <meshStandardMaterial color="#fde68a" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.49, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.14, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.25} />
            </mesh>
          </group>
        );
      }

      if (isKirti) {
        return (
          <group>
            <mesh position={[0, 0.12, 0]} castShadow>
              <boxGeometry args={[0.46, 0.14, 0.34]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.74} />
            </mesh>
            <mesh position={[0, 0.29, 0]} castShadow>
              <boxGeometry args={[0.24, 0.22, 0.22]} />
              <meshStandardMaterial color="#fde68a" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.48, 0]} castShadow>
              <coneGeometry args={[0.12, 0.18, 4]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.55} />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.025, 10, 10]} />
              <meshStandardMaterial color="#fde047" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        );
      }

      if (isPolo) {
        return (
          <group>
            {/* Stone Toran Gate & Emerald Forest */}
            {[-0.12, 0.12].map((x) => (
              <mesh key={x} position={[x, 0.2, 0]} castShadow>
                <boxGeometry args={[0.055, 0.28, 0.055]} />
                <meshStandardMaterial color="#d97706" roughness={0.78} />
              </mesh>
            ))}
            <mesh position={[0, 0.36, 0]} castShadow>
              <boxGeometry args={[0.34, 0.06, 0.08]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.72} />
            </mesh>
            {[
              [-0.24, 0.18, -0.1],
              [0.24, 0.2, -0.08],
              [0.2, 0.16, 0.14],
            ].map(([x, y, z], i) => (
              <mesh key={i} position={[x, y, z]} castShadow>
                <coneGeometry args={[0.09, 0.22, 7]} />
                <meshStandardMaterial color="#15803d" roughness={0.85} />
              </mesh>
            ))}
          </group>
        );
      }

      // Sacred Hill + Temple Cluster (Palitana / Pavagadh / Ambaji)
      return (
        <group>
          <mesh position={[0, 0.18, 0]} castShadow>
            <coneGeometry args={[0.34, 0.28, 7]} />
            <meshStandardMaterial
              color={dioramaId === 'ambajiHills' ? '#166534' : '#78716c'}
              roughness={0.86}
            />
          </mesh>
          <mesh position={[0, 0.36, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.11, 0.14, 8]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.49, 0]} castShadow>
            <coneGeometry args={[0.08, 0.14, 8]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.45} />
          </mesh>
          {[-0.14, 0.14].map((x) => (
            <mesh key={x} position={[x, 0.28, 0.08]} castShadow>
              <coneGeometry args={[0.055, 0.12, 6]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.55} />
            </mesh>
          ))}
        </group>
      );
    }
  }
};

export const DistrictSpecialtyDiorama: React.FC<Props> = ({
  districtId,
  language,
  scale,
  positionY,
  centroidXZ,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const spinnerRef = useRef<THREE.Group>(null);
  const secondaryMotionRef = useRef<THREE.Group>(null);
  const ringMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const meta = DISTRICT_SPECIALTIES[districtId] ?? DISTRICT_SPECIALTIES.ahmedabad;

  const plaqueTexture = useMemo(() => {
    return createSpecialtyPlaqueTexture(meta.title[language], meta.accentColor);
  }, [meta, language]);

  useEffect(() => {
    return () => {
      plaqueTexture.dispose();
    };
  }, [plaqueTexture]);

  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.scale.setScalar(0.05);
    }
  }, [districtId]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (rootRef.current) {
      const s = THREE.MathUtils.damp(rootRef.current.scale.x, scale, 9.0, delta);
      rootRef.current.scale.setScalar(s);
    }
    if (spinnerRef.current) {
      if (meta.dioramaId === 'ashramCharkha' || meta.dioramaId === 'sunTemple') {
        spinnerRef.current.rotation.z -= delta * 1.4;
      } else if (meta.dioramaId === 'engineeringGear') {
        spinnerRef.current.rotation.y += delta * 1.25;
      } else if (
        meta.dioramaId === 'diamondBourse' ||
        meta.dioramaId === 'dairyRevolution'
      ) {
        spinnerRef.current.rotation.y += delta * 0.9;
        spinnerRef.current.position.y =
          (meta.dioramaId === 'diamondBourse' ? 0.5 : 0.56) + Math.sin(t * 2.2) * 0.03;
      } else {
        spinnerRef.current.rotation.y = Math.sin(t * 2.4) * 0.14;
      }
    }
    if (secondaryMotionRef.current) {
      if (meta.dioramaId === 'girnarRopeway') {
        const wave = Math.sin(t * 1.1) * 0.11;
        secondaryMotionRef.current.position.x = 0.07 + wave * 0.85;
        secondaryMotionRef.current.position.y = 0.34 - wave * 0.72;
        secondaryMotionRef.current.position.z = 0.05 + wave * 0.45;
      } else if (meta.dioramaId === 'engineeringGear') {
        secondaryMotionRef.current.rotation.y -= delta * 1.85;
      }
    }
    if (ringMatRef.current) {
      ringMatRef.current.emissiveIntensity = 0.85 + Math.sin(t * 3.0) * 0.25;
    }
  });

  return (
    <group
      ref={rootRef}
      position={[centroidXZ[0], positionY, centroidXZ[1]]}
    >
      {/* Grounded showcase pedestal sitting flush at local y = 0 */}
      <mesh position={[0, 0.025, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.45, 0.48, 0.05, 28]} />
        <meshStandardMaterial color="#0f172a" roughness={0.45} metalness={0.65} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.016, 10, 36]} />
        <meshStandardMaterial
          ref={ringMatRef}
          color={meta.accentColor}
          emissive={meta.accentColor}
          emissiveIntensity={0.95}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* District-specific 3D composite landmark */}
      <DioramaModel
        dioramaId={meta.dioramaId}
        accentColor={meta.accentColor}
        spinnerRef={spinnerRef}
        secondaryMotionRef={secondaryMotionRef}
      />

      {/* Crisp 3D Gujarati Specialty Plaque floating above the 3D landmark */}
      <sprite position={[0, 0.94, 0]} scale={[1.25, 0.24, 1]} renderOrder={13}>
        <spriteMaterial map={plaqueTexture} transparent depthTest={false} />
      </sprite>
    </group>
  );
};
