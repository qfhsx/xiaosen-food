import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import Login from './views/Login.vue'
import Layout from './components/Layout.vue'
import Dashboard from './views/Dashboard.vue'
import FoodList from './views/FoodList.vue'
import FoodEdit from './views/FoodEdit.vue'
import CategoryList from './views/CategoryList.vue'

const routes = [
  { path: '/login', component: Login },
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: Dashboard },
      { path: 'foods', component: FoodList },
      { path: 'foods/create', component: FoodEdit },
      { path: 'foods/edit/:id', component: FoodEdit },
      { path: 'categories', component: CategoryList },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(ElementPlus)
app.mount('#app')