import { memo } from 'react'
import type { ResolvedMaterialConfig } from '../../types'

export interface ChartMaterialProps {
  config: ResolvedMaterialConfig
  hovered?: boolean
  hoverEmissive?: string
  hoverEmissiveIntensity?: number
}

export const ChartMaterial = memo(function ChartMaterial({
  config,
  hovered = false,
  hoverEmissive,
  hoverEmissiveIntensity = 0.25
}: ChartMaterialProps) {
  const emissive = hovered ? hoverEmissive ?? config.color : config.emissive
  const emissiveIntensity = hovered
    ? Math.max(config.emissiveIntensity, hoverEmissiveIntensity)
    : config.emissiveIntensity

  return (
    <meshPhysicalMaterial
      color={config.color}
      metalness={config.metallic}
      roughness={config.roughness}
      transmission={config.transmission}
      thickness={config.thickness}
      ior={config.ior}
      opacity={config.opacity}
      transparent={config.glassEffect || config.opacity < 1}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      clearcoat={config.clearcoat}
      clearcoatRoughness={config.clearcoatRoughness}
      envMapIntensity={config.envMapIntensity}
      flatShading={config.flatShading}
    />
  )
})
