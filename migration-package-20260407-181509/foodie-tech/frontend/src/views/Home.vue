<template>
  <div class="home">
    <div class="bg-decoration">
      <div class="leaf l1">🌿</div>
      <div class="leaf l2">🍃</div>
      <div class="leaf l3">🌱</div>
    </div>
    
    <header class="header" :class="{ scrolled: isScrolled }">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">🌲</span>
          <h1 class="logo-text">小森美食</h1>
        </div>
        
        <!-- 当前餐点显示 -->
        <div class="current-meal" @click="showMealSelector = true">
          <span class="meal-icon">{{ currentMealInfo.icon }}</span>
          <span class="meal-name">{{ currentMealInfo.name }}</span>
          <span class="meal-time">{{ currentMealInfo.time }}</span>
        </div>
        
        <nav class="nav" :class="{ open: menuOpen }">
          <a href="#" class="nav-link active" @click.prevent="scrollTo('home')">首页</a>
          <a href="#categories" class="nav-link" @click.prevent="scrollTo('categories')">分类</a>
          <a href="#foods" class="nav-link" @click.prevent="scrollTo('foods')">美食</a>
        </nav>
        
        <div class="cart-icon" @click="showCart = true">
          <span class="cart-emoji">🛒</span>
          <span v-if="totalCartCount > 0" class="cart-badge">{{ totalCartCount }}</span>
        </div>
        
        <button class="menu-btn" @click="menuOpen = !menuOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>

    <!-- 餐点选择器 -->
    <div v-if="showMealSelector" class="meal-selector-modal" @click.self="showMealSelector = false">
      <div class="meal-selector">
        <h3>选择餐点</h3>
        <div class="meal-options">
          <div 
            v-for="meal in mealTypes" 
            :key="meal.id"
            class="meal-option"
            :class="{ active: selectedMeal === meal.id, current: currentMealType === meal.id }"
            @click="selectedMeal = meal.id; showMealSelector = false"
          >
            <span class="option-icon">{{ meal.icon }}</span>
            <span class="option-name">{{ meal.name }}</span>
            <span class="option-time">{{ meal.time }}</span>
            <span v-if="currentMealType === meal.id" class="current-badge">当前</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero -->
    <section id="home" class="hero">
      <div class="hero-content">
        <div class="welcome-badge">
          <span>{{ currentMealInfo.icon }}</span> 
          {{ currentMealInfo.greeting }}
        </div>
        <h2 class="hero-title">
          今天{{ currentMealInfo.name }}吃什么？
        </h2>
        <p class="hero-desc">为家人准备一顿美味的{{ currentMealInfo.name }}吧</p>
        
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input v-model="searchQuery" type="text" placeholder="搜索美食或食材..." @keyup.enter="handleSearch"/>
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>

        <div class="quick-tags">
          <span class="tag-label">{{ currentMealInfo.name }}推荐：</span>
          <span v-for="tag in currentMealTags" :key="tag" class="quick-tag" @click="searchQuery = tag; handleSearch()">{{ tag }}</span>
        </div>
      </div>

      <div class="hero-image">
        <div class="image-frame">
          <img :src="currentMealInfo.image" alt="美食" />
          <div class="floating-card">
            <span class="emoji">👨‍🍳</span>
            <span class="text">准备{{ currentMealInfo.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 分类 -->
    <section id="categories" class="categories">
      <div class="section-header">
        <h3 class="section-title"><span class="title-icon">🍽️</span>美食分类</h3>
      </div>
      <div class="category-scroll">
        <div v-for="cat in categories" :key="cat.id" class="category-item" :class="{ active: selectedCategory === cat.id }" @click="selectCategory(cat.id)">
          <div class="category-icon">{{ cat.icon }}</div>
          <div class="category-name">{{ cat.name }}</div>
        </div>
      </div>
    </section>

    <!-- 美食列表 -->
    <section id="foods" class="food-section">
      <div class="section-header">
        <h3 class="section-title">
          <span class="title-icon">{{ currentMealInfo.icon }}</span>
          {{ currentMealInfo.name }}美食
        </h3>
        <span class="food-count">共 {{ total }} 道</span>
      </div>

      <div class="food-grid" :class="{ 'grid-mobile': isMobile }">
        <div v-for="food in foods" :key="food.id" class="food-card">
          <div class="food-image" @click="goToDetail(food.id)">
            <img :src="food.image || defaultImage" :alt="food.name" loading="lazy" />
          </div>
          <div class="food-info">
            <div class="food-meta-top">
              <span class="food-category">{{ food.category?.name }}</span>
              <div class="food-rating"><span>⭐</span><span>{{ food.rating }}</span></div>
            </div>
            <h4 class="food-name" @click="goToDetail(food.id)">{{ food.name }}</h4>
            <p class="food-desc" @click="goToDetail(food.id)">{{ food.description }}</p>
            <div class="food-actions">
              <button class="add-to-cart-btn" @click.stop="addToCart(food)">
                <span>🛒</span>加入{{ currentMealInfo.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="foods.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">🍽️</div>
        <p>该分类暂无{{ currentMealInfo.name }}美食</p>
      </div>
    </section>

    <!-- 底部 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo"><span>🌲</span><span>小森美食</span></div>
        <p class="footer-text">用心烹饪，家的味道</p>
        <p class="copyright">© 2024 小森家</p>
      </div>
    </footer>

    <!-- 购物车侧边栏 -->
    <div v-if="showCart" class="cart-overlay" @click.self="showCart = false">
      <div class="cart-sidebar">
        <div class="cart-header">
          <h3><span>🛒</span>今日菜单</h3>
          <button class="close-btn" @click="showCart = false">×</button>
        </div>
        
        <!-- 餐点切换Tab -->
        <div class="meal-tabs">
          <div 
            v-for="meal in mealTypes" 
            :key="meal.id"
            class="meal-tab"
            :class="{ active: activeCartTab === meal.id }"
            @click="activeCartTab = meal.id"
          >
            <span class="tab-icon">{{ meal.icon }}</span>
            <span class="tab-name">{{ meal.name }}</span>
            <span v-if="getCartCount(meal.id) > 0" class="tab-count">{{ getCartCount(meal.id) }}</span>
          </div>
        </div>

        <div class="cart-body">
          <!-- 空状态 -->
          <div v-if="getCartItems(activeCartTab).length === 0" class="cart-empty">
            <div class="empty-icon">{{ mealTypes.find(m => m.id === activeCartTab)?.icon }}</div>
            <p>还没有{{ mealTypes.find(m => m.id === activeCartTab)?.name }}菜品</p>
            <p class="empty-tip">快去添加吧～</p>
          </div>
          
          <!-- 购物车列表 -->
          <div v-else class="cart-list">
            <div v-for="item in getCartItems(activeCartTab)" :key="item.id" class="cart-item">
              <img :src="item.image" class="item-image" />
              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <div class="item-quantity">
                  <button @click="updateQuantity(activeCartTab, item.id, item.quantity - 1)">−</button>
                  <span>{{ item.quantity }}份</span>
                  <button @click="updateQuantity(activeCartTab, item.id, item.quantity + 1)">+</button>
                </div>
              </div>
              <button class="remove-btn" @click="removeFromCart(activeCartTab, item.id)">🗑️</button>
            </div>
            
            <!-- 食材调料统计 -->
            <div class="cart-stats">
              <div class="stats-header"><span>📋</span><span>采购清单</span></div>
              
              <div class="stats-section" v-if="getCartStats(activeCartTab).ingredients?.length">
                <h4>🥬 所需食材</h4>
                <ul class="stats-list">
                  <li v-for="(ing, idx) in getCartStats(activeCartTab).ingredients" :key="idx">
                    <span class="name">{{ ing.name }}</span>
                  </li>
                </ul>
              </div>
              
              <div class="stats-section" v-if="getCartStats(activeCartTab).seasonings?.length">
                <h4>🧂 所需调料</h4>
                <div class="seasoning-tags">
                  <span v-for="(sea, idx) in getCartStats(activeCartTab).seasonings" :key="idx" class="seasoning-tag">{{ sea }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 购物车底部 - 完成餐点按钮 -->
        <div class="cart-footer" v-if="getCartItems(activeCartTab).length > 0">
          <button class="complete-btn" @click="completeMeal(activeCartTab)">
            <span>✅</span>
            {{ mealTypes.find(m => m.id === activeCartTab)?.name }}已吃完
          </button>
        </div>
      </div>
    </div>

    <!-- Toast提示 -->
    <div v-if="showAddSuccess" class="toast">
      <span>✅</span>
      <span>已加入{{ currentMealInfo.name }}</span>
    </div>
    
    <div v-if="showCompleteSuccess" class="toast">
      <span>🎉</span>
      <span>{{ mealTypes.find(m => m.id === completedMeal)?.name }}已完成！</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const foods = ref([])
const categories = ref([])
const mealTypes = ref([])
const selectedCategory = ref(0)
const selectedMeal = ref('')
const currentMealType = ref('')
const searchQuery = ref('')
const page = ref(1)
const loading = ref(false)
const isScrolled = ref(false)
const menuOpen = ref(false)
const isMobile = ref(false)
const showCart = ref(false)
const activeCartTab = ref('breakfast')
const cart = ref({ breakfast: [], lunch: [], dinner: [] })
const showAddSuccess = ref(false)
const showCompleteSuccess = ref(false)
const completedMeal = ref('')
const showMealSelector = ref(false)

const defaultImage = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop'

const currentMealInfo = computed(() => {
  const meal = mealTypes.value.find(m => m.id === selectedMeal.value) || mealTypes.value[0]
  const greetings: Record<string, string> = {
    breakfast: '早上好！',
    lunch: '中午好！',
    dinner: '晚上好！'
  }
  const images: Record<string, string> = {
    breakfast: 'https://images.unsplash.com/photo-1533089862017-5614ec95e214?w=600',
    lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    dinner: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'
  }
  return {
    ...meal,
    greeting: greetings[meal?.id] || '你好！',
    image: images[meal?.id] || images.lunch
  }
})

const currentMealTags = computed(() => {
  const tags: Record<string, string[]> = {
    breakfast: ['蛋炒饭', '煎饺', '小米粥', '鸡蛋饼'],
    lunch: ['红烧肉', '清蒸鱼', '蛋炒饭', '西红柿汤'],
    dinner: ['可乐鸡翅', '红烧肉', '煎饺', '汤']
  }
  return tags[selectedMeal.value] || tags.lunch
})

const totalCartCount = computed(() => {
  return Object.values(cart.value).flat().reduce((sum: number, item: any) => sum + item.quantity, 0)
})

const total = computed(() => foods.value.length)

const checkDevice = () => {
  isMobile.value = window.innerWidth <= 768
}

const fetchMealTypes = async () => {
  try {
    const res = await axios.get('/api/v1/meal-types')
    mealTypes.value = res.data.data
    currentMealType.value = res.data.current
    selectedMeal.value = res.data.current
    activeCartTab.value = res.data.current
  } catch (error) {
    mealTypes.value = [
      { id: 'breakfast', name: '早餐', icon: '🌅', time: '06:00-10:00' },
      { id: 'lunch', name: '午餐', icon: '☀️', time: '10:00-15:00' },
      { id: 'dinner', name: '晚餐', icon: '🌙', time: '15:00-21:00' }
    ]
    currentMealType.value = 'lunch'
    selectedMeal.value = 'lunch'
  }
}

const fetchFoods = async () => {
  loading.value = true
  try {
    const params: any = { 
      page: page.value, 
      page_size: 20,
      meal_type: selectedMeal.value
    }
    if (selectedCategory.value) params.category_id = selectedCategory.value
    if (searchQuery.value) params.keyword = searchQuery.value
    
    const res = await axios.get('/api/v1/foods', { params })
    foods.value = res.data.data || []
  } catch (error) {
    foods.value = []
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const res = await axios.get('/api/v1/categories')
    categories.value = res.data.data || []
    categories.value.unshift({ id: 0, name: '全部', icon: '🍽️' })
  } catch (error) {
    categories.value = [{ id: 0, name: '全部', icon: '🍽️' }]
  }
}

const fetchCart = async () => {
  try {
    const res = await axios.get('/api/v1/cart')
    cart.value = res.data.data || { breakfast: [], lunch: [], dinner: [] }
  } catch (error) {
    cart.value = { breakfast: [], lunch: [], dinner: [] }
  }
}

const getCartCount = (mealType: string) => {
  return cart.value[mealType]?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0
}

const getCartItems = (mealType: string) => {
  return cart.value[mealType] || []
}

const getCartStats = (mealType: string) => {
  const items = cart.value[mealType] || []
  const allIngredients: any[] = []
  const allSeasonings = new Set<string>()
  
  items.forEach((item: any) => {
    if (item.ingredients) {
      item.ingredients.split(',').forEach((ing: string) => {
        allIngredients.push({ name: ing.trim() })
      })
    }
    if (item.seasonings) {
      item.seasonings.split(',').forEach((s: string) => allSeasonings.add(s.trim()))
    }
  })
  
  return { ingredients: allIngredients, seasonings: Array.from(allSeasonings) }
}

const addToCart = async (food: any) => {
  try {
    await axios.post('/api/v1/cart', { 
      food_id: food.id, 
      meal_type: selectedMeal.value,
      quantity: 1 
    })
    await fetchCart()
    showAddSuccess.value = true
    setTimeout(() => showAddSuccess.value = false, 2000)
  } catch (error) {
    console.error('添加失败:', error)
  }
}

const updateQuantity = async (mealType: string, id: number, quantity: number) => {
  try {
    await axios.put(`/api/v1/cart/${mealType}/${id}`, { quantity })
    await fetchCart()
  } catch (error) {
    console.error('更新失败:', error)
  }
}

const removeFromCart = async (mealType: string, id: number) => {
  try {
    await axios.delete(`/api/v1/cart/${mealType}/${id}`)
    await fetchCart()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

const completeMeal = async (mealType: string) => {
  try {
    await axios.post(`/api/v1/cart/complete/${mealType}`)
    completedMeal.value = mealType
    showCompleteSuccess.value = true
    await fetchCart()
    setTimeout(() => showCompleteSuccess.value = false, 3000)
  } catch (error) {
    console.error('完成餐点失败:', error)
  }
}

const selectCategory = (id: number) => {
  selectedCategory.value = id
  page.value = 1
  fetchFoods()
  menuOpen.value = false
}

const handleSearch = () => {
  page.value = 1
  fetchFoods()
}

const goToDetail = (id: number) => {
  router.push(`/food/${id}`)
}

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  menuOpen.value = false
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  fetchMealTypes().then(() => {
    fetchCategories()
    fetchFoods()
    fetchCart()
  })
  checkDevice()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', checkDevice)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', checkDevice)
})
</script>

<style scoped>
/* 小森美食样式 */
.bg-decoration { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
.leaf { position: absolute; font-size: 2rem; opacity: 0.15; animation: float-leaf 8s ease-in-out infinite; }
.l1 { top: 10%; left: 5%; }
.l2 { top: 60%; right: 8%; animation-delay: 3s; }
.l3 { bottom: 20%; left: 10%; animation-delay: 6s; }
@keyframes float-leaf { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(10deg); } }

.header { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 12px 20px; transition: all 0.3s; }
.header.scrolled { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); box-shadow: 0 2px 20px rgba(0,0,0,0.08); }
.header-content { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 15px; }

.logo { display: flex; align-items: center; gap: 8px; }
.logo-icon { font-size: 1.6rem; }
.logo-text { font-size: 1.3rem; font-weight: 600; color: var(--primary); }

/* 当前餐点显示 */
.current-meal { display: flex; align-items: center; gap: 6px; background: rgba(107, 142, 110, 0.1); padding: 8px 16px; border-radius: 20px; cursor: pointer; transition: all 0.3s; }
.current-meal:hover { background: rgba(107, 142, 110, 0.2); }
.meal-icon { font-size: 1.2rem; }
.meal-name { font-size: 0.95rem; font-weight: 500; color: var(--primary); }
.meal-time { font-size: 0.75rem; color: var(--text-light); }

.nav { display: flex; gap: 25px; }
.nav-link { color: var(--text-secondary); text-decoration: none; font-size: 0.95rem; transition: color 0.3s; position: relative; }
.nav-link:hover, .nav-link.active { color: var(--primary); }

.cart-icon { position: relative; cursor: pointer; padding: 8px; }
.cart-emoji { font-size: 1.4rem; }
.cart-badge { position: absolute; top: 0; right: 0; background: var(--primary); color: white; font-size: 0.65rem; padding: 2px 6px; border-radius: 10px; min-width: 18px; text-align: center; }

.menu-btn { display: none; flex-direction: column; gap: 4px; background: none; border: none; cursor: pointer; padding: 5px; }
.menu-btn span { width: 22px; height: 2px; background: var(--text-primary); border-radius: 2px; }

/* 餐点选择器 */
.meal-selector-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1001; display: flex; align-items: center; justify-content: center; padding: 20px; }
.meal-selector { background: white; border-radius: 20px; padding: 30px; width: 100%; max-width: 360px; }
.meal-selector h3 { text-align: center; margin-bottom: 20px; color: var(--text-primary); }
.meal-options { display: flex; flex-direction: column; gap: 12px; }
.meal-option { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-radius: 12px; cursor: pointer; transition: all 0.3s; border: 2px solid transparent; position: relative; }
.meal-option:hover { background: var(--bg-cream); }
.meal-option.active { border-color: var(--primary); background: rgba(107, 142, 110, 0.1); }
.meal-option.current { border-color: #F4A460; }
.option-icon { font-size: 1.8rem; }
.option-name { flex: 1; font-weight: 500; color: var(--text-primary); }
.option-time { font-size: 0.8rem; color: var(--text-light); }
.current-badge { background: #F4A460; color: white; padding: 4px 10px; border-radius: 10px; font-size: 0.7rem; }

.hero { min-height: 100vh; display: flex; align-items: center; padding: 100px 20px 60px; max-width: 1200px; margin: 0 auto; gap: 50px; position: relative; z-index: 1; }
.hero-content { flex: 1; }
.welcome-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(107, 142, 110, 0.1); color: var(--primary); padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; margin-bottom: 20px; }
.hero-title { font-size: 2.6rem; font-weight: 700; line-height: 1.3; margin-bottom: 16px; color: var(--text-primary); }
.hero-desc { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 30px; }

.search-box { display: flex; align-items: center; background: white; border-radius: 30px; padding: 6px 6px 6px 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); max-width: 450px; margin-bottom: 16px; }
.search-icon { font-size: 1.1rem; margin-right: 10px; color: var(--text-light); }
.search-box input { flex: 1; border: none; outline: none; font-size: 1rem; background: transparent; }
.search-btn { background: var(--gradient-nature); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 0.95rem; font-weight: 500; cursor: pointer; }

.quick-tags { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.quick-tag { background: var(--bg-card); color: var(--text-secondary); padding: 6px 14px; border-radius: 15px; font-size: 0.85rem; cursor: pointer; transition: all 0.3s; border: 1px solid var(--border); }
.quick-tag:hover { background: var(--primary); color: white; border-color: var(--primary); }

.hero-image { flex: 1; display: flex; justify-content: center; }
.image-frame { position: relative; }
.image-frame img { width: 420px; height: 300px; object-fit: cover; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
.floating-card { position: absolute; bottom: -15px; left: -20px; background: white; padding: 12px 18px; border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 8px; animation: float-nature 3s ease-in-out infinite; }
.floating-card .emoji { font-size: 1.5rem; }
.floating-card .text { font-weight: 600; color: var(--text-primary); font-size: 0.9rem; }

.categories { padding: 50px 20px; position: relative; z-index: 1; }
.section-header { text-align: center; margin-bottom: 30px; }
.section-title { display: inline-flex; align-items: center; gap: 10px; font-size: 1.4rem; font-weight: 600; color: var(--text-primary); }
.category-scroll { display: flex; gap: 12px; overflow-x: auto; padding: 10px 20px 20px; max-width: 1200px; margin: 0 auto; scrollbar-width: none; }
.category-scroll::-webkit-scrollbar { display: none; }
.category-item { flex-shrink: 0; background: white; border: 2px solid var(--border); border-radius: 16px; padding: 16px 24px; text-align: center; cursor: pointer; transition: all 0.3s; min-width: 90px; }
.category-item:hover, .category-item.active { background: var(--primary); border-color: var(--primary); color: white; transform: translateY(-4px); box-shadow: 0 8px 25px rgba(107, 142, 110, 0.3); }
.category-icon { font-size: 1.8rem; margin-bottom: 6px; }
.category-name { font-size: 0.9rem; font-weight: 500; }

.food-section { padding: 30px 20px 60px; max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
.food-section .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; text-align: left; }
.food-count { color: var(--text-light); font-size: 0.9rem; }
.food-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 20px; }
.food-grid.grid-mobile { grid-template-columns: 1fr; }

.food-card { background: white; border-radius: 18px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); transition: all 0.3s ease; }
.food-card:hover { transform: translateY(-6px); box-shadow: 0 12px 35px rgba(0,0,0,0.12); }
.food-image { position: relative; height: 180px; overflow: hidden; cursor: pointer; }
.food-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.food-card:hover .food-image img { transform: scale(1.08); }
.food-info { padding: 18px; }
.food-meta-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.food-category { font-size: 0.75rem; color: var(--primary); background: rgba(107, 142, 110, 0.1); padding: 4px 10px; border-radius: 10px; }
.food-rating { display: flex; align-items: center; gap: 4px; font-size: 0.85rem; color: #FFB800; }
.food-name { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; cursor: pointer; }
.food-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 12px; cursor: pointer; }
.food-actions { display: flex; gap: 8px; }
.add-to-cart-btn { flex: 1; background: var(--gradient-nature); color: white; border: none; padding: 10px; border-radius: 10px; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 5px; }
.add-to-cart-btn:hover { transform: scale(1.02); box-shadow: 0 4px 15px rgba(107, 142, 110, 0.4); }

.empty-state { text-align: center; padding: 50px 20px; }
.empty-icon { font-size: 3.5rem; margin-bottom: 12px; }
.empty-state p { color: var(--text-secondary); }

.footer { background: white; padding: 50px 20px 25px; text-align: center; }
.footer-logo { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 1.4rem; font-weight: 600; color: var(--primary); margin-bottom: 10px; }
.footer-text { color: var(--text-secondary); margin-bottom: 15px; font-size: 0.95rem; }
.copyright { color: var(--text-light); font-size: 0.85rem; }

/* 购物车侧边栏 */
.cart-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: flex-end; }
.cart-sidebar { width: 100%; max-width: 400px; height: 100%; background: var(--bg-cream); display: flex; flex-direction: column; animation: slideIn 0.3s ease; }
@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

.cart-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 20px; background: white; border-bottom: 1px solid var(--border); }
.cart-header h3 { display: flex; align-items: center; gap: 8px; font-size: 1.1rem; color: var(--text-primary); }
.close-btn { background: none; border: none; font-size: 1.5rem; color: var(--text-light); cursor: pointer; }

/* 餐点Tab */
.meal-tabs { display: flex; background: white; border-bottom: 1px solid var(--border); }
.meal-tab { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 12px 8px; cursor: pointer; transition: all 0.3s; position: relative; }
.meal-tab:hover { background: var(--bg-cream); }
.meal-tab.active { background: var(--bg-cream); }
.meal-tab.active::after { content: ''; position: absolute; bottom: 0; left: 20%; right: 20%; height: 3px; background: var(--primary); border-radius: 2px; }
.tab-icon { font-size: 1.4rem; margin-bottom: 4px; }
.tab-name { font-size: 0.8rem; color: var(--text-secondary); }
.tab-count { position: absolute; top: 8px; right: 20%; background: var(--primary); color: white; font-size: 0.65rem; padding: 2px 6px; border-radius: 10px; }

.cart-body { flex: 1; overflow-y: auto; padding: 15px; }
.cart-empty { text-align: center; padding: 50px 20px; }
.cart-empty .empty-icon { font-size: 3.5rem; margin-bottom: 12px; }
.cart-empty p { color: var(--text-secondary); margin-bottom: 6px; }
.cart-empty .empty-tip { font-size: 0.85rem; color: var(--text-light); }

.cart-list { margin-bottom: 15px; }
.cart-item { display: flex; align-items: center; gap: 12px; background: white; padding: 12px; border-radius: 12px; margin-bottom: 10px; }
.item-image { width: 55px; height: 55px; border-radius: 8px; object-fit: cover; }
.item-info { flex: 1; }
.item-info h4 { font-size: 0.95rem; margin-bottom: 8px; color: var(--text-primary); }
.item-quantity { display: flex; align-items: center; gap: 10px; }
.item-quantity button { width: 26px; height: 26px; border-radius: 50%; border: 1px solid var(--border); background: white; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; }
.item-quantity span { font-size: 0.9rem; color: var(--text-primary); min-width: 35px; text-align: center; }
.remove-btn { background: none; border: none; font-size: 1.1rem; cursor: pointer; opacity: 0.5; }
.remove-btn:hover { opacity: 1; }

.cart-stats { background: white; border-radius: 14px; padding: 18px; }
.stats-header { display: flex; align-items: center; gap: 8px; font-size: 1rem; font-weight: 600; color: var(--primary); margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid var(--border); }
.stats-section { margin-bottom: 18px; }
.stats-section h4 { font-size: 0.9rem; color: var(--text-primary); margin-bottom: 10px; }
.stats-list { list-style: none; }
.stats-list li { padding: 6px 0; border-bottom: 1px solid var(--border); font-size: 0.85rem; color: var(--text-secondary); }
.stats-list li .name { color: var(--text-primary); }
.seasoning-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.seasoning-tag { background: rgba(212, 165, 116, 0.15); color: var(--secondary); padding: 5px 12px; border-radius: 12px; font-size: 0.8rem; }

.cart-footer { padding: 15px 20px 25px; background: white; border-top: 1px solid var(--border); }
.complete-btn { width: 100%; background: var(--gradient-nature); color: white; border: none; padding: 16px; border-radius: 12px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px; }
.complete-btn:hover { transform: scale(1.02); box-shadow: 0 4px 15px rgba(107, 142, 110, 0.4); }

.toast { position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); background: rgba(61, 61, 61, 0.95); color: white; padding: 12px 24px; border-radius: 25px; display: flex; align-items: center; gap: 8px; z-index: 1002; animation: fadeInUp 0.3s ease; }
@keyframes fadeInUp { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

@media (max-width: 767px) {
  .nav { position: fixed; top: 60px; left: 0; right: 0; background: white; flex-direction: column; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transform: translateY(-150%); transition: transform 0.3s; }
  .nav.open { transform: translateY(0); }
  .menu-btn { display: flex; }
  .hero { flex-direction: column-reverse; padding: 90px 15px 30px; text-align: center; gap: 25px; }
  .hero-title { font-size: 2rem; }
  .image-frame img { width: 100%; max-width: 340px; height: 240px; }
  .food-grid { grid-template-columns: 1fr; }
  .cart-sidebar { max-width: 100%; }
  .current-meal .meal-time { display: none; }
}
</style>