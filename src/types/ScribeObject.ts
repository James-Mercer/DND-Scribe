import { v4 as uuidV4 } from 'uuid'

export default class ScribeObject {
  static typeName = 'ScribeObject'
  name: string
  id: string
  type: string

  constructor (name: string) {
    this.name = name
    this.id = uuidV4()
    this.type = ScribeObject.typeName
  }
}
