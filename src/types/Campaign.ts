import ScribeObject from '@/types/ScribeObject'
import Session from '@/types/Session'
import PlayerCharacter from './PlayerCharacter'
import NonPlayerCharacter from './NonPlayerCharacter'
import Location from './Location'
import TreeGroup from './TreeGroup'

export default interface Campaign {
  title: string
  objectUuidMap: Map<string, ScribeObject>

  /*
  getAllObjectsOfType (type: string): Array<ScribeObject> {
    const items: Array<ScribeObject> = []
    console.log(`getting all of type ${type}`)
    switch (type) {
      case Session.typeName:
        this.sessions.forEach((e: string) => {
          const item: ScribeObject | undefined = this.objectUuidMap.get(e)
          if (item) { items.push(item) }
        })
        break
      case PlayerCharacter.typeName:
        this.playerCharacters.forEach((e: string) => {
          const item: ScribeObject | undefined = this.objectUuidMap.get(e)
          if (item) { items.push(item) }
        })
        break
      case NonPlayerCharacter.typeName:
        this.nonPlayerCharacters.forEach((e: string) => {
          const item: ScribeObject | undefined = this.objectUuidMap.get(e)
          if (item) { items.push(item) }
        })
      case Location.typeName:
        this.locations.forEach((e: string) => {
          const item: ScribeObject | undefined = this.objectUuidMap.get(e)
          if (item) { items.push(item) }
        })
      default:
        console.log('default')
        this.unknownTypes.forEach((e: string) => {
          const item: ScribeObject | undefined = this.objectUuidMap.get(e)
          if (item) { items.push(item) }
        })
        break
    }
    return items
  }

  toTreeView (): Array<TreeGroup> {
    console.log('refresh')
    const items: Array<TreeGroup> = []
    const sessionGroup = new TreeGroup('1', Session.typeName + 's')
    sessionGroup.children = this.getAllObjectsOfType(Session.typeName)
    items.push(sessionGroup)
    const pcGroup = new TreeGroup('2', PlayerCharacter.typeName + 's')
    pcGroup.children = this.getAllObjectsOfType(PlayerCharacter.typeName)
    items.push(pcGroup)
    const npcGroup = new TreeGroup('3', NonPlayerCharacter.typeName + 's')
    npcGroup.children = this.getAllObjectsOfType(NonPlayerCharacter.typeName)
    items.push(npcGroup)
    const locationGroup = new TreeGroup('4', Location.typeName + 's')
    npcGroup.children = this.getAllObjectsOfType(Location.typeName)
    items.push(locationGroup)
    console.log(items)
    return items
  }

  // Adding new objects
  addObject (newObject: ScribeObject): void {
    if (this.objectUuidMap.has(newObject.id)) {
      return
    }
    this.objectUuidMap.set(newObject.id, newObject)
    this.numObjects += 1
    if (newObject.type === Session.typeName) {
      this.sessions.add(newObject.id)
    } else if (newObject.type === PlayerCharacter.typeName) {
      this.playerCharacters.add(newObject.id)
    } else if (newObject.type === NonPlayerCharacter.typeName) {
      this.nonPlayerCharacters.add(newObject.id)
    } else {
      this.unknownTypes.add(newObject.id)
    }
  }

  hasObject (id: string): boolean {
    return this.objectUuidMap.has(id)
  }

  findObject (id: string): ScribeObject|undefined {
    const object: ScribeObject|undefined = this.objectUuidMap.get(id)
    return object
  }

  removeObject (id: string): boolean {
    const object: ScribeObject|undefined = this.objectUuidMap.get(id)
    if (object === undefined) {
      return false
    }
    const deleted: boolean = this.objectUuidMap.delete(id)
    if (object.type === Session.typeName) {
      this.sessions.delete(id)
    } else if (object.type === PlayerCharacter.typeName) {
      this.playerCharacters.delete(id)
    } else if (object.type === NonPlayerCharacter.typeName) {
      this.sessions.delete(id)
    } else if (object.type === Location.typeName) {
      this.locations.delete(id)
    } else {
      this.unknownTypes.delete(id)
    }
    return deleted
  }
  */
}
