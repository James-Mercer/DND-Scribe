import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

/*
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import ScribeTree from '../Classes/ScribeTree'

@Module({ namespaced: true, name: 'CoreState' })
class store extends VuexModule {

  /*
  @Mutation
  public setName(newName: string): void {
    this.name = newName
  }
  @Action
  public updateName(newName: string): void {
    this.context.commit('setName', newName)
  }
}
export default store
*/
