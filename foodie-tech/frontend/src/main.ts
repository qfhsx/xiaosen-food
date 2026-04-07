import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import Home from './views/Home.vue'
import FoodDetail from './views/FoodDetail.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/food/:id', component: FoodDetail },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')