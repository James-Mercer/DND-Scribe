import ScribeObject from '@/types/ScribeObject'

interface IndexSignature {
  [k: string]: any;
}

/**
 * Trick vue reactiviy to be able to react to changes in maps by wrapping it in this class
 */
export default class ReactiveMap extends Object implements IndexSignature {
  [k: string]: any

  constructor () {
    super()
  }

  has (id: string): boolean {
    return this[id] !== undefined
  }

  get (id: string): ScribeObject | undefined {
    return this[id]
  }

  set (obj: ScribeObject): void {
    this[obj.id] = obj
  }

  delete (id: string) {
    if (this[id] !== undefined) {
      delete this[id]
    }
  }

  forEach (callbackfn: (value: ScribeObject) => void, thisArg?: any): void {
    const entries: string[] = Object.keys(this)
    entries.forEach(entry => {
      if (this[entry]) {
        if (entry !== 'count') {
          callbackfn(this[entry])
        }
      }
    })
  }

  filter (filterFn: (value: ScribeObject) => boolean): Array<ScribeObject> {
    const filtered: Array<ScribeObject> = []
    this.forEach((object: ScribeObject) => {
      if (filterFn(object)) {
        filtered.push(object)
      }
    })
    return filtered
  }

  clear (): void {
    const entries: string[] = Object.keys(this)
    entries.forEach(entry => {
      if (this[entry]) delete this[entry]
    })
  }

  size (): number {
    return Object.keys(this).length
  }
}

function readProp (obj: ReactiveMap, id: string): any {
  return obj[id]
}
