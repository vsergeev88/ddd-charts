import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { useCursor } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { Group } from 'three'
import type { ChartDatum, PieChart3DProps, Vec3 } from '../types'
import { getPaletteColor } from '../utils/colors'
import { createPieSliceGeometry } from '../utils/geometry'
import { computePieSegments, type PieSegment } from '../utils/pie'
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

interface PieSliceProps {
  datum: ChartDatum
  segment: PieSegment
  materials: PieChart3DProps['materials']
  innerRadius: number
  outerRadius: number
  height: number
  bevelSize: number
  animation: ResolvedAnimation
  hover: ResolvedHover
  tooltip: ResolvedTooltip
  highlighted: boolean
  castShadow: boolean
  receiveShadow: boolean
  onItemClick?: PieChart3DProps['onItemClick']
  onItemPointerOver?: PieChart3DProps['onItemPointerOver']
  onItemPointerOut?: PieChart3DProps['onItemPointerOut']
}

function PieSlice({
  datum,
  segment,
  materials,
  innerRadius,
  outerRadius,
  height,
  bevelSize,
  animation,
  hover,
  tooltip,
  highlighted,
  castShadow,
  receiveShadow,
  onItemClick,
  onItemPointerOver,
  onItemPointerOut
}: PieSliceProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const active = hovered || highlighted
  useCursor(hovered && Boolean(onItemClick))

  const geometry = useMemo(
    () =>
      createPieSliceGeometry({
        innerRadius,
        outerRadius,
        startAngle: segment.startAngle,
        endAngle: segment.endAngle,
        depth: height,
        bevelSize
      }),
    [innerRadius, outerRadius, segment.startAngle, segment.endAngle, height, bevelSize]
  )

  useEffect(() => () => geometry.dispose(), [geometry])

  const material = useMemo(
    () =>
      resolveMaterialConfig(materials, datum, segment.index, getPaletteColor(segment.index)),
    [materials, datum, segment.index]
  )

  const direction = useMemo(
    () => [Math.cos(segment.midAngle), 0, -Math.sin(segment.midAngle)] as const,
    [segment.midAngle]
  )

  const tooltipPosition = useMemo<Vec3>(() => {
    const midRadius = (innerRadius + outerRadius) / 2
    return [
      direction[0] * midRadius + tooltip.offset[0],
      height + tooltip.offset[1],
      direction[2] * midRadius + tooltip.offset[2]
    ]
  }, [direction, innerRadius, outerRadius, height, tooltip.offset])

  useChartItemAnimation(segment.index, animation, hover, active, (entrance, hoverAmount) => {
    const group = groupRef.current
    if (!group) return
    group.scale.setScalar(entrance)
    const offset = hover.explode * hoverAmount
    group.position.set(direction[0] * offset, 0, direction[2] * offset)
  })

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    setHovered(true)
    onItemPointerOver?.(datum, segment.index)
  }

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    setHovered(false)
    onItemPointerOut?.(datum, segment.index)
  }

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onItemClick?.(datum, segment.index)
  }

  return (
    <group ref={groupRef} scale={animation.enabled ? 0.0001 : 1}>
      <mesh
        geometry={geometry}
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
      </mesh>
      {active && tooltip.enabled && (
        <ChartTooltip
          datum={datum}
          index={segment.index}
          fraction={segment.fraction}
          color={material.color}
          position={tooltipPosition}
          config={tooltip}
        />
      )}
    </group>
  )
}

export const PieChart3D = memo(function PieChart3D({
  data,
  materials,
  innerRadius = 0,
  outerRadius = 2,
  height = 0.6,
  padAngle = 0.02,
  startAngle = Math.PI / 2,
  bevelSize = 0.02,
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
}: PieChart3DProps) {
  const segments = useMemo(
    () => computePieSegments(data, { startAngle, padAngle }),
    [data, startAngle, padAngle]
  )
  const resolvedAnimation = useMemo(() => resolveAnimation(animation), [animation])
  const resolvedHover = useMemo(() => resolveHover(hover), [hover])
  const resolvedTooltip = useMemo(() => resolveTooltip(tooltip), [tooltip])

  return (
    <group position={position} rotation={rotation}>
      {segments.map(
        (segment) =>
          segment.value > 0 && (
            <PieSlice
              key={data[segment.index].id ?? segment.index}
              datum={data[segment.index]}
              segment={segment}
              materials={materials}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              height={height}
              bevelSize={bevelSize}
              animation={resolvedAnimation}
              hover={resolvedHover}
              tooltip={resolvedTooltip}
              highlighted={highlightedIndex === segment.index}
              castShadow={castShadow}
              receiveShadow={receiveShadow}
              onItemClick={onItemClick}
              onItemPointerOver={onItemPointerOver}
              onItemPointerOut={onItemPointerOut}
            />
          )
      )}
    </group>
  )
})
