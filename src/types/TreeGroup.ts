import ScribeObject from '@/types/ScribeObject'

export default class TreeGroup {
  static typeName = 'TreeGroup'

  id: string
  name: string
  type: string
  children: Array<ScribeObject> = []

  constructor (id: string, name: string) {
    this.id = id
    this.name = name
    this.type = TreeGroup.typeName
  }
}
