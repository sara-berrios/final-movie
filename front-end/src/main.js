import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// import mock from './mock-data.js'

let data = {
  movie: "", //we don't use this in Movie.vue for some reason. (maybe we use it in edit?)
  // allMovies: [],
  user: null,
}

new Vue({
  router,
  data,
  render: h => h(App)
}).$mount('#app')
