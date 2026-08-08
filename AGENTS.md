# AGENTS.md — ddd-charts

## Что это

Библиотека **3D-чартов для React** на [three.js](https://threejs.org/) и [@react-three/fiber](https://github.com/pmndrs/react-three-fiber). Публичный пакет: `ddd-charts` (MIT).

Экспорты:

- `PieChart3D` — pie / donut с bevel
- `BarChart3D` — rounded 3D bars
- `ChartViewer` / `ChartStage` — canvas + сцена (камера, свет, env, shadows, controls, auto-rotate)
- `ChartLegend`, `ChartTooltip`
- система материалов (`ChartMaterial`, `resolveMaterialConfig`) — metal / glass / PBR

Peer deps: `react`, `react-dom`, `three`, `@react-three/fiber`. Runtime-зависимость: `@react-three/drei`.

## Структура

```
src/
  components/          # ChartViewer, PieChart3D, BarChart3D, ChartLegend, ChartTooltip
  components/materials/# ChartMaterial, resolveMaterial
  hooks/               # useChartItemAnimation
  types/               # публичные типы (ChartDatum, MaterialConfig, ...)
  utils/               # colors, pie, geometry, easings, normalize
  __tests__/           # vitest
  index.ts             # публичный API
examples/              # demo playground (vite.demo.config.ts)
```

Сборка: Vite → ESM + CJS + `.d.ts` в `dist/`. `sideEffects: false` — дерево-шейкабельно.

## Команды

```bash
npm install
npm run dev      # демо (examples/)
npm test         # vitest run
npm run build    # tsc --noEmit + vite build
```

На Windows запускай из пути с **заглавной** буквой диска (`C:\...`), иначе Vitest может не найти тесты ([vitest#5251](https://github.com/vitest-js/vitest/issues/5251)).

## Конвенции для агентов

- Публичный API меняй осознанно: всё, что реэкспортируется из `src/index.ts`, — контракт пакета. Типы — в `src/types/`.
- Чарт-компоненты — R3F-сцены; HTML-оверлеи (`ChartLegend`, tooltip) живут рядом, не внутри mesh без необходимости.
- Материалы: единый `materials` prop — объект | массив | функция; per-datum `color` / `material` имеют приоритет. Резолв — через `resolveMaterialConfig`.
- Общие опции анимации / hover / tooltip нормализуй через `src/utils/normalize.ts`, не дублируй логику в чартах.
- Демо и примеры — в `examples/`; не раздувай README без нужды (подробности API уже там).
- Не коммить `dist/` как исходники разработки; публикуется только `dist` (`files` в package.json).
- Не добавляй комментарии в код без явной просьбы.
- Не гоняй линтер и не чини линтер-ошибки без запроса.

## Roadmap (контекст)

Планируется: 3D axis labels, line/area 3D, axes/grid helpers. Не реализовывай их «заодно», если об этом не просили.
