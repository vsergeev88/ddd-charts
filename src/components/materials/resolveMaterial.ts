import type {
  ChartDatum,
  MaterialConfig,
  MaterialsProp,
  ResolvedMaterialConfig
} from '../../types'

export const DEFAULT_MATERIAL: ResolvedMaterialConfig = {
  color: '#6366f1',
  metallic: 0.1,
  roughness: 0.35,
  glassEffect: false,
  transmission: 0,
  thickness: 0.5,
  ior: 1.5,
  opacity: 1,
  emissive: '#000000',
  emissiveIntensity: 0,
  clearcoat: 0,
  clearcoatRoughness: 0.1,
  envMapIntensity: 1,
  flatShading: false
}

function pickChartMaterial(
  materials: MaterialsProp | undefined,
  datum: ChartDatum,
  index: number
): MaterialConfig {
  if (!materials) return {}
  if (typeof materials === 'function') return materials(datum, index)
  if (Array.isArray(materials)) return materials[index % materials.length] ?? {}
  return materials
}

export function resolveMaterialConfig(
  materials: MaterialsProp | undefined,
  datum: ChartDatum,
  index: number,
  fallbackColor: string
): ResolvedMaterialConfig {
  const shared = pickChartMaterial(materials, datum, index)
  const merged: MaterialConfig = { ...shared, ...datum.material }
  const glassEffect = merged.glassEffect ?? false

  return {
    color: datum.color ?? merged.color ?? fallbackColor,
    metallic: merged.metallic ?? DEFAULT_MATERIAL.metallic,
    roughness: merged.roughness ?? (glassEffect ? 0.05 : DEFAULT_MATERIAL.roughness),
    glassEffect,
    transmission: merged.transmission ?? (glassEffect ? 1 : DEFAULT_MATERIAL.transmission),
    thickness: merged.thickness ?? DEFAULT_MATERIAL.thickness,
    ior: merged.ior ?? DEFAULT_MATERIAL.ior,
    opacity: merged.opacity ?? DEFAULT_MATERIAL.opacity,
    emissive: merged.emissive ?? DEFAULT_MATERIAL.emissive,
    emissiveIntensity: merged.emissiveIntensity ?? DEFAULT_MATERIAL.emissiveIntensity,
    clearcoat: merged.clearcoat ?? DEFAULT_MATERIAL.clearcoat,
    clearcoatRoughness: merged.clearcoatRoughness ?? DEFAULT_MATERIAL.clearcoatRoughness,
    envMapIntensity: merged.envMapIntensity ?? (glassEffect ? 1.5 : DEFAULT_MATERIAL.envMapIntensity),
    flatShading: merged.flatShading ?? DEFAULT_MATERIAL.flatShading
  }
}
