import { memo, useMemo, useRef, useState } from 'react'
import { RoundedBox, useCursor } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { Group } from 'three'
import type { BarChart3DProps, ChartDatum, Vec3 } from '../types'
import { getPaletteColor } from '../utils/colors'
import {
  resolveAnimation,
  resolveHover,
  resolveTooltip,
  type ResolvedAnimation,
  type ResolvedHover,
  type ResolvedTooltip
} from '../utils/normalize'
import { useChartItemAnimation } from '../hooks/useChartItemAnimation'
import { ChartMaterial } from './materials/ChartMaterial'
import { resolveMaterialConfig } from './materials/resolveMaterial'
import { ChartTooltip } from './ChartTooltip'

interface BarProps {
  datum: ChartDatum
  index: number
  x: number
  barHeight: number
  barWidth: number
  barDepth: number
  radius: number
  fraction: number
  materials: BarChart3DProps['materials']
  animation: ResolvedAnimation
  hover: ResolvedHover
  tooltip: ResolvedTooltip
  highlighted: boolean
  castShadow: boolean
  receiveShadow: boolean
  onItemClick?: BarChart3DProps['onItemClick']
  onItemPointerOver?: BarChart3DProps['onItemPointerOver']
  onItemPointerOut?: BarChart3DProps['onItemPointerOut']
}

function Bar({
  datum,
  index,
  x,
  barHeight,
  barWidth,
  barDepth,
  radius,
  fraction,
  materials,
  animation,
  hover,
  tooltip,
  highlighted,
  castShadow,
  receiveShadow,
  onItemClick,
  onItemPointerOver,
  onItemPointerOut
}: BarProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const active = hovered || highlighted
  useCursor(hovered && Boolean(onItemClick))

  const material = useMemo(
    () => resolveMaterialConfig(materials, datum, index, getPaletteColor(index)),
    [materials, datum, index]
  )

  const tooltipPosition = useMemo<Vec3>(
    () => [tooltip.offset[0], barHeight + tooltip.offset[1], tooltip.offset[2]],
    [barHeight, tooltip.offset]
  )

  useChartItemAnimation(index, animation, hover, active, (entrance, hoverAmount) => {
    const group = groupRef.current
    if (!group) return
    const hoverScale = 1 + (hover.scale - 1) * hoverAmount
    group.scale.set(hoverScale, entrance * hoverScale, hoverScale)
  })

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    setHovered(true)
    onItemPointerOver?.(datum, index)
  }

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    setHovered(false)
    onItemPointerOut?.(datum, index)
  }

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onItemClick?.(datum, index)
  }

  return (
    <group ref={groupRef} position={[x, 0, 0]} scale={animation.enabled ? 0.0001 : 1}>
      <RoundedBox
        args={[barWidth, barHeight, barDepth]}
        radius={radius}
        smoothness={4}
        position={[0, barHeight / 2, 0]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <ChartMaterial
          config={material}
          hovered={active && hover.enabled}
          hoverEmissive={hover.emissive}
          hoverEmissiveIntensity={hover.emissiveIntensity}
        />
      </RoundedBox>
      {active && tooltip.enabled && (
        <ChartTooltip
          datum={datum}
          index={index}
          fraction={fraction}
          color={material.color}
          position={tooltipPosition}
          config={tooltip}
        />
      )}
    </group>
  )
}

export const BarChart3D = memo(function BarChart3D({
  data,
  materials,
  barWidth = 0.6,
  barDepth = 0.6,
  gap = 0.35,
  maxBarHeight = 3,
  maxValue,
  radius = 0.06,
  animation,
  hover,
  tooltip,
  highlightedIndex = null,
  position,
  rotation,
  castShadow = true,
  receiveShadow = true,
  onItemClick,
  onItemPointerOver,
  onItemPointerOut
}: BarChart3DProps) {
  const resolvedAnimation = useMemo(() => resolveAnimation(animation), [animation])
  const resolvedHover = useMemo(() => resolveHover(hover), [hover])
  const resolvedTooltip = useMemo(() => resolveTooltip(tooltip), [tooltip])

  const layout = useMemo(() => {
    const peak = maxValue ?? Math.max(...data.map((d) => d.value), 0)
    const total = data.reduce((sum, d) => sum + Math.max(0, d.value), 0)
    const totalWidth = data.length * barWidth + Math.max(data.length - 1, 0) * gap
    return data.map((datum, index) => ({
      x: -totalWidth / 2 + barWidth / 2 + index * (barWidth + gap),
      barHeight: peak > 0 ? Math.max((datum.value / peak) * maxBarHeight, 0.001) : 0.001,
      fraction: total > 0 ? Math.max(0, datum.value) / total : 0
    }))
  }, [data, barWidth, gap, maxBarHeight, maxValue])

  return (
    <group position={position} rotation={rotation}>
      {data.map((datum, index) => (
        <Bar
          key={datum.id ?? index}
          datum={datum}
          index={index}
          x={layout[index].x}
          barHeight={layout[index].barHeight}
          barWidth={barWidth}
          barDepth={barDepth}
          radius={Math.min(radius, barWidth / 2, barDepth / 2, layout[index].barHeight / 2)}
          fraction={layout[index].fraction}
          materials={materials}
          animation={resolvedAnimation}
          hover={resolvedHover}
          tooltip={resolvedTooltip}
          highlighted={highlightedIndex === index}
          castShadow={castShadow}
          receiveShadow={receiveShadow}
          onItemClick={onItemClick}
          onItemPointerOver={onItemPointerOver}
          onItemPointerOut={onItemPointerOut}
        />
      ))}
    </group>
  )
})
