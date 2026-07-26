import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'
import { getEasing } from '../utils/easings'
import type { ResolvedAnimation, ResolvedHover } from '../utils/normalize'

export function useChartItemAnimation(
  index: number,
  animation: ResolvedAnimation,
  hover: ResolvedHover,
  hovered: boolean,
  onFrame: (entrance: number, hoverAmount: number) => void
) {
  const startRef = useRef<number | null>(null)
  const hoverRef = useRef(0)
  const easing = getEasing(animation.easing)

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime()
    if (startRef.current === null) startRef.current = elapsed

    let entrance = 1
    if (animation.enabled) {
      const local =
        (elapsed - startRef.current - animation.delay - index * animation.stagger) /
        animation.duration
      entrance = local <= 0 ? 0 : local >= 1 ? 1 : easing(local)
    }

    const target = hovered && hover.enabled ? 1 : 0
    hoverRef.current = MathUtils.damp(hoverRef.current, target, hover.speed, delta)

    onFrame(Math.max(entrance, 0.0001), hoverRef.current)
  })
}
