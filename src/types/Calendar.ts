export class Month {
  name: string
  order: number
  length: number

  constructor (name: string, order: number, length: number) {
    this.name = name
    this.order = order
    this.length = length
  }
}

export default class Calendar {
  weekLength: number
  monthLength: number | undefined
  yearLength: number
  months: Array<Month> | undefined

  constructor (
    weekLength: number,
    months: Array<Month> | number,
    yearLength: number
  ) {
    this.weekLength = weekLength
    if (typeof months === 'number') {
      this.monthLength = months
    } else if (typeof months === 'object') {
      this.months = months
    }
    this.yearLength = yearLength
  }
}
