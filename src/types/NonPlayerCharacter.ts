import ScribeObject from '@/types/ScribeObject';
export default class NonPlayerCharacter extends ScribeObject{
  static typeName: string = "NPC"

  race = 'unknown'
  age: number

  constructor(name: string, race?: string, age?: number) {
    super(name)
    this.race = race || ""
    this.age = age || 0
    this.type = NonPlayerCharacter.typeName
  }
}