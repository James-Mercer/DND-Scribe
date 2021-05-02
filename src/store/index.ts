import Vue from 'vue'
import Vuex from 'vuex'
import Campaign from '@/types/Campaign'
import ReactiveMap from '@/types/ReactiveMap'
import ScribeObject from '@/types/ScribeObject'
import TreeGroup from '@/types/TreeGroup'
import Session  from '@/types/Session';
import PC from '@/types/PlayerCharacter'
import NPC from '@/types/NonPlayerCharacter'
import Location from '@/types/Location'
import PlayerCharacter from '@/types/PlayerCharacter'
import NonPlayerCharacter from '@/types/NonPlayerCharacter'

const defaultCampaignName:string = 'Unnamed Campaign'

Vue.use(Vuex)

class StoreState {
  title: string
  objects: ReactiveMap
  openTabs: Array<string>
  tabIndex: number

  constructor() {
    this.title = defaultCampaignName
    this.objects = new ReactiveMap()
    this.openTabs = new Array<string>()
    this.tabIndex = -1
  }
}

const storeGetters = {
  getTitle (state: StoreState): string {
    return state.title 
  },
  getObjects (state: StoreState): ReactiveMap {
    return state.objects
  },
  getOpenTabs (state: StoreState): Array<string> {
    return state.openTabs
  },
  getTabIndex (state: StoreState): number {
    return state.tabIndex
  }
}

export interface addTabPayload {
  id: string
  index: number
  focus: boolean
}

const storeMutations = {
  setTitle(state: StoreState, title: string): void {
    state.title = title
  },
  addObject(state: StoreState, obj: ScribeObject): void {
    Vue.set(state.objects, obj.id, obj)
  },
  removeObject(state: StoreState, id: string): void {
    state.objects.delete(id) 
  },
  addTab(state: StoreState, payload: addTabPayload): void {
    if(state.openTabs.find((e: string): boolean => { return e === payload.id }) === undefined ) {
      state.openTabs.splice(payload.index > -1 ? payload.index : state.openTabs.length -1, 0, payload.id)
    }
  },
  removeTabById(state: StoreState, id: string): void {
    const index = state.openTabs.findIndex((e: string): boolean => { return e === id })
    if(index !== -1)
      state.openTabs.splice(index, 1)
  },
  removeTabByIndex(state: StoreState, index: number) {
    if(index >= 0 && index < state.openTabs.length) {
      state.tabIndex = index
    }
  },
  setCurrentTabIndex(state: StoreState, index: number): void {
    if(index >= 0 && index < state.openTabs.length) {
      state.tabIndex = index
    }
  }
}

let storeActions = {}

const storeState = new StoreState()
export default new Vuex.Store({
  state: storeState,
  getters: storeGetters,
  mutations: storeMutations,
  actions: storeActions
})