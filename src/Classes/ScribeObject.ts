import { v4 as uuidV4 } from 'uuid'

export class ScribeObject {
  UUID: string

  constructor () {
    this.UUID = uuidV4()
  }
}
