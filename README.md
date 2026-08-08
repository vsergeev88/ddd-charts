# ddd-charts

Highly customizable **3D charts for React**, built on top of [three.js](https://threejs.org/) and [@react-three/fiber](https://github.com/pmndrs/react-three-fiber).

Physically-based materials (metal, glass) on each datum, smooth entrance and hover animations, auto-rotation, orbit controls — with great-looking defaults out of the box.

- 🥧 `PieChart3D` — pie / donut charts with extruded, beveled slices
- 📊 `BarChart3D` — rounded 3D bars
- 🖼 `ChartViewer` — batteries-included canvas: camera, lights, environment, shadows, controls
- 🧊 Material system: color, metalness, roughness, glass (transmission / thickness / IOR), clearcoat, emissive
- 🎬 Entrance animations with stagger and easing, hover explode/scale effects
- 💬 Hover tooltips (popovers) with fully custom rendering
- 🏷 `ChartLegend` — HTML legend with two-way hover sync via `highlightedIndex`
- 🌳 Tree-shakable ESM + CJS builds, full TypeScript types
- 🆓 MIT licensed

**[Live Demo](https://ddd-charts.netlify.app/)**

## Installation

```bash
npm install ddd-charts three @react-three/fiber
```

`react`, `react-dom`, `three` and `@react-three/fiber` are peer dependencies. `@react-three/drei` is installed automatically.

## Quick start

```tsx
import { ChartViewer, PieChart3D } from 'ddd-charts'

const data = [
  { label: 'Design', value: 28 },
  { label: 'Development', value: 42 },
  { label: 'QA', value: 14 },
  { label: 'Ops', value: 16 }
]

export function Dashboard() {
  return (
    <div style={{ width: '100%', height: 500 }}>
      <ChartViewer camera={{ position: [5, 4, 7] }} autoRotate>
        <PieChart3D data={data} />
      </ChartViewer>
    </div>
  )
}
```

The viewer fills its parent element, so give the wrapper an explicit size.

## Materials

Appearance is configured **on each data item** via optional `color` and `material` fields — not through a separate chart prop:

```tsx
const data = [
  {
    label: 'Design',
    value: 28,
    color: '#38bdf8',
    material: { metallic: 0.85, roughness: 0.25, clearcoat: 1 }
  },
  {
    label: 'Development',
    value: 42,
    color: '#fbbf24',
    material: { metallic: 0.7, roughness: 0.3, clearcoat: 0.8 }
  },
  {
    label: 'QA',
    value: 14,
    color: '#f87171',
    material: { glassEffect: true, thickness: 0.8, ior: 1.45 }
  }
]

<PieChart3D data={data} innerRadius={0.9} />
```

Items without `color` fall back to the built-in palette. Omit `material` to keep the default PBR look (`metallic: 0.1`, `roughness: 0.35`).

### Material options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `string` | palette color | hex / rgb / named CSS color |
| `metallic` | `number` | `0.1` | metalness, 0–1 |
| `roughness` | `number` | `0.35` (`0.05` for glass) | surface roughness, 0–1 |
| `glassEffect` | `boolean` | `false` | enables transmissive glass preset |
| `transmission` | `number` | `0` (`1` for glass) | light transmission, 0–1 |
| `thickness` | `number` | `0.5` | refraction volume thickness |
| `ior` | `number` | `1.5` | index of refraction |
| `opacity` | `number` | `1` | alpha (auto-enables transparency) |
| `emissive` / `emissiveIntensity` | `string` / `number` | `#000` / `0` | self-illumination (HDR when intensity > 0) |
| `clearcoat` / `clearcoatRoughness` | `number` | `0` / `0.1` | lacquer layer |
| `envMapIntensity` | `number` | `1` (`1.5` for glass) | environment reflections strength |
| `flatShading` | `boolean` | `false` | faceted look |

> Glass materials look their best with an environment map — `ChartViewer` enables the `city` preset by default.
>
> Neon / glow materials need `ChartViewer` `bloom` enabled and `emissiveIntensity >= 1` (that unlocks HDR / non-tone-mapped output for the bloom pass). Prefer a darker base `color`, strong `emissive`, and a dark `background`. Soft hover emissive stays below that threshold and will not bloom.

## ChartViewer

```tsx
<ChartViewer
  camera={{ position: [5, 4, 7], fov: 45, target: [0, 0.5, 0] }}
  autoRotate={{ speed: 0.5 }}
  controls={{ enablePan: false, minDistance: 3, maxDistance: 20 }}
  environment="sunset"
  lighting={{ ambientIntensity: 0.4, directionalIntensity: 1.6 }}
  shadows
  contactShadows={{ opacity: 0.5, blur: 2 }}
  bloom
  background="#0b0d1a"
>
  <PieChart3D data={data} />
</ChartViewer>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `camera` | `CameraConfig` | `{ position: [5,4,7], fov: 45 }` | position, fov, near, far, zoom, target |
| `autoRotate` | `boolean \| { speed }` | `false` | rotates the whole chart, speed in rad/s |
| `controls` | `boolean \| ControlsConfig` | `true` | OrbitControls: pan / zoom / rotate, distance and angle limits |
| `environment` | preset name \| `false` | `'city'` | HDRI environment for reflections |
| `lighting` | `LightingConfig \| false` | soft key + fill | ambient and directional lights |
| `shadows` | `boolean` | `true` | shadow map rendering |
| `contactShadows` | `boolean \| config` | `true` | soft blob shadow under the chart |
| `bloom` | `boolean \| BloomConfig` | `false` | post-process bloom for HDR emissive / neon materials |
| `background` | `string` | transparent | canvas clear color |
| `canvasProps` | `CanvasProps` | — | escape hatch to the underlying R3F `<Canvas>` |

## PieChart3D

```tsx
<PieChart3D
  data={data}
  innerRadius={0.9}      // > 0 makes a donut
  outerRadius={2}
  height={0.6}
  padAngle={0.02}        // gap between slices, radians
  startAngle={Math.PI / 2}
  bevelSize={0.02}
  animation={{ duration: 1, stagger: 0.1, easing: 'easeOutBack' }}
  hover={{ explode: 0.25 }}
  onItemClick={(datum, index) => console.log(datum.label)}
/>
```

## BarChart3D

```tsx
<BarChart3D
  data={data}
  barWidth={0.6}
  barDepth={0.6}
  gap={0.35}
  maxBarHeight={3}       // tallest bar height in world units
  maxValue={100}         // optional fixed scale, defaults to max(data)
  radius={0.06}          // corner rounding
  animation={{ stagger: 0.06 }}
  hover={{ scale: 1.1, emissiveIntensity: 0.35 }}
  onItemClick={(datum, index) => console.log(datum.label)}
/>
```

## Tooltips (popovers)

Hovering an item shows a popover with its label, value and share. Enabled by default — pass `tooltip={false}` to turn it off, or a config to customize:

```tsx
<PieChart3D
  data={data}
  tooltip={{
    showPercent: true,
    showValue: true,
    offset: [0, 0.5, 0],          // world-space offset from the item's anchor
    style: { background: '#1d244d' },
    // or take over rendering completely:
    render: (datum, index, fraction) => (
      <div className="my-tooltip">
        {datum.label}: {datum.value} ({Math.round(fraction * 100)}%)
      </div>
    )
  }}
/>
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | show tooltip on hover |
| `showValue` / `showPercent` | `boolean` | `true` | parts of the default content |
| `offset` | `[x, y, z]` | `[0, 0.35, 0]` | anchor offset in world units |
| `distanceFactor` | `number` | — | scale tooltip with camera distance |
| `className` / `style` | — | — | styling of the default panel |
| `render` | `(datum, index, fraction) => ReactNode` | — | fully custom content |

For pie charts `fraction` is the slice share; for bar charts it is the bar's share of the series total.

## Legend

`ChartLegend` is a plain HTML component — place it anywhere near the chart. Pass the same `data` so swatch colors match (`color` / `material` on each item):

```tsx
import { useState } from 'react'
import { ChartViewer, PieChart3D, ChartLegend } from 'ddd-charts'

function Chart() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <>
      <ChartViewer autoRotate>
        <PieChart3D
          data={data}
          highlightedIndex={active}
          onItemPointerOver={(_, i) => setActive(i)}
          onItemPointerOut={() => setActive(null)}
        />
      </ChartViewer>
      <ChartLegend
        items={data}
        activeIndex={active}
        onItemOver={(_, i) => setActive(i)}
        onItemOut={() => setActive(null)}
      />
    </>
  )
}
```

Hovering a legend item highlights the matching segment (hover effect + tooltip) through the chart's `highlightedIndex` prop, and hovering the chart highlights the legend item — full two-way sync.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `ChartDatum[]` | — | same data array as the chart |
| `direction` | `'row' \| 'column'` | `'row'` | layout |
| `showValues` | `boolean` | `true` | show values next to labels |
| `activeIndex` | `number \| null` | `null` | highlighted item, dims the rest |
| `onItemOver` / `onItemOut` / `onItemClick` | `(datum, index) => void` | — | interaction callbacks |
| `renderItem` | `(datum, index, color) => ReactNode` | — | fully custom item rendering |
| `className` / `style` | — | — | container styling |

## Animations and interactivity

Both charts share the same options:

- `animation` — `boolean` or `{ enabled, duration, delay, stagger, easing }` where easing is one of `linear`, `easeOutCubic`, `easeInOutCubic`, `easeOutBack`, `easeOutElastic`.
- `hover` — `boolean` or `{ enabled, scale, explode, emissive, emissiveIntensity, speed }`. Pie slices explode outward, bars scale up; both get an emissive highlight.
- `tooltip` — `boolean` or `TooltipConfig` (see above).
- `highlightedIndex` — controlled highlight: the item behaves as hovered (effect + tooltip). Useful for legend or external UI sync.
- `onItemClick`, `onItemPointerOver`, `onItemPointerOut` — receive `(datum, index)`.

## Standalone usage (your own Canvas)

The chart components are plain react-three-fiber components — drop them into any existing `<Canvas>`. `ChartStage` optionally brings the viewer's lights / environment / controls / auto-rotation without the canvas:

```tsx
import { Canvas } from '@react-three/fiber'
import { BarChart3D, ChartStage } from 'ddd-charts'

<Canvas shadows camera={{ position: [6, 5, 9] }}>
  <ChartStage autoRotate environment="studio">
    <BarChart3D data={data} />
  </ChartStage>
  {/* ...the rest of your scene */}
</Canvas>
```

## Development

```bash
npm install
npm run dev    # demo playground (examples/)
npm test       # vitest
npm run build  # ESM + CJS + .d.ts into dist/
```

> Note for Windows: run commands from a path with an uppercase drive letter (`C:\...`), otherwise Vitest fails to collect tests ([vitest#5251](https://github.com/vitest-dev/vitest/issues/5251)).

## Roadmap

- 3D axis labels
- Line / area 3D charts
- Axes and grid helpers

## License

[MIT](./LICENSE)
