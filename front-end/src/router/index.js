import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Movie from '../views/Movie.vue'
import Admin from '../views/Admin.vue'
import Edit from '../views/Edit.vue'
import Checkout from '../views/Checkout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // {
  //   path: '/movie',
  //   name: 'movie',
  //   component: Movie
  // },
  {
    path: '/movie/:id',
    name: 'movie',
    component: Movie
  },
  {
    path:'/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/edit',
    name: 'Edit',
    component: Edit
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
