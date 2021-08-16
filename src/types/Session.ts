import ScribeObject from './ScribeObject'
import { SessionTypeName, sessionTypeName } from './typeUtils'

export default class Session extends ScribeObject {
  static typeName = sessionTypeName
  static nextSessionNumber = 1 // Not everyone is a programmer, dont count from 0
  static getSessionNumber (): number {
    const num = this.nextSessionNumber
    this.nextSessionNumber += 1
    return num
  }

  sessionNumber: number
  irlStartDate: Date = new Date()
  irlEndDate: Date = new Date()
  igStartDate: Date = new Date()
  igEndDate: Date = new Date()
  type: SessionTypeName

  constructor (name: string, sessionNumber?: number) {
    super(name)
    this.type = Session.typeName
    this.sessionNumber = sessionNumber || Session.getSessionNumber()
  }
}
