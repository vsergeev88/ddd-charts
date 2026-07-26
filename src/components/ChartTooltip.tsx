import type { CSSProperties } from 'react'
import { Html } from '@react-three/drei'
import type { ChartDatum, Vec3 } from '../types'
import type { ResolvedTooltip } from '../utils/normalize'

const panelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '7px 12px',
  borderRadius: 10,
  background: 'rgba(15, 17, 26, 0.92)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
  color: '#f1f2f8',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: 13,
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
  pointerEvents: 'none'
}

export interface ChartTooltipProps {
  datum: ChartDatum
  index: number
  fraction: number
  color: string
  position: Vec3
  config: ResolvedTooltip
}

export function ChartTooltip({ datum, index, fraction, color, position, config }: ChartTooltipProps) {
  return (
    <Html
      position={position}
      center
      distanceFactor={config.distanceFactor}
      zIndexRange={[1000, 0]}
      style={{ pointerEvents: 'none' }}
    >
      {config.render ? (
        config.render(datum, index, fraction)
      ) : (
        <div className={config.className} style={{ ...panelStyle, ...config.style }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: color,
              flexShrink: 0
            }}
          />
          <span style={{ fontWeight: 600 }}>{datum.label ?? `#${index + 1}`}</span>
          {config.showValue && <span style={{ opacity: 0.85 }}>{datum.value}</span>}
          {config.showPercent && (
            <span style={{ opacity: 0.55 }}>{(fraction * 100).toFixed(1)}%</span>
          )}
        </div>
      )}
    </Html>
  )
}
