import { ScribeObject } from './ScribeObject'

export default class ScribeTree {
    file: string;
    objects: Map<string, ScribeObject> = new Map()

    constructor (file: string) {
      this.file = file
    }

    parseFile () {

    }
}
