<<<<<<< HEAD
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
=======
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
>>>>>>> init
