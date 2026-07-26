export const DEFAULT_PALETTE = [
  '#6366f1',
  '#22d3ee',
  '#f472b6',
  '#34d399',
  '#fbbf24',
  '#a78bfa',
  '#fb7185',
  '#4ade80',
  '#38bdf8',
  '#f97316'
]

export function getPaletteColor(index: number, palette: string[] = DEFAULT_PALETTE): string {
  return palette[index % palette.length]
}
