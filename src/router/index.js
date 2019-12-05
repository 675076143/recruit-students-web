import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Main from "../components/Main";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children:[
      {
        path:'/',
        component:Main
      },
      {
        path: '/user',
        component: () => import(/* webpackChunkName: "about" */ '../components/User')
      },
      {
        path: '/role',
        component: () => import(/* webpackChunkName: "about" */ '../components/Role')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../components/Login')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
