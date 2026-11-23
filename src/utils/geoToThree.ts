import * as THREE from 'three';
import { GUJARAT_GEOJSON, GujaratGeoFeature } from '../data/gujaratGeoJson';

export const GUJARAT_CENTER_LON = 71.285;
export const GUJARAT_CENTER_LAT = 22.416;
export const LAT_COS_FACTOR = Math.cos((GUJARAT_CENTER_LAT * Math.PI) / 180);
export const MAP_SCALE = 2.25;

export function lonLatToMapXY(lon: number, lat: number): [number, number] {
  const x = (lon - GUJARAT_CENTER_LON) * LAT_COS_FACTOR * MAP_SCALE;
  const y = (lat - GUJARAT_CENTER_LAT) * MAP_SCALE;
  return [x, y];
}

// In world space after rotateX(-Math.PI / 2): worldX = mapX, worldZ = -mapY
export function lonLatToWorldXZ(lon: number, lat: number): [number, number] {
  const [mx, my] = lonLatToMapXY(lon, lat);
  return [mx, -my];
}

export interface BuiltDistrictGeometry {
  id: string;
  extrudeGeometry: THREE.BufferGeometry;
  borderGeometry: THREE.BufferGeometry;
  centroidXZ: [number, number];
  explodeDirXZ: [number, number];
  areaApprox: number;
}

function ringArea(pts: [number, number][]): number {
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) * 0.5;
}

function ringCentroid(pts: [number, number][]): [number, number] {
  let cx = 0;
  let cy = 0;
  let signedArea = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % pts.length];
    const a = x0 * y1 - x1 * y0;
    signedArea += a;
    cx += (x0 + x1) * a;
    cy += (y0 + y1) * a;
  }
  if (Math.abs(signedArea) < 1e-6) {
    const avgX = pts.reduce((acc, p) => acc + p[0], 0) / Math.max(1, pts.length);
    const avgY = pts.reduce((acc, p) => acc + p[1], 0) / Math.max(1, pts.length);
    return [avgX, avgY];
  }
  signedArea *= 0.5;
  return [cx / (6 * signedArea), cy / (6 * signedArea)];
}

function buildRingPath(ring: number[][]): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < ring.length; i++) {
    const [x, y] = lonLatToMapXY(ring[i][0], ring[i][1]);
    if (
      pts.length === 0 ||
      Math.hypot(x - pts[pts.length - 1][0], y - pts[pts.length - 1][1]) > 0.002
    ) {
      pts.push([x, y]);
    }
  }
  return pts;
}

export function buildAllDistrictGeometries(
  depthMap: Record<string, number>
): Record<string, BuiltDistrictGeometry> {
  const result: Record<string, BuiltDistrictGeometry> = {};

  for (const feature of GUJARAT_GEOJSON.features) {
    const built = buildSingleDistrictGeometry(feature, depthMap[feature.properties.id] ?? 0.34);
    result[feature.properties.id] = built;
  }

  return result;
}

function buildSingleDistrictGeometry(
  feature: GujaratGeoFeature,
  depth: number
): BuiltDistrictGeometry {
  const shapes: THREE.Shape[] = [];
  const borderPositions: number[] = [];
  const borderProgress: number[] = [];

  const polygons: number[][][][] =
    feature.geometry.type === 'Polygon'
      ? [feature.geometry.coordinates as number[][][]]
      : (feature.geometry.coordinates as number[][][][]);

  let largestArea = -1;
  let bestCentroidXY: [number, number] = [0, 0];
  let totalArea = 0;

  for (const poly of polygons) {
    if (!poly || poly.length === 0) continue;
    const outerPts = buildRingPath(poly[0]);
    if (outerPts.length < 3) continue;

    const area = ringArea(outerPts);
    totalArea += area;
    if (area > largestArea) {
      largestArea = area;
      bestCentroidXY = ringCentroid(outerPts);
    }

    const shape = new THREE.Shape();
    shape.moveTo(outerPts[0][0], outerPts[0][1]);
    for (let i = 1; i < outerPts.length; i++) {
      shape.lineTo(outerPts[i][0], outerPts[i][1]);
    }
    shape.closePath();

    // Holes if any
    for (let h = 1; h < poly.length; h++) {
      const holePts = buildRingPath(poly[h]);
      if (holePts.length >= 3) {
        const holePath = new THREE.Path();
        holePath.moveTo(holePts[0][0], holePts[0][1]);
        for (let i = 1; i < holePts.length; i++) {
          holePath.lineTo(holePts[i][0], holePts[i][1]);
        }
        holePath.closePath();
        shape.holes.push(holePath);
      }
    }

    shapes.push(shape);

    // Build perimeter line segments along top of extruded mesh (world XZ: x, y = depth + 0.028, z = -y)
    let totalPerimeter = 0;
    const segLengths: number[] = [];
    for (let i = 0; i < outerPts.length; i++) {
      const p1 = outerPts[i];
      const p2 = outerPts[(i + 1) % outerPts.length];
      const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      segLengths.push(len);
      totalPerimeter += len;
    }

    let accum = 0;
    const yTop = depth + 0.032;
    for (let i = 0; i < outerPts.length; i++) {
      const p1 = outerPts[i];
      const p2 = outerPts[(i + 1) % outerPts.length];
      const t0 = totalPerimeter > 0 ? accum / totalPerimeter : 0;
      accum += segLengths[i];
      const t1 = totalPerimeter > 0 ? accum / totalPerimeter : 1;

      borderPositions.push(p1[0], yTop, -p1[1], p2[0], yTop, -p2[1]);
      borderProgress.push(t0, t1);
    }
  }

  const extrudeGeometry = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.018,
    bevelSegments: 2,
    curveSegments: 4,
  });

  // Rotate so XY shape maps to XZ ground plane and extrusion grows along +Y
  extrudeGeometry.rotateX(-Math.PI / 2);
  extrudeGeometry.computeVertexNormals();
  extrudeGeometry.computeBoundingBox();
  extrudeGeometry.computeBoundingSphere();

  const borderGeometry = new THREE.BufferGeometry();
  borderGeometry.setAttribute('position', new THREE.Float32BufferAttribute(borderPositions, 3));
  borderGeometry.setAttribute('aProgress', new THREE.Float32BufferAttribute(borderProgress, 1));
  borderGeometry.computeBoundingSphere();

  const cx = bestCentroidXY[0];
  const cz = -bestCentroidXY[1];
  const dist = Math.hypot(cx, cz) || 1;

  return {
    id: feature.properties.id,
    extrudeGeometry,
    borderGeometry,
    centroidXZ: [cx, cz],
    explodeDirXZ: [cx / dist, cz / dist],
    areaApprox: totalArea,
  };
}

// Procedural subtle topographic terrain texture (zero external image files)
export function createTerrainTextures(maxAnisotropy = 4): {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const size = 256;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const ctx = colorCanvas.getContext('2d')!;

  ctx.fillStyle = '#d9e3ef';
  ctx.fillRect(0, 0, size, size);

  // Subtle topographic grid & contour lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1;
  for (let i = 0; i < size; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  // Soft mineral grain
  for (let i = 0; i < 1600; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const alpha = 0.03 + Math.random() * 0.05;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(15,23,42,${alpha})`;
    ctx.fillRect(x, y, 2, 2);
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(0.35, 0.35);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = maxAnisotropy;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;
  rCtx.fillStyle = '#999999';
  rCtx.fillRect(0, 0, size, size);
  for (let i = 0; i < 1200; i++) {
    const v = 120 + Math.floor(Math.random() * 75);
    rCtx.fillStyle = `rgb(${v},${v},${v})`;
    rCtx.fillRect(Math.random() * size, Math.random() * size, 3, 3);
  }

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(0.35, 0.35);
  roughnessMap.anisotropy = maxAnisotropy;

  return { map, roughnessMap };
}

// High-DPI Gujarati & English label texture for 3D sprites (captured cleanly in WebM & PNG exports!)
export function createDistrictLabelTexture(
  nameGu: string,
  nameEn: string,
  accentColor: string,
  highlighted: boolean
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 112;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Pill-free clean dark architectural plate
  const r = 10;
  const pad = 8;
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

  ctx.fillStyle = highlighted ? 'rgba(10, 18, 38, 0.94)' : 'rgba(6, 11, 22, 0.84)';
  ctx.fill();

  ctx.lineWidth = highlighted ? 3 : 1.5;
  ctx.strokeStyle = highlighted ? accentColor : 'rgba(56, 189, 248, 0.42)';
  ctx.stroke();

  // Gujarati Name
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 32px "Noto Sans Gujarati", "Outfit", sans-serif';
  ctx.fillStyle = highlighted ? '#FEF08A' : '#F8FAFC';
  ctx.fillText(nameGu, canvas.width / 2, 42);

  // English sub-label
  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = highlighted ? '#FDE047' : '#94A3B8';
  ctx.fillText(nameEn, canvas.width / 2, 78);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
