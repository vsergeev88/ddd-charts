import { useState, type CSSProperties, type FormEvent } from 'react'
import {
  BarChart3D,
  ChartLegend,
  ChartViewer,
  PieChart3D,
  type ChartDatum,
  type MaterialConfig
} from 'ddd-charts'

type TabId = 'pie' | 'bar'

const initialPieData: ChartDatum[] = [
  {
    id: 'design',
    label: 'Design',
    value: 28,
    color: '#6366f1',
    material: { metallic: 0.85, roughness: 0.25, clearcoat: 1 }
  },
  {
    id: 'dev',
    label: 'Development',
    value: 42,
    color: '#22d3ee',
    material: { metallic: 0.7, roughness: 0.3, clearcoat: 0.8 }
  },
  {
    id: 'qa',
    label: 'QA',
    value: 14,
    color: '#f472b6',
    material: { metallic: 0.6, roughness: 0.35, clearcoat: 0.6 }
  },
  {
    id: 'ops',
    label: 'Ops',
    value: 16,
    color: '#34d399',
    material: { glassEffect: true, thickness: 0.8, roughness: 0.08 }
  }
]

const initialBarData: ChartDatum[] = [
  {
    id: 'jan',
    label: 'Jan',
    value: 42,
    color: '#6366f1',
    material: { metallic: 0.8, roughness: 0.326 }
  },
  {
    id: 'feb',
    label: 'Feb',
    value: 61,
    color: '#22d3ee',
    material: { metallic: 0.8, roughness: 0.383 }
  },
  {
    id: 'mar',
    label: 'Mar',
    value: 35,
    color: '#f472b6',
    material: { metallic: 0.8, roughness: 0.305 }
  },
  {
    id: 'apr',
    label: 'Apr',
    value: 78,
    color: '#34d399',
    material: { metallic: 0.8, roughness: 0.434 }
  },
  {
    id: 'may',
    label: 'May',
    value: 55,
    color: '#fbbf24',
    material: { metallic: 0.8, roughness: 0.365 }
  },
  {
    id: 'jun',
    label: 'Jun',
    value: 91,
    color: '#7dd3fc',
    material: { glassEffect: true, thickness: 0.8, roughness: 0.08 }
  }
]

const shellStyle: CSSProperties = {
  maxWidth: 1280,
  margin: '0 auto',
  padding: '48px 24px'
}

const tabBarStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  marginBottom: 20
}

const tabStyle = (active: boolean): CSSProperties => ({
  padding: '10px 18px',
  borderRadius: 10,
  border: active ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
  background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
  color: active ? '#e7e9f4' : '#8b91b5',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 600
})

const panelStyle: CSSProperties = {
  display: 'flex',
  gap: 24,
  alignItems: 'stretch',
  flexWrap: 'wrap'
}

const chartCardStyle: CSSProperties = {
  flex: '1 1 420px',
  minWidth: 360,
  height: 520,
  borderRadius: 20,
  overflow: 'hidden',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)',
  display: 'flex',
  flexDirection: 'column'
}

const tableCardStyle: CSSProperties = {
  flex: '1 1 360px',
  minWidth: 320,
  borderRadius: 20,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)',
  padding: 20,
  overflow: 'auto'
}

const headerStyle: CSSProperties = {
  padding: '16px 20px',
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: 0.3,
  color: '#c3c8e6',
  borderBottom: '1px solid rgba(255,255,255,0.06)'
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 14
}

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: '10px 8px',
  color: '#8b91b5',
  fontWeight: 600,
  borderBottom: '1px solid rgba(255,255,255,0.08)'
}

const tdStyle: CSSProperties = {
  padding: '12px 8px',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  color: '#e7e9f4',
  verticalAlign: 'middle'
}

const buttonStyle: CSSProperties = {
  padding: '7px 12px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.06)',
  color: '#e7e9f4',
  cursor: 'pointer',
  fontSize: 13
}

const primaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: '#4f46e5',
  border: '1px solid #6366f1'
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(5, 7, 18, 0.72)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 50,
  padding: 24
}

const modalStyle: CSSProperties = {
  width: 'min(480px, 100%)',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.12)',
  background: '#15182b',
  boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
  padding: 24
}

const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  marginBottom: 14
}

const labelStyle: CSSProperties = {
  fontSize: 12,
  color: '#8b91b5',
  fontWeight: 600
}

const inputStyle: CSSProperties = {
  padding: '9px 11px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)',
  color: '#e7e9f4',
  fontSize: 14
}

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12
}

function materialSummary(datum: ChartDatum): string {
  const m = datum.material
  if (!m) return 'default'
  if (m.glassEffect) return 'glass'
  const parts: string[] = []
  if (m.metallic != null) parts.push(`metal ${m.metallic}`)
  if (m.roughness != null) parts.push(`rough ${m.roughness}`)
  return parts.length ? parts.join(', ') : 'custom'
}

function parseOptionalNumber(value: string): number | undefined {
  if (value.trim() === '') return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

interface MaterialDraft {
  color: string
  metallic: string
  roughness: string
  glassEffect: boolean
  thickness: string
  transmission: string
  ior: string
  opacity: string
  clearcoat: string
  clearcoatRoughness: string
  emissive: string
  emissiveIntensity: string
  envMapIntensity: string
  flatShading: boolean
}

function toDraft(datum: ChartDatum): MaterialDraft {
  const m = datum.material ?? {}
  return {
    color: datum.color ?? '#6366f1',
    metallic: m.metallic?.toString() ?? '',
    roughness: m.roughness?.toString() ?? '',
    glassEffect: Boolean(m.glassEffect),
    thickness: m.thickness?.toString() ?? '',
    transmission: m.transmission?.toString() ?? '',
    ior: m.ior?.toString() ?? '',
    opacity: m.opacity?.toString() ?? '',
    clearcoat: m.clearcoat?.toString() ?? '',
    clearcoatRoughness: m.clearcoatRoughness?.toString() ?? '',
    emissive: m.emissive ?? '',
    emissiveIntensity: m.emissiveIntensity?.toString() ?? '',
    envMapIntensity: m.envMapIntensity?.toString() ?? '',
    flatShading: Boolean(m.flatShading)
  }
}

function fromDraft(draft: MaterialDraft): { color: string; material: MaterialConfig } {
  const material: MaterialConfig = {
    glassEffect: draft.glassEffect || undefined,
    flatShading: draft.flatShading || undefined,
    metallic: parseOptionalNumber(draft.metallic),
    roughness: parseOptionalNumber(draft.roughness),
    thickness: parseOptionalNumber(draft.thickness),
    transmission: parseOptionalNumber(draft.transmission),
    ior: parseOptionalNumber(draft.ior),
    opacity: parseOptionalNumber(draft.opacity),
    clearcoat: parseOptionalNumber(draft.clearcoat),
    clearcoatRoughness: parseOptionalNumber(draft.clearcoatRoughness),
    emissive: draft.emissive.trim() || undefined,
    emissiveIntensity: parseOptionalNumber(draft.emissiveIntensity),
    envMapIntensity: parseOptionalNumber(draft.envMapIntensity)
  }

  return {
    color: draft.color,
    material: Object.fromEntries(
      Object.entries(material).filter(([, v]) => v !== undefined)
    ) as MaterialConfig
  }
}

const rangeStyle: CSSProperties = {
  width: '100%',
  accentColor: '#6366f1',
  cursor: 'pointer'
}

interface SliderNumberFieldProps {
  label: string
  value: string
  min: number
  max: number
  step?: number
  fallback?: number
  onChange: (value: string) => void
}

function SliderNumberField({
  label,
  value,
  min,
  max,
  step = 0.01,
  fallback = min,
  onChange
}: SliderNumberFieldProps) {
  const parsed = parseOptionalNumber(value)
  const sliderValue = parsed ?? fallback

  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={(e) => onChange(e.target.value)}
        style={rangeStyle}
      />
      <input
        style={inputStyle}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

interface MaterialModalProps {
  datum: ChartDatum
  onCancel: () => void
  onOk: (next: { color: string; material: MaterialConfig }) => void
}

function MaterialModal({ datum, onCancel, onOk }: MaterialModalProps) {
  const [draft, setDraft] = useState(() => toDraft(datum))

  const update = <K extends keyof MaterialDraft>(key: K, value: MaterialDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onOk(fromDraft(draft))
  }

  return (
    <div style={overlayStyle} onClick={onCancel}>
      <form
        style={{ ...modalStyle, maxHeight: '90vh', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 style={{ fontSize: 18, marginBottom: 6 }}>Material — {datum.label ?? datum.id}</h2>
        <p style={{ color: '#8b91b5', fontSize: 13, marginBottom: 18 }}>
          Adjust color and PBR / glass options for this datum.
        </p>

        <div style={fieldStyle}>
          <label style={labelStyle}>Color</label>
          <input
            type="color"
            value={draft.color}
            onChange={(e) => update('color', e.target.value)}
            style={{ ...inputStyle, padding: 4, height: 40 }}
          />
        </div>

        <label style={{ ...fieldStyle, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <input
            type="checkbox"
            checked={draft.glassEffect}
            onChange={(e) => update('glassEffect', e.target.checked)}
          />
          <span style={{ ...labelStyle, color: '#c3c8e6' }}>glassEffect</span>
        </label>

        <div style={gridStyle}>
          <SliderNumberField
            label="metallic"
            value={draft.metallic}
            min={0}
            max={1}
            onChange={(v) => update('metallic', v)}
          />
          <SliderNumberField
            label="roughness"
            value={draft.roughness}
            min={0}
            max={1}
            onChange={(v) => update('roughness', v)}
          />
          <SliderNumberField
            label="clearcoat"
            value={draft.clearcoat}
            min={0}
            max={1}
            onChange={(v) => update('clearcoat', v)}
          />
          <SliderNumberField
            label="clearcoatRoughness"
            value={draft.clearcoatRoughness}
            min={0}
            max={1}
            onChange={(v) => update('clearcoatRoughness', v)}
          />
          <SliderNumberField
            label="thickness"
            value={draft.thickness}
            min={0}
            max={5}
            onChange={(v) => update('thickness', v)}
          />
          <SliderNumberField
            label="transmission"
            value={draft.transmission}
            min={0}
            max={1}
            onChange={(v) => update('transmission', v)}
          />
          <SliderNumberField
            label="ior"
            value={draft.ior}
            min={1}
            max={2.5}
            fallback={1.5}
            onChange={(v) => update('ior', v)}
          />
          <SliderNumberField
            label="opacity"
            value={draft.opacity}
            min={0}
            max={1}
            fallback={1}
            onChange={(v) => update('opacity', v)}
          />
          <div style={fieldStyle}>
            <label style={labelStyle}>emissive</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="color"
                value={/^#[0-9a-fA-F]{6}$/.test(draft.emissive) ? draft.emissive : '#000000'}
                onChange={(e) => update('emissive', e.target.value)}
                style={{ ...inputStyle, padding: 4, height: 40, width: 56, flexShrink: 0 }}
              />
              <input
                style={{ ...inputStyle, flex: 1 }}
                type="text"
                placeholder="#000000"
                value={draft.emissive}
                onChange={(e) => update('emissive', e.target.value)}
              />
            </div>
          </div>
          <SliderNumberField
            label="emissiveIntensity"
            value={draft.emissiveIntensity}
            min={0}
            max={5}
            onChange={(v) => update('emissiveIntensity', v)}
          />
          <SliderNumberField
            label="envMapIntensity"
            value={draft.envMapIntensity}
            min={0}
            max={5}
            fallback={1}
            onChange={(v) => update('envMapIntensity', v)}
          />
          <label style={{ ...fieldStyle, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              checked={draft.flatShading}
              onChange={(e) => update('flatShading', e.target.checked)}
            />
            <span style={{ ...labelStyle, color: '#c3c8e6' }}>flatShading</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <button type="button" style={buttonStyle} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" style={primaryButtonStyle}>
            Ok
          </button>
        </div>
      </form>
    </div>
  )
}

interface DataTableProps {
  data: ChartDatum[]
  activeIndex: number | null
  onEdit: (index: number) => void
  onRowOver: (index: number) => void
  onRowOut: () => void
}

function DataTable({ data, activeIndex, onEdit, onRowOver, onRowOut }: DataTableProps) {
  return (
    <div style={tableCardStyle}>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: '#c3c8e6' }}>
        Chart data
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Color</th>
            <th style={thStyle}>Label</th>
            <th style={thStyle}>Value</th>
            <th style={thStyle}>Material</th>
            <th style={thStyle} />
          </tr>
        </thead>
        <tbody>
          {data.map((datum, index) => (
            <tr
              key={String(datum.id ?? index)}
              onMouseEnter={() => onRowOver(index)}
              onMouseLeave={onRowOut}
              style={{
                background:
                  activeIndex === index ? 'rgba(99, 102, 241, 0.12)' : 'transparent'
              }}
            >
              <td style={tdStyle}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    background: datum.color ?? '#6366f1',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                />
              </td>
              <td style={tdStyle}>{datum.label ?? datum.id}</td>
              <td style={tdStyle}>{datum.value}</td>
              <td style={{ ...tdStyle, color: '#a7adcc', fontSize: 13 }}>
                {materialSummary(datum)}
              </td>
              <td style={tdStyle}>
                <button type="button" style={buttonStyle} onClick={() => onEdit(index)}>
                  Material
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function App() {
  const [tab, setTab] = useState<TabId>('pie')
  const [autoRotate, setAutoRotate] = useState(true)
  const [selected, setSelected] = useState<string>('—')
  const [pieData, setPieData] = useState(initialPieData)
  const [barData, setBarData] = useState(initialBarData)
  const [pieActive, setPieActive] = useState<number | null>(null)
  const [barActive, setBarActive] = useState<number | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)

  const data = tab === 'pie' ? pieData : barData
  const activeIndex = tab === 'pie' ? pieActive : barActive
  const editingDatum = editIndex != null ? data[editIndex] : null

  const setActive = (index: number | null) => {
    if (tab === 'pie') setPieActive(index)
    else setBarActive(index)
  }

  const applyMaterial = (next: { color: string; material: MaterialConfig }) => {
    if (editIndex == null) return
    const updater = (items: ChartDatum[]) =>
      items.map((item, i) =>
        i === editIndex ? { ...item, color: next.color, material: next.material } : item
      )
    if (tab === 'pie') setPieData(updater)
    else setBarData(updater)
    setEditIndex(null)
  }

  return (
    <div style={shellStyle}>
      <h1 style={{ fontSize: 34, marginBottom: 8 }}>ddd-charts</h1>
      <p style={{ color: '#8b91b5', marginBottom: 24 }}>
        Highly customizable 3D charts for React. Click a segment or a bar — selected:{' '}
        <strong style={{ color: '#e7e9f4' }}>{selected}</strong>
      </p>

      <div style={{ display: 'flex', gap: 20, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={tabBarStyle}>
          <button type="button" style={tabStyle(tab === 'pie')} onClick={() => setTab('pie')}>
            PieChart3D
          </button>
          <button type="button" style={tabStyle(tab === 'bar')} onClick={() => setTab('bar')}>
            BarChart3D
          </button>
        </div>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={autoRotate}
            onChange={(e) => setAutoRotate(e.target.checked)}
          />
          Auto-rotate
        </label>
      </div>

      <div style={panelStyle}>
        <div style={chartCardStyle}>
          <div style={headerStyle}>
            {tab === 'pie' ? 'PieChart3D — donut' : 'BarChart3D — rounded bars'}
          </div>
          <div style={{ flex: 1 }}>
            {tab === 'pie' ? (
              <ChartViewer
                camera={{ position: [4.5, 4, 6], fov: 42 }}
                autoRotate={autoRotate ? { speed: 0.12 } : false}
                environment="city"
              >
                <PieChart3D
                  data={pieData}
                  innerRadius={0.9}
                  outerRadius={2.1}
                  height={0.7}
                  highlightedIndex={pieActive}
                  onItemClick={(d) => setSelected(`${d.label} (${d.value})`)}
                  onItemPointerOver={(_, i) => setPieActive(i)}
                  onItemPointerOut={() => setPieActive(null)}
                />
              </ChartViewer>
            ) : (
              <ChartViewer
                camera={{ position: [6, 5, 9], fov: 40, target: [0, 1.2, 0] }}
                autoRotate={autoRotate ? { speed: 0.25 } : false}
                environment="sunset"
              >
                <BarChart3D
                  data={barData}
                  maxBarHeight={3.2}
                  hover={{ scale: 1.1, emissiveIntensity: 0.35 }}
                  tooltip={{ showPercent: false }}
                  highlightedIndex={barActive}
                  onItemClick={(d) => setSelected(`${d.label} (${d.value})`)}
                  onItemPointerOver={(_, i) => setBarActive(i)}
                  onItemPointerOut={() => setBarActive(null)}
                />
              </ChartViewer>
            )}
          </div>
          <ChartLegend
            items={data}
            activeIndex={activeIndex}
            onItemOver={(_, i) => setActive(i)}
            onItemOut={() => setActive(null)}
            style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}
          />
        </div>

        <DataTable
          data={data}
          activeIndex={activeIndex}
          onEdit={setEditIndex}
          onRowOver={setActive}
          onRowOut={() => setActive(null)}
        />
      </div>

      {editingDatum && editIndex != null && (
        <MaterialModal
          key={`${tab}-${editIndex}`}
          datum={editingDatum}
          onCancel={() => setEditIndex(null)}
          onOk={applyMaterial}
        />
      )}
    </div>
  )
}
