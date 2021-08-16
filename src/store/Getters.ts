import { StoreState, PersistantState, StoreGetters } from './StoreInterfaces'
import ReactiveMap from '@/types/ReactiveMap'
import ScribeObject, { ScribeLink } from '@/types/ScribeObject'
import NetworkOptions, { ChosenOptions } from '@/types/NetworkOptions'
import { IdType } from 'vis-network/peer'

const Getters: StoreGetters = {
  getTabTitles (state: StoreState): Array<string> {
    const titles: Array<string> = []
    state.openTabs.forEach((tabId: IdType) => {
      const obj = state.objects.get(tabId as string)
      if (obj) {
        titles.push(obj.name)
      } else {
        titles.push('bad object')
      }
    })
    return titles
  },
  getCurrentTabObject (state: StoreState): ScribeObject | undefined {
    return state.objects.get(state.openTabs[state.tabIndex] as string)
  },
  getStateToSave (state: StoreState): PersistantState {
    return {
      title: state.title,
      objects: JSON.parse(JSON.stringify(state.objects)), // strip methods
      view: state.view,
      openTabs: state.openTabs,
      tabIndex: state.tabIndex,
      networkOptions: state.networkOptions,
      timelineOptions: state.timelineOptions,
      timelineGroups: state.timelineGroups,
      timelineGroupStyles: state.timelineGroupStyles
    }
  }
}
export default Getters
