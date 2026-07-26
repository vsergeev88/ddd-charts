import { describe, expect, it } from 'vitest'
import ReactThreeTestRenderer from '@react-three/test-renderer'
import { PieChart3D } from '../components/PieChart3D'
import { BarChart3D } from '../components/BarChart3D'

const data = [
  { label: 'Alpha', value: 40 },
  { label: 'Beta', value: 25 },
  { label: 'Gamma', value: 35 }
]

describe('PieChart3D', () => {
  it('renders one mesh per data segment', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <PieChart3D data={data} animation={false} />
    )
    const meshes = renderer.scene.findAllByType('Mesh')
    expect(meshes).toHaveLength(3)
    await renderer.unmount()
  })

  it('skips zero-value segments', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <PieChart3D data={[...data, { label: 'Empty', value: 0 }]} animation={false} />
    )
    const meshes = renderer.scene.findAllByType('Mesh')
    expect(meshes).toHaveLength(3)
    await renderer.unmount()
  })

  it('applies glass material configuration to meshes', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <PieChart3D data={data} animation={false} materials={{ glassEffect: true, ior: 1.3 }} />
    )
    const mesh = renderer.scene.findAllByType('Mesh')[0]
    const material = (mesh.instance as unknown as { material: { transmission: number; ior: number } })
      .material
    expect(material.transmission).toBe(1)
    expect(material.ior).toBe(1.3)
    await renderer.unmount()
  })
})

describe('BarChart3D', () => {
  it('renders one bar per datum with proportional heights', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <BarChart3D data={data} animation={false} maxBarHeight={4} />
    )
    const meshes = renderer.scene.findAllByType('Mesh')
    expect(meshes).toHaveLength(3)
    await renderer.unmount()
  })

  it('honors per-datum colors', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <BarChart3D
        data={[{ label: 'Solo', value: 10, color: '#ff0000' }]}
        animation={false}
      />
    )
    const mesh = renderer.scene.findAllByType('Mesh')[0]
    const material = (
      mesh.instance as unknown as { material: { color: { getHexString: () => string } } }
    ).material
    expect(material.color.getHexString()).toBe('ff0000')
    await renderer.unmount()
  })
})
