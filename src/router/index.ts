import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import landing from '../views/Landing.vue'
import campaign from '../views/Campaign.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'landing',
    component: landing
  },
  {
    path: '/project',
    name: 'project',
    component: campaign
  }
]

const router = new VueRouter({
  routes
})

export default router
