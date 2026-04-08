<template>
  <div class="food-detail">
    <!-- 返回按钮 -->
    <div class="back-btn" @click="goBack">
      <span class="back-icon">←</span>
      <span class="back-text">返回</span>
    </div>

    <div v-if="food" class="detail-container">
      <!-- 视频/图片区域 -->
      <div class="media-section">
        <div class="media-wrapper">
          <!-- 有视频时显示视频 -->
          <template v-if="food.video_url">
            <video 
              ref="videoPlayer"
              class="main-video"
              controls
              preload="metadata"
              :poster="food.image || defaultImage"
              @click="togglePlay"
            >
              <source :src="food.video_url" type="video/mp4" />
              <p>您的浏览器不支持视频播放</p>
            </video>
            <div class="video-label">📹 视频教程</div>
          </template>
          <!-- 无视频时显示图片 -->
          <template v-else>
            <img 
              :src="food.image || defaultImage" 
              :alt="food.name" 
              class="main-image"
            />
          </template>
          <div v-if="food.is_featured" class="feature-tag">👍 推荐菜品</div>
        </div>
      </div>

      <!-- 信息区域 -->
      <div class="info-section">
        <div class="info-header">
          <span class="category-badge">{{ food.category?.name }}</span>
          <div class="rating">
            <span class="stars">⭐⭐⭐⭐⭐</span>
            <span class="score">{{ food.rating || '4.5' }}分</span>
          </div>
        </div>

        <h1 class="food-title">{{ food.name }}</h1>
        
        <p class="food-desc">{{ food.description || '暂无描述' }}</p>

        <!-- 食材清单 -->
        <div class="section ingredients-section">
          <h3 class="section-title">
            <span>🥬</span>
            食材清单
          </h3>
          <div class="ingredients-list">
            <span 
              v-for="(ing, idx) in parsedIngredients" 
              :key="idx"
              class="ingredient-tag"
            >
              {{ ing }}
            </span>
          </div>
        </div>

        <!-- 调料 -->
        <div class="section seasonings-section" v-if="food.seasonings">
          <h3 class="section-title">
            <span>🧂</span>
            所需调料
          </h3>
          <div class="seasonings-list">
            <span 
              v-for="(sea, idx) in parsedSeasonings" 
              :key="idx"
              class="seasoning-tag"
            >
              {{ sea }}
            </span>
          </div>
        </div>

        <!-- 标签 -->
        <div class="tags" v-if="tags.length">
          <span class="tag" v-for="tag in tags" :key="tag">{{ tag }}</span>
        </div>

        <!-- 操作按钮 -->
        <div class="actions">
          <button class="btn-primary" @click="addToCart">
            <span>🛒</span>
            加入今日菜单
          </button>
          <button class="btn-favorite" @click="toggleFavorite">
            <span>{{ isFavorite ? '❤️' : '🤍' }}</span>
            {{ isFavorite ? '已收藏' : '收藏' }}
          </button>
        </div>

        <!-- 信息卡片 -->
        <div class="info-cards">
          <div class="info-card">
            <span class="info-icon">📅</span>
            <div class="info-content">
              <span class="info-label">更新时间</span>
              <span class="info-value">{{ formatDate(food.updated_at) }}</span>
            </div>
          </div>
          <div class="info-card">
            <span class="info-icon">🏷️</span>
            <div class="info-content">
              <span class="info-label">分类</span>
              <span class="info-value">{{ food.category?.name || '未分类' }}</span>
            </div>
          </div>
        </div>

        <!-- 分享提示 -->
        <div class="share-tip">
          <span>💝</span>
          <p>把这道美食加入今日菜单吧</p>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 添加成功提示 -->
    <div v-if="showAddSuccess" class="toast">
      <span>✅</span>
      <span>已添加到今日菜单</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const food = ref<any>(null)
const isFavorite = ref(false)
const showAddSuccess = ref(false)
const videoPlayer = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)

const defaultImage = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop'

const tags = computed(() => {
  if (!food.value?.tags) return []
  return food.value.tags.split(',').filter((t: string) => t.trim())
})

const parsedIngredients = computed(() => {
  if (!food.value?.ingredients) return []
  return food.value.ingredients.split(',').map((i: string) => i.trim()).filter(Boolean)
})

const parsedSeasonings = computed(() => {
  if (!food.value?.seasonings) return []
  return food.value.seasonings.split(',').map((s: string) => s.trim()).filter(Boolean)
})

const fetchFoodDetail = async () => {
  const id = route.params.id
  try {
    const res = await axios.get(`/api/v1/foods/${id}`)
    food.value = res.data.data
  } catch (error) {
    // 模拟数据
    food.value = {
      id: id,
      name: '红烧肉',
      description: '肥而不腻，入口即化的家常红烧肉。选用优质五花肉，经过炖煮，肉质软烂，酱香浓郁。是家庭聚餐的必备硬菜，老人小孩都爱吃。',
      category: { name: '家常菜' },
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
      tags: '下饭菜,经典,家庭聚餐',
      rating: 4.9,
      is_featured: true,
      ingredients: '五花肉500g, 冰糖30g, 生抽2勺, 老抽1勺, 料酒2勺, 生姜3片, 八角2个, 桂皮1小块',
      seasonings: '生抽, 老抽, 料酒, 冰糖, 八角, 桂皮',
      updated_at: new Date().toISOString()
    }
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

const goBack = () => {
  router.back()
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const addToCart = async () => {
  try {
    await axios.post('/api/v1/cart', { food_id: food.value.id, quantity: 1 })
    showAddSuccess.value = true
    setTimeout(() => showAddSuccess.value = false, 2000)
  } catch (error) {
    console.error('添加到购物车失败:', error)
  }
}

// 视频播放控制
const togglePlay = () => {
  if (!videoPlayer.value) return
  if (videoPlayer.value.paused) {
    videoPlayer.value.play()
    isPlaying.value = true
  } else {
    videoPlayer.value.pause()
    isPlaying.value = false
  }
}

onMounted(() => {
  fetchFoodDetail()
})
</script>

<style scoped>
/* 小森美食 - 自然温馨风格详情页 */
.food-detail {
  min-height: 100vh;
  background: linear-gradient(180deg, #FDF8F0 0%, #F5F0E8 100%);
  padding: 20px;
  padding-bottom: 40px;
}

/* 返回按钮 */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 10px 20px;
  border-radius: 25px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  transform: translateX(-5px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.back-icon {
  font-size: 1.2rem;
}

.back-text {
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

/* 容器 */
.detail-container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
}

/* 媒体区域（图片/视频） */
.media-section {
  position: relative;
}

.media-wrapper {
  position: relative;
  overflow: hidden;
  background: #000;
}

.main-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  display: block;
}

.main-video {
  width: 100%;
  height: 350px;
  object-fit: cover;
  display: block;
  cursor: pointer;
}

.video-label {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.feature-tag {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #6B8E6E;
  backdrop-filter: blur(10px);
}

/* 信息区域 */
.info-section {
  padding: 30px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.category-badge {
  background: rgba(107, 142, 110, 0.1);
  color: #6B8E6E;
  padding: 6px 14px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  font-size: 0.9rem;
  letter-spacing: 2px;
}

.score {
  color: #FFB800;
  font-weight: 600;
  font-size: 1rem;
}

.food-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #3D3D3D;
  margin-bottom: 16px;
  line-height: 1.3;
}

.food-desc {
  font-size: 1rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 24px;
}

/* 食材和调料区域 */
.section {
  margin-bottom: 24px;
  padding: 20px;
  background: #FDF8F0;
  border-radius: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 16px;
}

.section-title span {
  font-size: 1.3rem;
}

.ingredients-list,
.seasonings-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ingredient-tag,
.seasoning-tag {
  background: white;
  color: #6B8E6E;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid rgba(107, 142, 110, 0.2);
}

.seasoning-tag {
  background: rgba(212, 165, 116, 0.1);
  color: #D4A574;
  border-color: rgba(212, 165, 116, 0.2);
}

/* 标签 */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.tag {
  background: rgba(107, 142, 110, 0.1);
  color: #6B8E6E;
  padding: 6px 14px;
  border-radius: 15px;
  font-size: 0.9rem;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 15px;
  margin-bottom: 24px;
}

.btn-primary,
.btn-favorite {
  flex: 1;
  padding: 16px 24px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #6B8E6E 0%, #8FBC8F 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(107, 142, 110, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 142, 110, 0.4);
}

.btn-favorite {
  background: white;
  color: #666;
  border: 2px solid #E8E0D5;
}

.btn-favorite:hover {
  border-color: #6B8E6E;
  color: #6B8E6E;
}

/* 信息卡片 */
.info-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 24px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #FAFAFA;
  border-radius: 12px;
}

.info-icon {
  font-size: 1.5rem;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.8rem;
  color: #999;
}

.info-value {
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
}

/* 分享提示 */
.share-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  border-radius: 16px;
  text-align: center;
}

.share-tip span {
  font-size: 1.5rem;
}

.share-tip p {
  color: #2E7D32;
  font-size: 0.95rem;
  font-weight: 500;
}

/* 加载状态 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #E8E0D5;
  border-top-color: #6B8E6E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading p {
  color: #999;
}

/* Toast提示 */
.toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(61, 61, 61, 0.95);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 响应式适配 */
@media (min-width: 768px) and (max-width: 1024px) {
  .detail-container {
    max-width: 90%;
  }
  
  .main-image {
    height: 400px;
  }
  
  .info-section {
    padding: 40px;
  }
}

@media (max-width: 767px) {
  .food-detail {
    padding: 15px;
    padding-bottom: 30px;
  }
  
  .back-btn {
    margin-bottom: 15px;
  }
  
  .detail-container {
    border-radius: 20px;
  }
  
  .main-image {
    height: 280px;
  }
  
  .info-section {
    padding: 24px;
  }
  
  .food-title {
    font-size: 1.5rem;
  }
  
  .food-desc {
    font-size: 0.95rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-favorite {
    width: 100%;
  }
  
  .info-cards {
    grid-template-columns: 1fr;
  }
}
</style>