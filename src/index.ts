export { ChartViewer, ChartStage } from './components/ChartViewer'
export type { ChartStageProps } from './components/ChartViewer'
export { PieChart3D } from './components/PieChart3D'
export { BarChart3D } from './components/BarChart3D'
export { ChartLegend } from './components/ChartLegend'
export { ChartTooltip } from './components/ChartTooltip'
export type { ChartTooltipProps } from './components/ChartTooltip'
export { ChartMaterial, resolveMaterialConfig, DEFAULT_MATERIAL } from './components/materials'
export type { ChartMaterialProps } from './components/materials/ChartMaterial'

export * from './types'

export { DEFAULT_PALETTE, getPaletteColor } from './utils/colors'
export { easings, getEasing } from './utils/easings'
export { computePieSegments } from './utils/pie'
export type { PieSegment, ComputePieSegmentsOptions } from './utils/pie'
export { createPieSliceGeometry } from './utils/geometry'
export type { PieSliceGeometryOptions } from './utils/geometry'
export {
  resolveAnimation,
  resolveAutoRotate,
  resolveControls,
  resolveHover,
  resolveTooltip
} from './utils/normalize'
export type {
  ResolvedAnimation,
  ResolvedAutoRotate,
  ResolvedControls,
  ResolvedHover,
  ResolvedTooltip
} from './utils/normalize'
