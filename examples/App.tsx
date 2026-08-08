import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import {
  BarChart3D,
  ChartLegend,
  ChartViewer,
  PieChart3D,
  type ChartDatum,
  type EnvironmentPreset,
  type MaterialConfig
} from 'ddd-charts'

type TabId = 'pie' | 'bar'

const ENVIRONMENT_PRESETS: EnvironmentPreset[] = [
  'apartment',
  'city',
  'dawn',
  'forest',
  'lobby',
  'night',
  'park',
  'studio',
  'sunset',
  'warehouse'
]

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
  overflow: 'auto',
  height: '520px',
}

const headerStyle: CSSProperties = {
  padding: '16px 20px',
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: 0.3,
  color: '#c3c8e6',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12
}

const selectStyle: CSSProperties = {
  padding: '6px 10px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.06)',
  color: '#e7e9f4',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit'
}

type DarkSelectOption = { value: string; label: string }

function DarkSelect({
  value,
  options,
  onChange,
  style,
  'aria-label': ariaLabel
}: {
  value: string
  options: DarkSelectOption[]
  onChange: (value: string) => void
  style?: CSSProperties
  'aria-label'?: string
}) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [menuRect, setMenuRect] = useState<{ top: number; left: number; width: number } | null>(
    null
  )
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const selected = options.find((option) => option.value === value)

  useLayoutEffect(() => {
    if (!open || !rootRef.current) {
      setMenuRect(null)
      return
    }
    const update = () => {
      const rect = rootRef.current?.getBoundingClientRect()
      if (!rect) return
      setMenuRect({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 160)
      })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
        style={{
          ...selectStyle,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          textAlign: 'left'
        }}
      >
        <span>{selected?.label ?? value}</span>
        <span style={{ opacity: 0.65, fontSize: 10, lineHeight: 1 }}>▼</span>
      </button>
      {open && menuRect
        ? createPortal(
            <ul
              ref={menuRef}
              role="listbox"
              style={{
                position: 'fixed',
                zIndex: 1000,
                top: menuRect.top,
                left: menuRect.left,
                width: menuRect.width,
                margin: 0,
                padding: 4,
                listStyle: 'none',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.14)',
                background: '#15182b',
                boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
                maxHeight: 240,
                overflow: 'auto'
              }}
            >
              {options.map((option) => {
                const active = option.value === value
                const isHovered = hovered === option.value
                return (
                  <li key={option.value} role="option" aria-selected={active}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(option.value)
                        setOpen(false)
                      }}
                      onMouseEnter={() => setHovered(option.value)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        border: 'none',
                        borderRadius: 6,
                        background: active
                          ? '#4f46e5'
                          : isHovered
                            ? 'rgba(255,255,255,0.08)'
                            : 'transparent',
                        color: '#e7e9f4',
                        fontSize: 13,
                        fontWeight: 500,
                        fontFamily: 'inherit',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      {option.label}
                    </button>
                  </li>
                )
              })}
            </ul>,
            document.body
          )
        : null}
    </div>
  )
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

interface MaterialPreset {
  id: string
  label: string
  color?: string
  material: MaterialConfig
}

const MATERIAL_PRESETS: MaterialPreset[] = [
  {
    id: 'stainless-steel',
    label: 'Stainless steel',
    color: '#c5cad3',
    material: {
      metallic: 1,
      roughness: 0.22,
      clearcoat: 0.25,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.25
    }
  },
  {
    id: 'plastic',
    label: 'Plastic',
    material: {
      metallic: 0,
      roughness: 0.38,
      clearcoat: 0.55,
      clearcoatRoughness: 0.22,
      envMapIntensity: 0.9
    }
  },
  {
    id: 'bottle-glass',
    label: 'Bottle glass',
    color: '#2f8f6b',
    material: {
      glassEffect: true,
      roughness: 0.06,
      thickness: 1.1,
      transmission: 1,
      ior: 1.52,
      envMapIntensity: 1.6
    }
  },
  {
    id: 'chrome',
    label: 'Chrome',
    color: '#e8eaf0',
    material: {
      metallic: 1,
      roughness: 0.04,
      envMapIntensity: 1.8
    }
  },
  {
    id: 'brushed-aluminum',
    label: 'Brushed aluminum',
    color: '#b8bec8',
    material: {
      metallic: 1,
      roughness: 0.42,
      envMapIntensity: 1.1
    }
  },
  {
    id: 'gold',
    label: 'Gold',
    color: '#d4a017',
    material: {
      metallic: 1,
      roughness: 0.28,
      clearcoat: 0.35,
      clearcoatRoughness: 0.18,
      envMapIntensity: 1.35
    }
  },
  {
    id: 'copper',
    label: 'Copper',
    color: '#b87333',
    material: {
      metallic: 1,
      roughness: 0.32,
      envMapIntensity: 1.2
    }
  },
  {
    id: 'rubber',
    label: 'Rubber',
    color: '#2a2a2e',
    material: {
      metallic: 0,
      roughness: 0.92,
      envMapIntensity: 0.4
    }
  },
  {
    id: 'ceramic',
    label: 'Ceramic',
    color: '#f2efe8',
    material: {
      metallic: 0,
      roughness: 0.28,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1
    }
  },
  {
    id: 'matte-paint',
    label: 'Matte paint',
    material: {
      metallic: 0,
      roughness: 0.85,
      envMapIntensity: 0.55
    }
  },
  {
    id: 'car-paint',
    label: 'Car paint',
    material: {
      metallic: 0.15,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.4
    }
  },
  {
    id: 'frosted-glass',
    label: 'Frosted glass',
    material: {
      glassEffect: true,
      roughness: 0.45,
      thickness: 0.7,
      transmission: 0.9,
      ior: 1.45,
      envMapIntensity: 1.1
    }
  },
  {
    id: 'crystal',
    label: 'Crystal',
    color: '#dcefff',
    material: {
      glassEffect: true,
      roughness: 0.02,
      thickness: 1.8,
      transmission: 1,
      ior: 2.0,
      envMapIntensity: 2
    }
  },
  {
    id: 'neon',
    label: 'Neon',
    color: '#22d3ee',
    material: {
      metallic: 0.2,
      roughness: 0.25,
      emissive: '#22d3ee',
      emissiveIntensity: 2.2,
      envMapIntensity: 0.8
    }
  }
]

function toDraft(datum: Pick<ChartDatum, 'color' | 'material'>): MaterialDraft {
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

function draftFromPreset(preset: MaterialPreset, fallbackColor: string): MaterialDraft {
  return toDraft({
    color: preset.color ?? fallbackColor,
    material: preset.material
  })
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

function materialsEqual(a: MaterialConfig, b: MaterialConfig): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]) as Set<keyof MaterialConfig>
  for (const key of keys) {
    if (a[key] !== b[key]) return false
  }
  return true
}

function resolvePresetId(datum: Pick<ChartDatum, 'color' | 'material'>): string {
  const current = fromDraft(toDraft(datum))
  const match = MATERIAL_PRESETS.find((preset) => {
    const presetDraft = draftFromPreset(preset, current.color)
    const next = fromDraft(presetDraft)
    if (!materialsEqual(current.material, next.material)) return false
    if (preset.color && preset.color.toLowerCase() !== current.color.toLowerCase()) {
      return false
    }
    return true
  })
  return match?.id ?? 'custom'
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

interface MaterialEditorProps {
  datum: ChartDatum
  onChange: (next: { color: string; material: MaterialConfig }) => void
  onCancel: () => void
  onOk: () => void
}

function MaterialEditor({ datum, onChange, onCancel, onOk }: MaterialEditorProps) {
  const [draft, setDraft] = useState(() => toDraft(datum))
  const [presetId, setPresetId] = useState(() => resolvePresetId(datum))

  const applyDraft = (next: MaterialDraft) => {
    setDraft(next)
    onChange(fromDraft(next))
  }

  const update = <K extends keyof MaterialDraft>(key: K, value: MaterialDraft[K]) => {
    setPresetId('custom')
    setDraft((prev) => {
      const next = { ...prev, [key]: value }
      onChange(fromDraft(next))
      return next
    })
  }

  const applyPreset = (id: string) => {
    setPresetId(id)
    if (id === 'custom') return
    const preset = MATERIAL_PRESETS.find((item) => item.id === id)
    if (!preset) return
    applyDraft(draftFromPreset(preset, draft.color))
  }

  return (
    <div style={tableCardStyle}>
      <button
        type="button"
        style={{ ...buttonStyle, marginBottom: 14 }}
        onClick={onOk}
      >
        ← Back to table
      </button>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: '#c3c8e6' }}>
        Material — {datum.label ?? datum.id}
      </div>
      <p style={{ color: '#8b91b5', fontSize: 13, marginBottom: 18 }}>
        Changes apply to the chart immediately. Cancel restores the previous values.
      </p>

      <div style={fieldStyle}>
        <label style={labelStyle}>Preset</label>
        <DarkSelect
          aria-label="Material preset"
          style={{ width: '100%', display: 'block' }}
          value={presetId}
          onChange={applyPreset}
          options={[
            { value: 'custom', label: 'Custom' },
            ...MATERIAL_PRESETS.map((preset) => ({
              value: preset.id,
              label: preset.label
            }))
          ]}
        />
      </div>

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
        <button type="button" style={primaryButtonStyle} onClick={onOk}>
          Ok
        </button>
      </div>
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

function cloneDatum(datum: ChartDatum): ChartDatum {
  return {
    ...datum,
    material: datum.material ? { ...datum.material } : undefined
  }
}

export function App() {
  const [tab, setTab] = useState<TabId>('pie')
  const [environment, setEnvironment] = useState<EnvironmentPreset>('sunset')
  const [autoRotate, setAutoRotate] = useState(true)
  const [selected, setSelected] = useState<string>('—')
  const [pieData, setPieData] = useState(initialPieData)
  const [barData, setBarData] = useState(initialBarData)
  const [pieActive, setPieActive] = useState<number | null>(null)
  const [barActive, setBarActive] = useState<number | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editSnapshot, setEditSnapshot] = useState<ChartDatum | null>(null)

  const data = tab === 'pie' ? pieData : barData
  const activeIndex = tab === 'pie' ? pieActive : barActive
  const editingDatum = editIndex != null ? data[editIndex] : null

  const setActive = (index: number | null) => {
    if (tab === 'pie') setPieActive(index)
    else setBarActive(index)
  }

  const updateDatumAt = (
    index: number,
    next: Partial<Pick<ChartDatum, 'color' | 'material'>>
  ) => {
    const updater = (items: ChartDatum[]) =>
      items.map((item, i) => (i === index ? { ...item, ...next } : item))
    if (tab === 'pie') setPieData(updater)
    else setBarData(updater)
  }

  const startEdit = (index: number) => {
    if (editIndex === index) return
    setEditSnapshot(cloneDatum(data[index]))
    setEditIndex(index)
  }

  const handleItemClick = (datum: ChartDatum, index: number) => {
    setSelected(`${datum.label} (${datum.value})`)
    if (editIndex != null) startEdit(index)
  }

  const closeEdit = () => {
    setEditIndex(null)
    setEditSnapshot(null)
  }

  const cancelEdit = () => {
    if (editIndex != null && editSnapshot) {
      updateDatumAt(editIndex, {
        color: editSnapshot.color,
        material: editSnapshot.material
      })
    }
    closeEdit()
  }

  const switchTab = (next: TabId) => {
    if (next === tab) return
    if (editIndex != null && editSnapshot) {
      updateDatumAt(editIndex, {
        color: editSnapshot.color,
        material: editSnapshot.material
      })
    }
    closeEdit()
    setTab(next)
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
          <button type="button" style={tabStyle(tab === 'pie')} onClick={() => switchTab('pie')}>
            PieChart3D
          </button>
          <button type="button" style={tabStyle(tab === 'bar')} onClick={() => switchTab('bar')}>
            BarChart3D
          </button>
        </div>
      </div>

      <div style={panelStyle}>
        <div style={chartCardStyle}>
          <div style={headerStyle}>
            <span>
              {tab === 'pie' ? 'PieChart3D — donut' : 'BarChart3D — rounded bars'}
            </span>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
              />
              Auto-rotate
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
              <span style={{ fontSize: 12, color: '#8b91b5' }}>Environment</span>
              <DarkSelect
                aria-label="Environment"
                value={environment}
                onChange={(next) => setEnvironment(next as EnvironmentPreset)}
                options={ENVIRONMENT_PRESETS.map((preset) => ({
                  value: preset,
                  label: preset
                }))}
                style={{ width: 120 }}
              />
            </label>
          </div>
          <div style={{ flex: 1 }}>
            {tab === 'pie' ? (
              <ChartViewer
                camera={{ position: [4.5, 4, 6], fov: 42 }}
                autoRotate={autoRotate ? { speed: 0.12 } : false}
                environment={environment}
              >
                <PieChart3D
                  data={pieData}
                  innerRadius={0.9}
                  outerRadius={2.1}
                  height={0.7}
                  highlightedIndex={pieActive}
                  onItemClick={handleItemClick}
                  onItemPointerOver={(_, i) => setPieActive(i)}
                  onItemPointerOut={() => setPieActive(null)}
                />
              </ChartViewer>
            ) : (
              <ChartViewer
                camera={{ position: [6, 5, 9], fov: 40, target: [0, 1.2, 0] }}
                autoRotate={autoRotate ? { speed: 0.25 } : false}
                environment={environment}
              >
                <BarChart3D
                  data={barData}
                  maxBarHeight={3.2}
                  hover={{ scale: 1.1, emissiveIntensity: 0.35 }}
                  tooltip={{ showPercent: false }}
                  highlightedIndex={barActive}
                  onItemClick={handleItemClick}
                  onItemPointerOver={(_, i) => setBarActive(i)}
                  onItemPointerOut={() => setBarActive(null)}
                />
              </ChartViewer>
            )}
          </div>
          <ChartLegend
            items={data}
            activeIndex={activeIndex}
            onItemClick={handleItemClick}
            onItemOver={(_, i) => setActive(i)}
            onItemOut={() => setActive(null)}
            style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}
          />
        </div>

        {editingDatum && editIndex != null && editSnapshot ? (
          <MaterialEditor
            key={`${tab}-${editIndex}`}
            datum={editSnapshot}
            onChange={(next) => updateDatumAt(editIndex, next)}
            onCancel={cancelEdit}
            onOk={closeEdit}
          />
        ) : (
          <DataTable
            data={data}
            activeIndex={activeIndex}
            onEdit={startEdit}
            onRowOver={setActive}
            onRowOut={() => setActive(null)}
          />
        )}
      </div>
    </div>
  )
}
