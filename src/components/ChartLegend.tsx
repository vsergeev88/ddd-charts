import { Fragment, memo, type CSSProperties } from 'react'
import type { ChartLegendProps } from '../types'
import { getPaletteColor } from '../utils/colors'
import { resolveMaterialConfig } from './materials/resolveMaterial'

const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: 14,
  lineHeight: 1.2,
  transition: 'opacity 0.15s ease',
  userSelect: 'none'
}

export const ChartLegend = memo(function ChartLegend({
  items,
  materials,
  direction = 'row',
  showValues = true,
  activeIndex = null,
  onItemOver,
  onItemOut,
  onItemClick,
  renderItem,
  className,
  style
}: ChartLegendProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction,
        flexWrap: direction === 'row' ? 'wrap' : 'nowrap',
        gap: direction === 'row' ? '10px 18px' : 10,
        alignItems: direction === 'row' ? 'center' : 'flex-start',
        ...style
      }}
    >
      {items.map((datum, index) => {
        const color = resolveMaterialConfig(materials, datum, index, getPaletteColor(index)).color
        const key = datum.id ?? index
        if (renderItem) return <Fragment key={key}>{renderItem(datum, index, color)}</Fragment>

        const active = activeIndex === index
        const dimmed = activeIndex !== null && activeIndex !== undefined && !active
        return (
          <div
            key={key}
            onMouseEnter={() => onItemOver?.(datum, index)}
            onMouseLeave={() => onItemOut?.(datum, index)}
            onClick={() => onItemClick?.(datum, index)}
            style={{
              ...itemStyle,
              cursor: onItemClick || onItemOver ? 'pointer' : 'default',
              opacity: dimmed ? 0.45 : 1,
              fontWeight: active ? 600 : 400
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 4,
                background: color,
                boxShadow: active ? `0 0 0 3px ${color}44` : 'none',
                transition: 'box-shadow 0.15s ease',
                flexShrink: 0
              }}
            />
            <span>{datum.label ?? `#${index + 1}`}</span>
            {showValues && <span style={{ opacity: 0.6 }}>{datum.value}</span>}
          </div>
        )
      })}
    </div>
  )
})
