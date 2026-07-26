import { describe, expect, it, vi } from 'vitest'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { ChartLegend } from '../components/ChartLegend'
import type { ChartDatum } from '../types'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const items: ChartDatum[] = [
  { label: 'Alpha', value: 40, color: '#ff0000' },
  { label: 'Beta', value: 25 },
  { label: 'Gamma', value: 35 }
]

function renderLegend(element: React.ReactElement) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  act(() => root.render(element))
  return {
    container,
    cleanup: () => {
      act(() => root.unmount())
      container.remove()
    }
  }
}

describe('ChartLegend', () => {
  it('renders a swatch, label and value for every item', () => {
    const { container, cleanup } = renderLegend(<ChartLegend items={items} />)
    expect(container.textContent).toContain('Alpha')
    expect(container.textContent).toContain('Beta')
    expect(container.textContent).toContain('35')
    expect(container.querySelectorAll(':scope > div > div')).toHaveLength(3)
    cleanup()
  })

  it('hides values when showValues is false', () => {
    const { container, cleanup } = renderLegend(<ChartLegend items={items} showValues={false} />)
    expect(container.textContent).toContain('Alpha')
    expect(container.textContent).not.toContain('40')
    cleanup()
  })

  it('dims inactive items when activeIndex is set', () => {
    const { container, cleanup } = renderLegend(<ChartLegend items={items} activeIndex={1} />)
    const rows = container.querySelectorAll<HTMLElement>(':scope > div > div')
    expect(rows[0].style.opacity).toBe('0.45')
    expect(rows[1].style.opacity).toBe('1')
    cleanup()
  })

  it('fires interaction callbacks with datum and index', () => {
    const onItemClick = vi.fn()
    const { container, cleanup } = renderLegend(
      <ChartLegend items={items} onItemClick={onItemClick} />
    )
    const rows = container.querySelectorAll<HTMLElement>(':scope > div > div')
    act(() => {
      rows[2].dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(onItemClick).toHaveBeenCalledWith(items[2], 2)
    cleanup()
  })
})
