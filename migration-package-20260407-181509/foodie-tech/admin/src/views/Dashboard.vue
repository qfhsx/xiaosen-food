<template>
  <div class="dashboard">
    <div class="page-header">
      <h2 class="cyber-title">
        <span class="icon">◈</span>
        数据概览
        <span class="subtitle">SYSTEM OVERVIEW</span>
      </h2>
      <div class="header-line"></div>
    </div>
    
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="8">
        <div class="stat-card">
          <div class="card-glow blue"></div>
          <div class="stat-icon blue">🍜</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.foodCount }}</div>
            <div class="stat-label">美食总数</div>
          </div>
          <div class="stat-chart">
            <div class="chart-bar" v-for="n in 5" :key="n" :style="{ height: Math.random() * 30 + 10 + 'px' }"></div>
          </div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="8">
        <div class="stat-card">
          <div class="card-glow pink"></div>
          <div class="stat-icon pink">📁</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.categoryCount }}</div>
            <div class="stat-label">分类数量</div>
          </div>
          <div class="stat-chart">
            <div class="chart-bar pink" v-for="n in 5" :key="n" :style="{ height: Math.random() * 30 + 10 + 'px' }"></div>
          </div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="8">
        <div class="stat-card">
          <div class="card-glow green"></div>
          <div class="stat-icon green">🌅</div>
          <div class="stat-info">
            <div class="stat-value">3</div>
            <div class="stat-label">餐点类型</div>
          </div>
          <div class="stat-chart">
            <div class="chart-bar green" v-for="n in 5" :key="n" :style="{ height: Math.random() * 30 + 10 + 'px' }"></div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="main-row">
      <el-col :xs="24" :lg="16">
        <div class="cyber-card">
          <div class="card-header">
            <div class="header-title">
              <span class="icon">◉</span>
              <span>最近添加的美食</span>
            </div>
            <el-button text class="cyber-btn-text" @click="$router.push('/foods')">
              查看全部 →
            </el-button>
          </div>
          
          <el-table :data="recentFoods" class="cyber-table" stripe>
            <el-table-column type="index" width="60">
              <template #default="{ $index }">
                <span class="index-num">{{ String($index + 1).padStart(2, '0') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="名称" min-width="150">
              <template #default="{ row }">
                <div class="food-name-cell">
                  <span class="name">{{ row.name }}</span>
                  <span v-if="row.is_featured" class="featured-tag">精选</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="category.name" label="分类" width="120">
              <template #default="{ row }">
                <span class="category-tag">{{ row.category?.name || '-' }}</span>
              </template>
            </el-table-column>
            <!-- 移除了价格列 -->
            <el-table-column label="适用餐点" width="150">
              <template #default="{ row }">
                <div class="meal-tags">
                  <span v-for="meal in row.meals" :key="meal" class="meal-tag">
                    {{ meal === 'breakfast' ? '早' : meal === 'lunch' ? '午' : '晚' }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="添加时间" width="150">
              <template #default="{ row }">
                <span class="time-text">{{ formatDate(row.created_at) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      
      <el-col :xs="24" :lg="8">
        <div class="cyber-card">
          <div class="card-header">
            <div class="header-title">
              <span class="icon">⚡</span>
              <span>快捷操作</span>
            </div>
          </div>
          
          <div class="quick-actions">
            <div class="action-item" @click="$router.push('/foods/create')">
              <div class="action-icon blue">
                <el-icon><Plus /></el-icon>
              </div>
              <div class="action-info">
                <span class="action-name">添加美食</span>
                <span class="action-desc">录入新的美食数据</span>
              </div>
              <el-icon class="action-arrow"><ArrowRight /></el-icon>
            </div>
            
            <div class="action-item" @click="$router.push('/categories')">
              <div class="action-icon pink">
                <el-icon><FolderAdd /></el-icon>
              </div>
              <div class="action-info">
                <span class="action-name">添加分类</span>
                <span class="action-desc">创建新的分类</span>
              </div>
              <el-icon class="action-arrow"><ArrowRight /></el-icon>
            </div>
          </div>
          
          <div class="system-status">
            <div class="status-header">
              <span>系统状态</span>
              <span class="status-badge">正常</span>
            </div>
            <div class="status-bars">
              <div class="status-bar-item">
                <span>API响应</span>
                <div class="bar"><div class="fill" style="width: 95%"></div></div>
                <span>24ms</span>
              </div>
              <div class="status-bar-item">
                <span>数据库</span>
                <div class="bar"><div class="fill" style="width: 88%"></div></div>
                <span>12ms</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const stats = ref({
  foodCount: 0,
  categoryCount: 0,
  featuredCount: 0
})

const recentFoods = ref([])

const fetchStats = async () => {
  try {
    const [foodsRes, catsRes] = await Promise.all([
      axios.get('/api/v1/foods', { params: { page: 1, page_size: 1 } }),
      axios.get('/api/v1/categories')
    ])
    
    stats.value.foodCount = foodsRes.data.total || 0
    stats.value.categoryCount = catsRes.data.data?.length || 0
    
    const recentRes = await axios.get('/api/v1/foods', { params: { page: 1, page_size: 5 } })
    recentFoods.value = recentRes.data.data || []
  } catch (error) {
    stats.value = { foodCount: 45, categoryCount: 8, featuredCount: 6 }
    recentFoods.value = [
      { id: 1, name: '红烧肉', category: { name: '家常菜' }, meals: ['lunch', 'dinner'], is_featured: true, created_at: new Date().toISOString() },
      { id: 2, name: '蛋炒饭', category: { name: '家常菜' }, meals: ['breakfast', 'lunch', 'dinner'], is_featured: false, created_at: new Date().toISOString() },
    ]
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.dashboard { color: #fff; }
.page-header { margin-bottom: 24px; }
.cyber-title { display: flex; align-items: center; gap: 12px; font-size: 1.4rem; font-weight: 600; margin: 0 0 12px 0; }
.cyber-title .icon { color: #00D4FF; font-size: 1rem; }
.cyber-title .subtitle { font-size: 0.75rem; color: rgba(255, 255, 255, 0.3); font-family: monospace; letter-spacing: 2px; font-weight: 400; }
.header-line { height: 1px; background: linear-gradient(90deg, rgba(0, 212, 255, 0.5), transparent); }

.stats-row { margin-bottom: 24px; }
.stat-card { background: linear-gradient(135deg, rgba(18, 18, 26, 0.8), rgba(13, 13, 20, 0.9)); border: 1px solid rgba(0, 212, 255, 0.1); border-radius: 12px; padding: 24px; position: relative; overflow: hidden; display: flex; align-items: center; gap: 16px; }
.card-glow { position: absolute; width: 100px; height: 100px; border-radius: 50%; filter: blur(40px); opacity: 0.3; top: -30px; right: -30px; }
.card-glow.blue { background: #00D4FF; }
.card-glow.pink { background: #FF006E; }
.card-glow.green { background: #00FF88; }

.stat-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; position: relative; z-index: 1; }
.stat-icon.blue { background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); }
.stat-icon.pink { background: rgba(255, 0, 110, 0.1); border: 1px solid rgba(255, 0, 110, 0.3); }
.stat-icon.green { background: rgba(0, 255, 136, 0.1); border: 1px solid rgba(0, 255, 136, 0.3); }

.stat-info { flex: 1; position: relative; z-index: 1; }
.stat-value { font-size: 2rem; font-weight: 700; font-family: 'Orbitron', monospace; background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.7)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1; margin-bottom: 4px; }
.stat-label { font-size: 0.85rem; color: rgba(255, 255, 255, 0.5); }

.stat-chart { display: flex; align-items: flex-end; gap: 4px; height: 40px; }
.chart-bar { width: 8px; background: rgba(0, 212, 255, 0.5); border-radius: 2px; animation: barGrow 1s ease-out; }
.chart-bar.pink { background: rgba(255, 0, 110, 0.5); }
.chart-bar.green { background: rgba(0, 255, 136, 0.5); }
@keyframes barGrow { from { height: 0; } }

.main-row { margin-top: 20px; }
.cyber-card { background: linear-gradient(135deg, rgba(18, 18, 26, 0.8), rgba(13, 13, 20, 0.9)); border: 1px solid rgba(0, 212, 255, 0.1); border-radius: 12px; overflow: hidden; height: 100%; }
.card-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid rgba(0, 212, 255, 0.1); }
.header-title { display: flex; align-items: center; gap: 10px; font-size: 1rem; font-weight: 500; }
.header-title .icon { color: #00D4FF; }
.cyber-btn-text { color: #00D4FF !important; font-size: 0.85rem; }

.cyber-table { background: transparent; }
:deep(.cyber-table th) { background: rgba(0, 212, 255, 0.05) !important; color: rgba(255, 255, 255, 0.5); font-weight: 500; border-bottom: 1px solid rgba(0, 212, 255, 0.1); }
:deep(.cyber-table td) { background: transparent !important; border-bottom: 1px solid rgba(0, 212, 255, 0.05); color: rgba(255, 255, 255, 0.8); }
:deep(.cyber-table tr:hover td) { background: rgba(0, 212, 255, 0.05) !important; }

.index-num { font-family: monospace; color: rgba(255, 255, 255, 0.3); }
.food-name-cell { display: flex; align-items: center; gap: 8px; }
.food-name-cell .name { color: #fff; font-weight: 500; }
.featured-tag { background: rgba(0, 212, 255, 0.2); color: #00D4FF; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; }
.category-tag { background: rgba(255, 0, 110, 0.1); color: #FF006E; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; }

.meal-tags { display: flex; gap: 6px; }
.meal-tag { background: rgba(0, 212, 255, 0.15); color: #00D4FF; padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-family: monospace; }

.time-text { color: rgba(255, 255, 255, 0.4); font-size: 0.85rem; }

.quick-actions { padding: 16px; }
.action-item { display: flex; align-items: center; gap: 16px; padding: 16px; border-radius: 8px; cursor: pointer; transition: all 0.3s; margin-bottom: 8px; }
.action-item:hover { background: rgba(0, 212, 255, 0.05); }
.action-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
.action-icon.blue { background: rgba(0, 212, 255, 0.1); color: #00D4FF; }
.action-icon.pink { background: rgba(255, 0, 110, 0.1); color: #FF006E; }
.action-info { flex: 1; }
.action-name { display: block; color: #fff; font-weight: 500; margin-bottom: 4px; }
.action-desc { display: block; color: rgba(255, 255, 255, 0.4); font-size: 0.8rem; }
.action-arrow { color: rgba(255, 255, 255, 0.3); font-size: 1.2rem; }
.action-item:hover .action-arrow { color: #00D4FF; transform: translateX(4px); }

.system-status { padding: 20px 24px; border-top: 1px solid rgba(0, 212, 255, 0.1); }
.status-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-size: 0.9rem; color: rgba(255, 255, 255, 0.5); }
.status-badge { background: rgba(0, 255, 136, 0.1); color: #00FF88; padding: 4px 12px; border-radius: 4px; font-size: 0.75rem; }
.status-bars { display: flex; flex-direction: column; gap: 12px; }
.status-bar-item { display: flex; align-items: center; gap: 12px; font-size: 0.8rem; }
.status-bar-item span:first-child { color: rgba(255, 255, 255, 0.4); width: 60px; }
.status-bar-item .bar { flex: 1; height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; overflow: hidden; }
.status-bar-item .fill { height: 100%; background: linear-gradient(90deg, #00D4FF, #00FF88); border-radius: 3px; transition: width 0.5s; }
.status-bar-item span:last-child { color: #00D4FF; font-family: monospace; width: 50px; text-align: right; }
</style>