import ScribeObject  from '@/types/ScribeObject'
import Session from '@/types/Session'
import PlayerCharacter from './PlayerCharacter'
import NonPlayerCharacter from './NonPlayerCharacter'
import Location from './Location'

export default class Campaign {
  title: string
  objectUuidMap: Map<string, ScribeObject> = new Map()

  //All the things a campaign contains
  sessions: Array<Session> = []
  playerCharacters: Array<PlayerCharacter> = []
  nonPlayerCharacters: Array<NonPlayerCharacter> = []
  locations: Array<Location> = []

  constructor (title: string) {
    this.title = title
  }
  addObject(newObject: ScribeObject): void {
    console.log(newObject)
    let added: Boolean = false
    if (newObject.type === Session.typeName)
    {
      this.sessions.push(newObject as Session)
      added = true
    }
    else if (newObject.type === PlayerCharacter.typeName)
    {
      this.playerCharacters.push(newObject as PlayerCharacter)
      added = true
    }
    else if (newObject.type === NonPlayerCharacter.typeName){
      this.nonPlayerCharacters.push(newObject as NonPlayerCharacter)
      added = true
    }
    if(added)
      this.objectUuidMap.set(newObject.id, newObject)
    console.log(added)
  }

  hasObject(id: string): boolean {
    let index: number = this.sessions.findIndex( (s, i) => { return id === s.id} )
    if(index > -1) {
      return true
    }
    index = this.playerCharacters.findIndex( (s, i) => { return id === s.id} )
    if(index > -1){
      return true
    }
    return index > -1;
  }

  findObject(id: string): ScribeObject|undefined {
    let object: ScribeObject|undefined = this.sessions.find( (s, i) => { return id === s.id })
    if(!object){
      object = this.playerCharacters.find((pc, i) => { return id === pc.id })
    }
    if(!object){
      object = this.nonPlayerCharacters.find((npc,i) => { return id === npc.id})
    }
    return object
  }

  removeObject(id: string): boolean {
    let index = this.sessions.findIndex((s,i) => { return id === s.id})
    if(index > -1) { 
      this.sessions.splice(index, 1)
      return true
    }
    index = this.playerCharacters.findIndex((pc, i) => { return id === pc.id})
    if(index > -1) {
      this.playerCharacters.splice(index, 1)
      return true
    }
    index = this.nonPlayerCharacters.findIndex((npc, i) => { return id === npc.id})
    if(index > -1) {
      this.nonPlayerCharacters.splice(index, 1)
      return true
    }
    return false
  }
}


