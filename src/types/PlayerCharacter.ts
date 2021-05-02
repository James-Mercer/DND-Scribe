import NonPlayerCharacter from './NonPlayerCharacter'
import ScribeObject from './ScribeObject'

export default class PlayerCharacter extends NonPlayerCharacter {
  static typeName = 'PC'

  characterClass: string
  level = 1

  constructor (name: string, race?: string, age?: number, characterClass?: string, level?: number) {
    super(name)
    this.characterClass = characterClass || ''
    this.level = level || 0
    this.type = PlayerCharacter.typeName
  }
}
