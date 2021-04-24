import Vue from 'vue'
import Vuex from 'vuex'
import { Module, VuexModule, Mutation, Action} from 'vuex-module-decorators'

//Type imports
import {
  ADD_OBJECT, 
  REMOVE_OBJECT, 
  ADD_TAB, 
  REMOVE_TAB_BY_ID, 
  REMOVE_TAB_BY_INDEX, 
  GET_TABS, 
  GET_CURRENT_TAB_INDEX, 
  SET_CURRENT_TAB_INDEX,
  GET_CAMPAIGN, 
  GET_OBJECT_FROM_ID 
} from './operation-types'
import Campaign from '@/types/Campaign'
import ScribeObject from '@/types/ScribeObject'

Vue.use(Vuex)

@Module({ namespaced: false })
export class CampaignStore extends VuexModule {
  campaign: Campaign = new Campaign('default')
  openTabs: Array<string> = []
  currentOpenTabIndex: number = -1

  get [GET_CAMPAIGN](): Campaign {
    return this.campaign
  }

  get [GET_TABS](): Array<string> {
    return this.openTabs
  }

  get [GET_CURRENT_TAB_INDEX](): number {
    return this.currentOpenTabIndex
  }

  [GET_OBJECT_FROM_ID](id: string): ScribeObject|undefined {
    return this.campaign.findObject(id)
  }

  @Mutation
  [ADD_OBJECT] (newObject: ScribeObject): void {
    this.campaign.addObject(newObject)
  }

  @Mutation
  [REMOVE_OBJECT] (objectID: string): boolean {
    return this.campaign.removeObject(objectID)
  }

  @Mutation
  [ADD_TAB](newTab: string, focus: boolean): void {
    console.log(`Add tab ${newTab}, focus is ${focus}`)
    let index: number = this.openTabs.findIndex(e => { return e === newTab })
    if (index === -1) {
      index = this.openTabs.push(newTab) //add if not exist
    }
    console.log(`focus on tab ${index}`)
    this.currentOpenTabIndex = index
  }

  @Mutation
  [SET_CURRENT_TAB_INDEX](newTabIndex: number): void {
    if(newTabIndex < this.openTabs.length) {
      this.currentOpenTabIndex = newTabIndex
    }
  }

  @Mutation
  [REMOVE_TAB_BY_ID](tabIDtoDelete: string): boolean {
    const index = this.openTabs.findIndex((tabId, i) => { return tabId === tabIDtoDelete})
    if(index > -1) {
      this.openTabs.splice(index, 1)
      return true
    }
    return false
  }

  @Mutation
  [REMOVE_TAB_BY_INDEX](tabIndex: number): void {
    if(tabIndex < this.openTabs.length) {
      this.openTabs.splice(tabIndex, 1)
    }
  }
}

export default new Vuex.Store({
  modules: {
    campaignStore: CampaignStore
  }
})
