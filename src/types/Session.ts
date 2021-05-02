import ScribeObject from './ScribeObject'

export default class Session extends ScribeObject {
  static typeName = 'session'
  description = ''
  date: Date = new Date()
  length = '' // format xxh xxm
  events: Array<string> = []

  constructor (name: string) {
    super(name)
    this.type = Session.typeName
  }
}
