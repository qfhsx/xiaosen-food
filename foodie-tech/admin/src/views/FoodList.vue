<template>
  <div class="food-list">
    <div class="page-header">
      <h2 class="cyber-title">
        <span class="icon">◈</span>
        美食管理
        <span class="subtitle">FOOD MANAGEMENT</span>
      </h2>
      <el-button type="primary" class="cyber-btn" @click="$router.push('/foods/create')">
        <el-icon><Plus /></el-icon>
        添加美食
      </el-button>
    </div>

    <div class="header-line"></div>

    <el-card class="cyber-card">
      <div class="filter-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索美食名称"
          clearable
          class="cyber-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select v-model="categoryFilter" placeholder="全部分类" clearable class="cyber-select">
          <el-option
            v-for="cat in categories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
          />
        </el-select>
        
        <el-button type="primary" class="cyber-btn" @click="handleSearch">搜索</el-button>
        <el-button class="cyber-btn-secondary" @click="resetFilter">重置</el-button>
      </div>

      <el-table :data="foods" v-loading="loading" class="cyber-table" stripe>
        <el-table-column type="index" width="60">
          <template #default="{ $index }">
            <span class="index-num">{{ String($index + 1).padStart(2, '0') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="90">
          <template #default="{ row }">
            <el-image
              :src="row.image || 'https://via.placeholder.com/80x80/12121A/00D4FF?text=Food'"
              fit="cover"
              class="food-image-small"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="150">
          <template #default="{ row }">
            <div class="food-name-cell">
              <span class="name">{{ row.name }}</span>
              <span v-if="row.is_featured" class="featured-badge">精选</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category.name" label="分类" width="120">
          <template #default="{ row }">
            <span class="category-tag">{{ row.category?.name }}</span>
          </template>
        </el-table-column>
        <!-- 移除了价格列 -->
        <el-table-column label="适用餐点" width="150">
          <template #default="{ row }">
            <div class="meal-tags">
              <span v-for="meal in (row.meals || [])" :key="meal" class="meal-tag">
                {{ meal === 'breakfast' ? '早餐' : meal === 'lunch' ? '午餐' : meal === 'dinner' ? '晚餐' : meal }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rating" label="评分" width="120">
          <template #default="{ row }">
            <div class="rating-cell">
              <span class="star">⭐</span>
              <span class="score">{{ row.rating }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" class="action-btn" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" class="action-btn" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const foods = ref([])
const categories = ref([])
const loading = ref(false)
const searchQuery = ref('')
const categoryFilter = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchFoods = async () => {
  loading.value = true
  try {
    const params: any = { page: page.value, page_size: pageSize.value }
    if (searchQuery.value) params.keyword = searchQuery.value
    if (categoryFilter.value) params.category_id = categoryFilter.value
    
    const res = await axios.get('/api/v1/foods', { params })
    foods.value = res.data.data || []
    total.value = res.data.total || 0
  } catch (error) {
    foods.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const res = await axios.get('/api/v1/categories')
    categories.value = res.data.data || []
  } catch (error) {
    categories.value = []
  }
}

const handleSearch = () => {
  page.value = 1
  fetchFoods()
}

const resetFilter = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  page.value = 1
  fetchFoods()
}

const handleEdit = (row: any) => {
  router.push(`/foods/edit/${row.id}`)
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除「${row.name}」吗？`, '提示', { type: 'warning' })
    await axios.delete(`/api/v1/foods/${row.id}`)
    ElMessage.success('删除成功')
    fetchFoods()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchFoods()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  fetchFoods()
}

onMounted(() => {
  fetchCategories()
  fetchFoods()
})
</script>

<style scoped>
.food-list { color: #fff; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.cyber-title { display: flex; align-items: center; gap: 12px; font-size: 1.4rem; font-weight: 600; margin: 0; }
.cyber-title .icon { color: #00D4FF; font-size: 1rem; }
.cyber-title .subtitle { font-size: 0.75rem; color: rgba(255, 255, 255, 0.3); font-family: monospace; letter-spacing: 2px; margin-left: 12px; }
.header-line { height: 1px; background: linear-gradient(90deg, rgba(0, 212, 255, 0.5), transparent); margin-bottom: 24px; }

.cyber-btn { background: linear-gradient(135deg, #00D4FF, #0099CC); border: none; }
.cyber-btn-secondary { background: transparent; border: 1px solid rgba(0, 212, 255, 0.3); color: rgba(255, 255, 255, 0.7); }

.cyber-card { background: linear-gradient(135deg, rgba(18, 18, 26, 0.8), rgba(13, 13, 20, 0.9)); border: 1px solid rgba(0, 212, 255, 0.1); }

.filter-bar { margin-bottom: 20px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.cyber-input { width: 250px; }
.cyber-input :deep(.el-input__wrapper) { background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 212, 255, 0.2); box-shadow: none; }
.cyber-input :deep(.el-input__inner) { color: #fff; }
.cyber-select { width: 150px; }
.cyber-select :deep(.el-input__wrapper) { background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 212, 255, 0.2); }

.cyber-table { background: transparent; }
:deep(.cyber-table th) { background: rgba(0, 212, 255, 0.05) !important; color: rgba(255, 255, 255, 0.5); border-bottom: 1px solid rgba(0, 212, 255, 0.1); }
:deep(.cyber-table td) { background: transparent !important; border-bottom: 1px solid rgba(0, 212, 255, 0.05); color: rgba(255, 255, 255, 0.8); }
:deep(.cyber-table tr:hover td) { background: rgba(0, 212, 255, 0.05) !important; }

.index-num { font-family: monospace; color: rgba(255, 255, 255, 0.3); }
.food-image-small { width: 60px; height: 60px; border-radius: 8px; border: 1px solid rgba(0, 212, 255, 0.2); }
.food-name-cell { display: flex; align-items: center; gap: 8px; }
.food-name-cell .name { color: #fff; font-weight: 500; }
.featured-badge { background: rgba(0, 212, 255, 0.2); color: #00D4FF; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; }
.category-tag { background: rgba(255, 0, 110, 0.15); color: #FF006E; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; }

.meal-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.meal-tag { background: rgba(0, 255, 136, 0.15); color: #00FF88; padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; }

.rating-cell { display: flex; align-items: center; gap: 6px; }
.rating-cell .star { font-size: 0.9rem; }
.rating-cell .score { color: #FFB800; font-weight: 600; }

.action-btn { font-size: 0.85rem; }

.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
:deep(.el-pagination) { color: rgba(255, 255, 255, 0.6); }
:deep(.el-pagination .el-pager li) { background: transparent; }
:deep(.el-pagination .el-pager li.active) { background: rgba(0, 212, 255, 0.2); color: #00D4FF; }
:deep(.el-pagination button) { background: transparent; color: rgba(255, 255, 255, 0.6); }
</style>