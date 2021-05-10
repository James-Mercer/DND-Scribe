import ScribeObject from '@/types/ScribeObject';

interface IndexSignature {
    [k: string]: any
}

/** 
 * Trick vue reactiviy to be able to react to changes in maps by wrapping it in this class
*/
export default class ReactiveMap  extends Object implements IndexSignature {
  [k: string]: any
  count: number

  constructor() {
    super()
    this.count = 0
  }

  has(id: string): boolean {
    return this[id] !== undefined
  }

  get(id: string): ScribeObject | undefined {
    return this[id]
  }

  set(obj: ScribeObject): void {
    this[obj.id] = obj
    this.count += 1
  }

  delete(id: string) {
    if(this[id] !== undefined){
      delete this[id]
    }
    this.count -= 1
  }

  forEach(callbackfn: (value: ScribeObject) => void, thisArg?: any): void {
    const entries: string[] = Object.keys(this)
    entries.forEach((entry) => {
      if(this[entry])
        callbackfn(this[entry])
    })
  }

  copyPropsFromObject(obj: ReactiveMap) {
    const entries: string[] = Object.keys(obj)
    entries.forEach((entry) => {
      this[entry] = obj[entry]
      this.count += 1
    })
  }

  clear(): void {
    const entries: string[] = Object.keys(this)
    entries.forEach((entry) => {
      if(this[entry])
        delete this[entry]
    })
    this.count = 0
  }

  size(): number {
    return this.count
  }
}

function readProp ( obj: ReactiveMap, id: string): any {
  return obj[id]
}