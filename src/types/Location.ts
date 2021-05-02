import ScribeObject from './ScribeObject'

export default class Location extends ScribeObject {
  static typeName = 'Location'
  constructor (name: string) {
    super(name)
    this.type = Location.typeName
  }
}
