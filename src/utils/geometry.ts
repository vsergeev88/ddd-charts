import { ExtrudeGeometry, Shape, Path } from 'three'

export interface PieSliceGeometryOptions {
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  depth: number
  bevelSize?: number
}

export function createPieSliceGeometry(options: PieSliceGeometryOptions): ExtrudeGeometry {
  const { innerRadius, outerRadius, startAngle, endAngle, depth, bevelSize = 0.02 } = options

  const shape = new Shape()
  if (innerRadius > 0) {
    shape.absarc(0, 0, outerRadius, startAngle, endAngle, false)
    const hole = new Path()
    hole.absarc(0, 0, innerRadius, endAngle, startAngle, true)
    shape.lineTo(Math.cos(endAngle) * innerRadius, Math.sin(endAngle) * innerRadius)
    const points = hole.getPoints(32)
    for (const p of points) shape.lineTo(p.x, p.y)
    shape.closePath()
  } else {
    shape.moveTo(0, 0)
    shape.absarc(0, 0, outerRadius, startAngle, endAngle, false)
    shape.lineTo(0, 0)
    shape.closePath()
  }

  const bevelEnabled = bevelSize > 0
  const geometry = new ExtrudeGeometry(shape, {
    depth: bevelEnabled ? Math.max(depth - bevelSize * 2, 0.01) : depth,
    curveSegments: 48,
    bevelEnabled,
    bevelSize,
    bevelThickness: bevelSize,
    bevelSegments: 3
  })

  geometry.rotateX(-Math.PI / 2)
  if (bevelEnabled) geometry.translate(0, bevelSize, 0)
  geometry.computeVertexNormals()
  return geometry
}
