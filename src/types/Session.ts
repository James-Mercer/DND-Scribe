import ScribeObject from './ScribeObject'

export default class Session extends ScribeObject{
  static typeName: string = 'session'
  description: string = ""
  date: Date = new Date()
  length: string = "" //format xxh xxm
  events: Array<string> = []

  constructor(name: string)
  {
    super(name)
    this.type = Session.typeName
  }

}