import Vue from 'vue'
import Vuex from 'vuex'
import { StoreState } from './StoreInterfaces'
import Getters from './Getters'
import Mutations from './Mutations'
import Actions from './Actions'

Vue.use(Vuex)

const storeState = new StoreState()
export default new Vuex.Store({
  state: storeState,
  getters: Getters,
  mutations: Mutations,
  actions: Actions
})
