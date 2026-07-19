/** Палитра Motion-экрана. Петроль WGSN 2026 + один тёплый акцент. */
export const C = {
  abyss: '#071316',
  panel: '#0E2226',
  border: 'rgba(127,178,174,0.16)',
  petrol: '#1F5C63',
  deepOcean: '#003B5C',
  seaGlass: '#7FB2AE',
  chalk: '#E3E6E4',
  dim: 'rgba(227,230,228,0.6)',
  ember: '#E2725B',
} as const

export const EASE = [0.22, 0.61, 0.36, 1] as const
/** ease-out-expo — для наезда камеры и раскрытия занавеса. */
export const EXPO = [0.16, 1, 0.3, 1] as const

export const DISPLAY = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const
export const MONO = { fontFamily: "'Geist Mono', ui-monospace, monospace" } as const
