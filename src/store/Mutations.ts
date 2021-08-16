import Vue from 'vue'
import {
  StoreState,
  StoreMutations,
  defaultCampaignName,
  PayloadAddTab,
  PayloadUpdateObject,
  PayloadNewCampaign,
  PayloadLoad,
  PayloadObjTag
} from './StoreInterfaces'
import ScribeObject, { ScribeLink } from '@/types/ScribeObject'
import { sessionTypeName } from './../types/typeUtils'
import Tag from '@/types/Tag'
import NetworkOptions from '@/types/NetworkOptions'
import ReactiveMap from '@/types/ReactiveMap'
import { IdType } from 'vis-network/peer'
import Session from '@/types/Session'
import TimelineOptions, { GroupStyles } from '@/types/TimelineOptions'

const storeMutations: StoreMutations = {
  setTitle (state: StoreState, title: string): void {
    state.title = title
  },

  setView (state: StoreState, view: number): void {
    if (view >= 0 && view <= 3) {
      state.view = view
      return
    }
    console.log('invalid view index')
  },

  addObject (state: StoreState, obj: ScribeObject): void {
    Vue.set(state.objects, obj.id, obj)
  },

  updateObject (state: StoreState, payload: PayloadUpdateObject): void {
    const obj = state.objects.get(payload.id as string)
    if (obj === undefined) {
      console.error('Update failed - Invalid ID')
      return
    }

    switch (payload.field) {
      case 'name':
        if (typeof payload.value === typeof obj.name) {
          obj.name = payload.value
        }
        break
      case 'portrait':
        if (typeof payload.value === typeof obj.portrait) {
          obj.portrait = payload.value
        }
        break
      case 'content':
        if (typeof payload.value === typeof obj.content) {
          obj.content = payload.value
        }
        break
      case 'tags':
        if (typeof payload.value === typeof obj.tagIds) {
          obj.tagIds = payload.value
        }
        break
      case 'irlStartDate':
        if (
          obj.type === Session.typeName &&
          typeof payload.value === typeof (obj as Session).irlStartDate
        ) {
          ;(obj as Session).irlStartDate = payload.value
        }
        break
      case 'irlEndDate':
        if (
          obj.type === Session.typeName &&
          typeof payload.value === typeof (obj as Session).irlEndDate
        ) {
          ;(obj as Session).irlEndDate = payload.value
        }
        break
      case 'igStartDate':
        if (
          obj.type === Session.typeName &&
          typeof payload.value === typeof (obj as Session).igStartDate
        ) {
          ;(obj as Session).igStartDate = payload.value
        }
        break
      case 'igEndDate':
        if (
          obj.type === Session.typeName &&
          typeof payload.value === typeof (obj as Session).igEndDate
        ) {
          ;(obj as Session).igEndDate = payload.value
        }
        break
      default:
        console.error(`Update failed - unrecognised field ${payload.field}`)
        break
    }
  },

  removeObject (state: StoreState, id: string): void {
    Vue.delete(state.objects, id)
  },

  addTag (state: StoreState, tag: Tag) {
    state.tags.push(tag)
  },

  updateTag (state: StoreState, tag: Tag) {
    const index: number = state.tags.findIndex((tagIt: Tag) => {
      return tagIt.id === tag.id
    })
    if (index > -1) {
      state.tags.splice(index, 1, tag)
    }
  },

  removeTag (state: StoreState, tag: Tag): void {
    state.tags.findIndex((tagIt: Tag): boolean => {
      return tagIt.id === tag.id
    })
  },

  addObjectTag (state: StoreState, payload: PayloadObjTag): void {
    const obj = state.objects.get(payload.objId)
    if (obj !== undefined) {
      obj.tagIds.add(payload.tagId)
    }
  },

  removeObjectTag (state: StoreState, payload: PayloadObjTag): void {
    const obj = state.objects.get(payload.objId)
    if (obj !== undefined) {
      obj.tagIds.delete(payload.tagId)
    }
  },

  addTab (state: StoreState, payload: PayloadAddTab): void {
    console.log('add tab payload')
    console.log(payload)
    let index: number = state.openTabs.findIndex((e: IdType): boolean => {
      return e === payload.id
    })
    if (index === -1) {
      if (payload.index) {
        state.openTabs.splice(payload.index, 0, payload.id)
        index = payload.index
      } else {
        state.openTabs.push(payload.id)
        index = state.openTabs.length
      }
    } else console.log('Item already open in a tab')

    if (payload.focus) {
      state.tabIndex = index
    }
  },

  removeTabById (state: StoreState, id: string): void {
    const index = state.openTabs.findIndex((e: IdType): boolean => {
      return e === id
    })
    if (index !== -1) state.openTabs.splice(index, 1)
  },

  removeTabByIndex (state: StoreState, index: number) {
    if (index >= 0 && index < state.openTabs.length) {
      state.openTabs.splice(index, 1)
    }
  },

  setCurrentTabIndex (state: StoreState, index: number): void {
    console.log(`set tab index ${index}`)
    if (index >= 0 && index < state.openTabs.length) {
      state.tabIndex = index
    } else {
      state.tabIndex = 0
    }
  },

  setNetworkOptions (state: StoreState, config: NetworkOptions): void {
    state.networkOptions = config
  },

  setTimelineOptions (state: StoreState, config: TimelineOptions): void {
    state.timelineOptions = config
  },

  setTimelineGroupStyles (state: StoreState, groupStyles: GroupStyles): void {
    state.timelineGroupStyles = groupStyles
  },

  setFilePath (state: StoreState, path: string) {
    state.filePath = path
  },

  loadCampaign (state: StoreState, payload: PayloadLoad): void {
    console.log('loadCampaign')
    state.filePath = payload.path
    state.title = payload.toLoad.title
    state.openTabs = payload.toLoad.openTabs
    state.tabIndex = payload.toLoad.tabIndex
    const newMap = Object.assign(new ReactiveMap(), payload.toLoad.objects)
    newMap.forEach((item: ScribeObject) => {
      if (item.type === sessionTypeName) {
        const session = item as Session
        session.irlStartDate = new Date(session.irlStartDate)
        session.irlEndDate = new Date(session.irlEndDate)
        session.igStartDate = new Date(session.igStartDate)
        session.igEndDate = new Date(session.igEndDate)
      }
    })
    Vue.set(state, 'objects', newMap)
  },

  newCampaign (state: StoreState, payload?: PayloadNewCampaign): void {
    console.log('Clearing store')
    Vue.set(state, 'title', payload?.title || defaultCampaignName)
    Vue.set(state, 'filePath', payload?.path || undefined)
    Vue.set(state, 'objects', new ReactiveMap())
    Vue.set(state, 'openTabs', [])
    Vue.set(state, 'tabIndex', -1)
    console.log(state)
  },

  createLink (state: StoreState, payload: ScribeLink) {
    console.log('Add link to graph edges')
    console.log(payload)
    const obj = state.objects.get(payload.from)
    if (obj !== undefined) {
      obj.links.push(payload)
    }
  },

  removeLink (state: StoreState, payload: ScribeLink) {
    console.log('Remove link from graph edges')
    const obj = state.objects.get(payload.from)
    if (obj !== undefined) {
      const index = obj.links.findIndex((link: ScribeLink): boolean => {
        return link.id === payload.id
      })
      if (index > -1) {
        obj.links.splice(index, 1)
      }
    }
  }
}
export default storeMutations
