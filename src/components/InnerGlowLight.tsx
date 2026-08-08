import { memo } from 'react'
import type { InnerGlowConfig, Vec3 } from '../types'

export interface InnerGlowLightProps {
  glow: InnerGlowConfig
  position: Vec3
  distance: number
}

export const InnerGlowLight = memo(function InnerGlowLight({
  glow,
  position,
  distance
}: InnerGlowLightProps) {
  if (glow.intensity <= 0) return null

  return (
    <pointLight
      color={glow.color}
      intensity={glow.intensity * 1.75}
      distance={distance}
      decay={2}
      position={position}
    />
  )
})
