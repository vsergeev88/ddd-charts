import { describe, expect, it } from 'vitest'
import { resolveMaterialConfig, DEFAULT_MATERIAL } from '../components/materials/resolveMaterial'
import type { ChartDatum } from '../types'

const datum: ChartDatum = { label: 'sales', value: 42 }

describe('resolveMaterialConfig', () => {
  it('falls back to defaults and the palette color', () => {
    const config = resolveMaterialConfig(undefined, datum, 0, '#ff0000')
    expect(config.color).toBe('#ff0000')
    expect(config.metallic).toBe(DEFAULT_MATERIAL.metallic)
    expect(config.glassEffect).toBe(false)
    expect(config.transmission).toBe(0)
  })

  it('applies glass defaults when glassEffect is enabled', () => {
    const config = resolveMaterialConfig({ glassEffect: true }, datum, 0, '#ff0000')
    expect(config.transmission).toBe(1)
    expect(config.roughness).toBeLessThan(0.1)
    expect(config.ior).toBe(1.5)
  })

  it('picks per-index material from an array', () => {
    const config = resolveMaterialConfig(
      [{ metallic: 0.9 }, { metallic: 0.1 }],
      datum,
      1,
      '#ff0000'
    )
    expect(config.metallic).toBe(0.1)
  })

  it('supports a resolver function', () => {
    const config = resolveMaterialConfig(
      (d, index) => ({ roughness: d.value > 10 ? 0.7 : 0.1, metallic: index }),
      datum,
      2,
      '#ff0000'
    )
    expect(config.roughness).toBe(0.7)
    expect(config.metallic).toBe(2)
  })

  it('prefers datum-level material and color over shared config', () => {
    const config = resolveMaterialConfig(
      { metallic: 0.2, color: '#111111' },
      { ...datum, color: '#00ff00', material: { metallic: 0.95 } },
      0,
      '#ff0000'
    )
    expect(config.color).toBe('#00ff00')
    expect(config.metallic).toBe(0.95)
  })
})
