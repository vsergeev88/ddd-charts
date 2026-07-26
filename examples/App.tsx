import { useState, type CSSProperties } from 'react'
import {
  BarChart3D,
  ChartLegend,
  ChartViewer,
  PieChart3D,
  type ChartDatum,
  type MaterialsProp
} from 'ddd-charts'

const pieData: ChartDatum[] = [
  { id: 'design', label: 'Design', value: 28 },
  { id: 'dev', label: 'Development', value: 42 },
  { id: 'qa', label: 'QA', value: 14 },
  { id: 'ops', label: 'Ops', value: 16 }
]

const barData: ChartDatum[] = [
  { id: 'jan', label: 'Jan', value: 42 },
  { id: 'feb', label: 'Feb', value: 61 },
  { id: 'mar', label: 'Mar', value: 35 },
  { id: 'apr', label: 'Apr', value: 78 },
  { id: 'may', label: 'May', value: 55 },
  { id: 'jun', label: 'Jun', value: 91 }
]

const barMaterials: MaterialsProp = (datum, index) =>
  index === barData.length - 1
    ? { glassEffect: true, color: '#7dd3fc' }
    : { metallic: 0.8, roughness: 0.2 + (datum.value / 100) * 0.3 }

const cardStyle: CSSProperties = {
  flex: 1,
  minWidth: 380,
  height: 460,
  borderRadius: 20,
  overflow: 'hidden',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)',
  display: 'flex',
  flexDirection: 'column'
}

const headerStyle: CSSProperties = {
  padding: '16px 20px',
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: 0.3,
  color: '#c3c8e6',
  borderBottom: '1px solid rgba(255,255,255,0.06)'
}

export function App() {
  const [autoRotate, setAutoRotate] = useState(true)
  const [glass, setGlass] = useState(true)
  const [selected, setSelected] = useState<string>('—')
  const [pieActive, setPieActive] = useState<number | null>(null)
  const [barActive, setBarActive] = useState<number | null>(null)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontSize: 34, marginBottom: 8 }}>ddd-charts</h1>
      <p style={{ color: '#8b91b5', marginBottom: 24 }}>
        Highly customizable 3D charts for React. Click a segment or a bar — selected:{' '}
        <strong style={{ color: '#e7e9f4' }}>{selected}</strong>
      </p>

      <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={autoRotate}
            onChange={(e) => setAutoRotate(e.target.checked)}
          />
          Auto-rotate
        </label>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" checked={glass} onChange={(e) => setGlass(e.target.checked)} />
          Glass pie
        </label>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <div style={headerStyle}>PieChart3D — donut, glass material</div>
          <div style={{ flex: 1 }}>
            <ChartViewer
              camera={{ position: [4.5, 4, 6], fov: 42 }}
              autoRotate={autoRotate ? { speed: 0.4 } : false}
              environment="city"
            >
              <PieChart3D
                data={pieData}
                innerRadius={0.9}
                outerRadius={2.1}
                height={0.7}
                materials={
                  glass
                    ? { glassEffect: true, thickness: 0.8, roughness: 0.08 }
                    : { metallic: 0.85, roughness: 0.25, clearcoat: 1 }
                }
                highlightedIndex={pieActive}
                onItemClick={(d) => setSelected(`${d.label} (${d.value})`)}
                onItemPointerOver={(_, i) => setPieActive(i)}
                onItemPointerOut={() => setPieActive(null)}
              />
            </ChartViewer>
          </div>
          <ChartLegend
            items={pieData}
            activeIndex={pieActive}
            onItemOver={(_, i) => setPieActive(i)}
            onItemOut={() => setPieActive(null)}
            style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}
          />
        </div>

        <div style={cardStyle}>
          <div style={headerStyle}>BarChart3D — metallic, per-bar hover</div>
          <div style={{ flex: 1 }}>
            <ChartViewer
              camera={{ position: [6, 5, 9], fov: 40, target: [0, 1.2, 0] }}
              autoRotate={autoRotate ? { speed: 0.25 } : false}
              environment="sunset"
            >
              <BarChart3D
                data={barData}
                maxBarHeight={3.2}
                materials={barMaterials}
                hover={{ scale: 1.1, emissiveIntensity: 0.35 }}
                tooltip={{ showPercent: false }}
                highlightedIndex={barActive}
                onItemClick={(d) => setSelected(`${d.label} (${d.value})`)}
                onItemPointerOver={(_, i) => setBarActive(i)}
                onItemPointerOut={() => setBarActive(null)}
              />
            </ChartViewer>
          </div>
          <ChartLegend
            items={barData}
            materials={barMaterials}
            activeIndex={barActive}
            onItemOver={(_, i) => setBarActive(i)}
            onItemOut={() => setBarActive(null)}
            style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}
          />
        </div>
      </div>
    </div>
  )
}
