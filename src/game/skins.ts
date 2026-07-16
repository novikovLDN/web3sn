export type Skin = {
  name: string
  female: boolean
  skin: string
  hair: string
  shirt: string
  shirt2: string
  pants: string
  shoes: string
}

export const SKINS: Skin[] = [
  {
    name: 'Максим',
    female: false,
    skin: '#d3a17a',
    hair: '#241a12',
    shirt: '#7621b0',
    shirt2: '#b600a8',
    pants: '#26303f',
    shoes: '#161a20',
  },
  {
    name: 'Алекс',
    female: false,
    skin: '#c99a72',
    hair: '#3a2a18',
    shirt: '#1f6bc8',
    shirt2: '#4aa0ff',
    pants: '#2a2f38',
    shoes: '#15181f',
  },
  {
    name: 'Мария',
    female: true,
    skin: '#e2b590',
    hair: '#4a2f1a',
    shirt: '#b6008a',
    shirt2: '#ff5ccb',
    pants: '#33263f',
    shoes: '#20161f',
  },
  {
    name: 'Ника',
    female: true,
    skin: '#d9a884',
    hair: '#171717',
    shirt: '#2fae7a',
    shirt2: '#5cf0b0',
    pants: '#232a30',
    shoes: '#141a17',
  },
]
