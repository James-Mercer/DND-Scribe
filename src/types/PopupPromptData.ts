import { TouchBarScrubber } from 'electron'

export default class PopupPromptInfo {
  private x: number
  private y: number
  private visible: boolean

  private targetID: string
  private targetType: string

  constructor () {
    this.x = 0
    this.y = 0
    this.visible = false
    this.targetID = ''
    this.targetType = ''
  }

  getX (): number { return this.x }
  getY (): number { return this.y }
  getVisible (): boolean { return this.visible }
  getTargetID (): string { return this.targetID }
  getTargetType (): string { return this.targetType }

  setX (x: number) { this.x = x }
  setY (y: number) { this.y = y }
  setPosition (x: number, y: number) {
    this.x = x
    this.y = y
  }

  setVisible (visible: boolean) { this.visible = visible }
  setTargetData (id: string, type: string) {
    this.targetID = id
    this.targetType = type
  }
}
