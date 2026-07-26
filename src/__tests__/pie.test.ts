import { describe, expect, it } from 'vitest'
import { computePieSegments } from '../utils/pie'

describe('computePieSegments', () => {
  it('splits the full circle proportionally to values', () => {
    const segments = computePieSegments(
      [
        { label: 'a', value: 1 },
        { label: 'b', value: 1 },
        { label: 'c', value: 2 }
      ],
      { padAngle: 0 }
    )

    expect(segments).toHaveLength(3)
    expect(segments[0].fraction).toBeCloseTo(0.25)
    expect(segments[2].fraction).toBeCloseTo(0.5)

    const totalSweep = segments.reduce((sum, s) => sum + (s.endAngle - s.startAngle), 0)
    expect(totalSweep).toBeCloseTo(Math.PI * 2)
  })

  it('reserves pad angle between visible segments', () => {
    const padAngle = 0.1
    const segments = computePieSegments(
      [
        { label: 'a', value: 1 },
        { label: 'b', value: 1 }
      ],
      { padAngle }
    )

    const totalSweep = segments.reduce((sum, s) => sum + (s.endAngle - s.startAngle), 0)
    expect(totalSweep).toBeCloseTo(Math.PI * 2 - padAngle * 2)
    expect(segments[1].startAngle - segments[0].endAngle).toBeCloseTo(padAngle)
  })

  it('returns empty array when total is zero', () => {
    expect(computePieSegments([{ label: 'a', value: 0 }])).toEqual([])
    expect(computePieSegments([])).toEqual([])
  })

  it('ignores negative values', () => {
    const segments = computePieSegments(
      [
        { label: 'a', value: -5 },
        { label: 'b', value: 10 }
      ],
      { padAngle: 0.05 }
    )
    expect(segments[0].fraction).toBe(0)
    expect(segments[1].endAngle - segments[1].startAngle).toBeCloseTo(Math.PI * 2)
  })
})
