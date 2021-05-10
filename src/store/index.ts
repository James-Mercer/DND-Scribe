import Vue from 'vue'
import Vuex, { CommitOptions } from 'vuex'
import Campaign from '@/types/Campaign'
import ReactiveMap from '@/types/ReactiveMap'
import ScribeObject from '@/types/ScribeObject'
import {StoreState, StoreGetters, defaultCampaignName, addTabPayload, PersistantState, loadPayload, newCampaignPayload} from './StoreInterfaces'

Vue.use(Vuex)

const storeGetters = {
  getTitle (state: StoreState): string 
  {
    return state.title 
  },
  getObjects (state: StoreState): ReactiveMap 
  {
    return state.objects
  },
  getOpenTabs (state: StoreState): Array<string> 
  {
    return state.openTabs
  },
  getTabIndex (state: StoreState): number 
  {
    return state.tabIndex
  },
  getCurrentTabObject(state: StoreState): ScribeObject|undefined 
  {
    return state.objects.get(state.openTabs[state.tabIndex])
  },
  getFilePath(state: StoreState): string|undefined {
    return state.filePath
  },
  getStateToSave(state: StoreState): PersistantState {
    return {
      title: state.title,
      objects: state.objects,
      openTabs: state.openTabs,
      tabIndex: state.tabIndex,
    }
  }
}

const storeMutations = {
  setTitle(state: StoreState, title: string): void 
  {
    state.title = title
  },
  addObject(state: StoreState, obj: ScribeObject): void 
  {
    Vue.set(state.objects, obj.id, obj)
  },
  removeObject(state: StoreState, id: string): void 
  {
    Vue.delete(state.objects, id)
  },
  addTab(state: StoreState, payload: addTabPayload): void 
  {
    console.log('add tab payload')
    console.log(payload)
    let index: number = state.openTabs.findIndex((e: string): boolean => { return e === payload.id })
    if(index === -1) 
    {
      if (payload.index) 
      {
        state.openTabs.splice(payload.index, 0, payload.id)
        index = payload.index
      }
      else {
        state.openTabs.push(payload.id)
        index = state.openTabs.length
      }
    } 
    else 
      console.log('Item already open in a tab')
    
    if(payload.focus) {
      state.tabIndex = index
    }
  },
  removeTabById(state: StoreState, id: string): void 
  {
    const index = state.openTabs.findIndex((e: string): boolean => { return e === id })
    if(index !== -1)
      state.openTabs.splice(index, 1)
  },
  removeTabByIndex(state: StoreState, index: number) 
  {
    if(index >= 0 && index < state.openTabs.length) {
      state.openTabs.splice(index, 1)
    }
  },
  setCurrentTabIndex(state: StoreState, index: number): void 
  {
    console.log(`set tab index ${index}`)
    if(index >= 0 && index < state.openTabs.length) {
      state.tabIndex = index
    }
  },
  setFilePath(state: StoreState, path: string) {
    state.filePath = path
  },
  loadCampaign(state: StoreState, payload: loadPayload): void {
    console.log('loadCampaign')
    state.filePath = payload.path
    state.title = payload.toLoad.title
    state.openTabs = payload.toLoad.openTabs
    state.tabIndex = payload.toLoad.tabIndex
    let newMap = new ReactiveMap()
    newMap.copyPropsFromObject(payload.toLoad.objects)
    Vue.set(state, 'objects', newMap)
  },
  newCampaign(state: StoreState, payload?: newCampaignPayload): void {
    state = new StoreState(payload?.title, payload?.path)
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