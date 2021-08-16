import { CharacterTypeName, characterTypeName } from './typeUtils'
import ScribeObject from './ScribeObject'

export default class Character extends ScribeObject {
  static typeName: CharacterTypeName = characterTypeName

  constructor (name: string) {
    super(name)
    this.type = Character.typeName
  }
}
