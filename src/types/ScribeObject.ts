import { ScribeTypeName, scribeTypeName } from './typeUtils'
import { v4 as uuidV4 } from 'uuid'
import Delta from 'quill-delta'
import { IdType } from 'vis-network/peer'

export class ScribeLink {
  id: IdType
  to: string
  from: string
  label = '' // label displayed on the graph

  constructor (to: string, from: string, label?: string) {
    this.id = to + '_' + from
    this.to = to
    this.from = from
    this.label = label || ''
  }
}

export default class ScribeObject {
  static typeName: ScribeTypeName = scribeTypeName
  name: string
  id: IdType
  type: ScribeTypeName = ScribeObject.typeName // Store the type so we can reconstruct objects to the correct types
  portrait: string | undefined
  links: Array<ScribeLink> = []
  tagIds: Set<number> = new Set<number>()
  content: Delta = new Delta()

  constructor (name: string) {
    this.name = name
    this.id = uuidV4()
  }
}
