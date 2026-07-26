import type { CSSProperties, ReactNode } from 'react'
import type { CanvasProps } from '@react-three/fiber'

export type Vec3 = [number, number, number]

export interface MaterialConfig {
  color?: string
  metallic?: number
  roughness?: number
  glassEffect?: boolean
  transmission?: number
  thickness?: number
  ior?: number
  opacity?: number
  emissive?: string
  emissiveIntensity?: number
  clearcoat?: number
  clearcoatRoughness?: number
  envMapIntensity?: number
  flatShading?: boolean
}

export interface ResolvedMaterialConfig {
  color: string
  metallic: number
  roughness: number
  glassEffect: boolean
  transmission: number
  thickness: number
  ior: number
  opacity: number
  emissive: string
  emissiveIntensity: number
  clearcoat: number
  clearcoatRoughness: number
  envMapIntensity: number
  flatShading: boolean
}

export interface ChartDatum {
  id?: string | number
  label?: string
  value: number
  color?: string
  material?: MaterialConfig
}

export type MaterialsProp =
  | MaterialConfig
  | MaterialConfig[]
  | ((datum: ChartDatum, index: number) => MaterialConfig)

export interface CameraConfig {
  position?: Vec3
  fov?: number
  near?: number
  far?: number
  zoom?: number
  target?: Vec3
}

export interface AutoRotateConfig {
  enabled?: boolean
  speed?: number
}

export type AutoRotateProp = boolean | AutoRotateConfig

export interface ControlsConfig {
  enabled?: boolean
  enablePan?: boolean
  enableZoom?: boolean
  enableRotate?: boolean
  enableDamping?: boolean
  dampingFactor?: number
  minDistance?: number
  maxDistance?: number
  minPolarAngle?: number
  maxPolarAngle?: number
}

export type ControlsProp = boolean | ControlsConfig

export type EasingName =
  | 'linear'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeOutBack'
  | 'easeOutElastic'

export interface EntranceAnimationConfig {
  enabled?: boolean
  duration?: number
  delay?: number
  stagger?: number
  easing?: EasingName
}

export type AnimationProp = boolean | EntranceAnimationConfig

export interface HoverEffectConfig {
  enabled?: boolean
  scale?: number
  explode?: number
  emissive?: string
  emissiveIntensity?: number
  speed?: number
}

export type HoverProp = boolean | HoverEffectConfig

export interface TooltipConfig {
  enabled?: boolean
  render?: (datum: ChartDatum, index: number, fraction: number) => ReactNode
  className?: string
  style?: CSSProperties
  distanceFactor?: number
  offset?: Vec3
  showValue?: boolean
  showPercent?: boolean
}

export type TooltipProp = boolean | TooltipConfig

export interface ChartInteractionHandlers {
  onItemClick?: (datum: ChartDatum, index: number) => void
  onItemPointerOver?: (datum: ChartDatum, index: number) => void
  onItemPointerOut?: (datum: ChartDatum, index: number) => void
}

export interface LightingConfig {
  ambientIntensity?: number
  directionalIntensity?: number
  directionalPosition?: Vec3
  castShadow?: boolean
}

export type EnvironmentPreset =
  | 'apartment'
  | 'city'
  | 'dawn'
  | 'forest'
  | 'lobby'
  | 'night'
  | 'park'
  | 'studio'
  | 'sunset'
  | 'warehouse'

export interface ContactShadowsConfig {
  opacity?: number
  blur?: number
  scale?: number
  far?: number
  position?: Vec3
}

export interface ChartViewerProps {
  children: ReactNode
  camera?: CameraConfig
  autoRotate?: AutoRotateProp
  controls?: ControlsProp
  environment?: EnvironmentPreset | false
  lighting?: LightingConfig | false
  shadows?: boolean
  contactShadows?: boolean | ContactShadowsConfig
  background?: string
  className?: string
  style?: CSSProperties
  canvasProps?: Omit<CanvasProps, 'children'>
}

export interface BaseChartProps extends ChartInteractionHandlers {
  data: ChartDatum[]
  materials?: MaterialsProp
  animation?: AnimationProp
  hover?: HoverProp
  tooltip?: TooltipProp
  highlightedIndex?: number | null
  position?: Vec3
  rotation?: Vec3
  castShadow?: boolean
  receiveShadow?: boolean
}

export interface ChartLegendProps {
  items: ChartDatum[]
  materials?: MaterialsProp
  direction?: 'row' | 'column'
  showValues?: boolean
  activeIndex?: number | null
  onItemOver?: (datum: ChartDatum, index: number) => void
  onItemOut?: (datum: ChartDatum, index: number) => void
  onItemClick?: (datum: ChartDatum, index: number) => void
  renderItem?: (datum: ChartDatum, index: number, color: string) => ReactNode
  className?: string
  style?: CSSProperties
}

export interface PieChart3DProps extends BaseChartProps {
  innerRadius?: number
  outerRadius?: number
  height?: number
  padAngle?: number
  startAngle?: number
  bevelSize?: number
}

export interface BarChart3DProps extends BaseChartProps {
  barWidth?: number
  barDepth?: number
  gap?: number
  maxBarHeight?: number
  maxValue?: number
  radius?: number
}
