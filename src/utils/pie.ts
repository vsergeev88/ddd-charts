import type { ChartDatum } from '../types'

export interface PieSegment {
  index: number
  value: number
  fraction: number
  startAngle: number
  endAngle: number
  midAngle: number
}

export interface ComputePieSegmentsOptions {
  startAngle?: number
  padAngle?: number
}

export function computePieSegments(
  data: ChartDatum[],
  options: ComputePieSegmentsOptions = {}
): PieSegment[] {
  const { startAngle = Math.PI / 2, padAngle = 0.02 } = options
  const values = data.map((d) => Math.max(0, d.value))
  const total = values.reduce((sum, v) => sum + v, 0)
  if (total <= 0) return []

  const visibleCount = values.filter((v) => v > 0).length
  const pad = visibleCount > 1 ? padAngle : 0
  const available = Math.PI * 2 - pad * visibleCount

  let cursor = startAngle
  return values.map((value, index) => {
    const fraction = value / total
    const sweep = fraction * available
    const segStart = cursor
    const segEnd = cursor + sweep
    if (value > 0) cursor = segEnd + pad
    return {
      index,
      value,
      fraction,
      startAngle: segStart,
      endAngle: segEnd,
      midAngle: (segStart + segEnd) / 2
    }
  })
}
