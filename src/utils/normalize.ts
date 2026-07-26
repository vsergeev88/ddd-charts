import type {
  AnimationProp,
  AutoRotateProp,
  ControlsProp,
  EasingName,
  EntranceAnimationConfig,
  HoverProp,
  TooltipConfig,
  TooltipProp,
  Vec3
} from '../types'

export interface ResolvedAutoRotate {
  enabled: boolean
  speed: number
}

export function resolveAutoRotate(prop: AutoRotateProp | undefined): ResolvedAutoRotate {
  if (prop === undefined || prop === false) return { enabled: false, speed: 0.5 }
  if (prop === true) return { enabled: true, speed: 0.5 }
  return { enabled: prop.enabled ?? true, speed: prop.speed ?? 0.5 }
}

export interface ResolvedControls {
  enabled: boolean
  enablePan: boolean
  enableZoom: boolean
  enableRotate: boolean
  enableDamping: boolean
  dampingFactor: number
  minDistance?: number
  maxDistance?: number
  minPolarAngle?: number
  maxPolarAngle?: number
}

export function resolveControls(prop: ControlsProp | undefined): ResolvedControls {
  const base: ResolvedControls = {
    enabled: true,
    enablePan: true,
    enableZoom: true,
    enableRotate: true,
    enableDamping: true,
    dampingFactor: 0.08
  }
  if (prop === undefined || prop === true) return base
  if (prop === false) return { ...base, enabled: false }
  return {
    ...base,
    ...prop,
    enabled: prop.enabled ?? true
  }
}

export interface ResolvedAnimation {
  enabled: boolean
  duration: number
  delay: number
  stagger: number
  easing: EasingName
}

const DEFAULT_ANIMATION: ResolvedAnimation = {
  enabled: true,
  duration: 0.9,
  delay: 0,
  stagger: 0.08,
  easing: 'easeOutCubic'
}

export function resolveAnimation(prop: AnimationProp | undefined): ResolvedAnimation {
  if (prop === undefined || prop === true) return DEFAULT_ANIMATION
  if (prop === false) return { ...DEFAULT_ANIMATION, enabled: false }
  const config: EntranceAnimationConfig = prop
  return {
    enabled: config.enabled ?? true,
    duration: config.duration ?? DEFAULT_ANIMATION.duration,
    delay: config.delay ?? DEFAULT_ANIMATION.delay,
    stagger: config.stagger ?? DEFAULT_ANIMATION.stagger,
    easing: config.easing ?? DEFAULT_ANIMATION.easing
  }
}

export interface ResolvedHover {
  enabled: boolean
  scale: number
  explode: number
  emissive?: string
  emissiveIntensity: number
  speed: number
}

const DEFAULT_HOVER: ResolvedHover = {
  enabled: true,
  scale: 1.06,
  explode: 0.18,
  emissiveIntensity: 0.25,
  speed: 8
}

export interface ResolvedTooltip {
  enabled: boolean
  render?: TooltipConfig['render']
  className?: string
  style?: TooltipConfig['style']
  distanceFactor?: number
  offset: Vec3
  showValue: boolean
  showPercent: boolean
}

const DEFAULT_TOOLTIP: ResolvedTooltip = {
  enabled: true,
  offset: [0, 0.35, 0],
  showValue: true,
  showPercent: true
}

export function resolveTooltip(prop: TooltipProp | undefined): ResolvedTooltip {
  if (prop === undefined || prop === true) return DEFAULT_TOOLTIP
  if (prop === false) return { ...DEFAULT_TOOLTIP, enabled: false }
  return {
    enabled: prop.enabled ?? true,
    render: prop.render,
    className: prop.className,
    style: prop.style,
    distanceFactor: prop.distanceFactor,
    offset: prop.offset ?? DEFAULT_TOOLTIP.offset,
    showValue: prop.showValue ?? DEFAULT_TOOLTIP.showValue,
    showPercent: prop.showPercent ?? DEFAULT_TOOLTIP.showPercent
  }
}

export function resolveHover(prop: HoverProp | undefined): ResolvedHover {
  if (prop === undefined || prop === true) return DEFAULT_HOVER
  if (prop === false) return { ...DEFAULT_HOVER, enabled: false }
  return {
    enabled: prop.enabled ?? true,
    scale: prop.scale ?? DEFAULT_HOVER.scale,
    explode: prop.explode ?? DEFAULT_HOVER.explode,
    emissive: prop.emissive,
    emissiveIntensity: prop.emissiveIntensity ?? DEFAULT_HOVER.emissiveIntensity,
    speed: prop.speed ?? DEFAULT_HOVER.speed
  }
}
