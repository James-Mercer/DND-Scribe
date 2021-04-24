import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import App from './App.vue'
import './registerServiceWorker'
import storeConfig from './store/index'
import vuetify from './plugins/vuetify'
import router from './router'

Vue.config.productionTip = false
const store = new Vuex.Store(storeConfig as StoreOptions<any>)
let app = new Vue({
  ,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')