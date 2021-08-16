const MaterialColors = [
  'red',
  'pink',
  'purple',
  'indigo',
  'blue',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'light-green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'deep-orange',
  'brown',
  'blue-grey',
  'grey'
]
const ColorModifiers = ['lighten', 'accent', 'darken']

export default class Tag {
  static instanceCount = 0
  id: number = Tag.instanceCount++
  label: string
  color: string

  constructor (label: string) {
    this.label = label
    this.color = Tag.randomColor()
  }

  static randomColor () {
    return `${
      MaterialColors[Math.round(Math.random() * MaterialColors.length)]
    } ${
      // ignore darken
      ColorModifiers[Math.round(Math.random() * ColorModifiers.length - 1)]
    }-${Math.round(Math.random() * 4)}`
  }
}
