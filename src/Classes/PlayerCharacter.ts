import { ScribeObject } from './ScribeObject'

export class PlayerCharacter extends ScribeObject {
  name: string
  race = 'unknown'
  age: number
  characterClass: string
  level = 1

  constructor (name: string, race: string, age: number, characterClass: string, level: number) {
    super()
    this.name = name
    this.race = race
    this.age = age
    this.characterClass = characterClass
    this.level = level
  }
}
