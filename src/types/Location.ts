import { LocationTypeName, locationTypeName } from './typeUtils'
import ScribeObject from './ScribeObject'

export default class Location extends ScribeObject {
  static typeName: LocationTypeName = locationTypeName

  constructor (name: string) {
    super(name)
    this.type = Location.typeName
  }
}
