import { CommitOptions } from 'vuex';
import ReactiveMap from '@/types/ReactiveMap'
import ScribeObject from '@/types/ScribeObject'

export const defaultCampaignName:string = 'Unnamed Campaign'

export interface PersistantState {
  title: string
  objects: ReactiveMap
  openTabs: Array<string>
  tabIndex: number
}

export class StoreState implements PersistantState{
  filePath: string|undefined

  title: string
  objects: ReactiveMap
  openTabs: Array<string>
  tabIndex: number

  constructor(title?: string, path?: string) {
    this.title = title || defaultCampaignName
    this.filePath = path || undefined
    this.objects = new ReactiveMap()
    this.openTabs = new Array<string>()
    this.tabIndex = -1
  }
}

export interface StoreGetters {
  getTitle (state: StoreState): string
  getObjects (state: StoreState): ReactiveMap
  getOpenTabs (state: StoreState): Array<string>
  getTabIndex (state: StoreState): number
  getCurrentTabObject(state: StoreState): ScribeObject|undefined
  getFilePath(state: StoreState): string|undefined
  getStateToSave(state: StoreState): StoreState
}

export interface addTabPayload {
  id: string
  index?: number
  focus?: boolean
}

export interface loadPayload {
  toLoad: PersistantState
  path: string
}
export interface newCampaignPayload {
  title?: string
  path?: string
}

export interface updateObjectPayload {
  id: string
  field: string
  value: any
}

export interface StoreMutations {
  setTitle(state: StoreState, title: string): void
  addObject(state: StoreState, obj: ScribeObject): void
  removeObject(state: StoreState, id: string): void
  addTab(state: StoreState, payload: addTabPayload): void
  removeTabById(state: StoreState, id: string): void
  removeTabByIndex(state: StoreState, index: number): void
  setCurrentTabIndex(state: StoreState, index: number): void
  setFilePath(state: StoreState, path: string): void
  newCampaign(state: StoreState, path?:string): void
  loadCampaign(state: StoreState, payload: loadPayload): void
  updateObject(state: StoreState, payload: updateObjectPayload): void
}


export interface context {
  state: StoreState
  getters: StoreGetters
  dispatch: (type: string, payload?: any, options?: CommitOptions) => void

}

export interface StoreActions {
  findObject(context: any, id: string): ScribeObject|undefined
} 