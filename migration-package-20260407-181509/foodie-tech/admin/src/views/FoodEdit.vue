<template>
  <div class="food-edit">
    <div class="page-header">
      <h2 class="cyber-title">
        <span class="icon">◈</span>
        {{ isEdit ? '编辑美食' : '添加美食' }}
        <span class="subtitle">{{ isEdit ? 'EDIT FOOD' : 'ADD FOOD' }}</span>
      </h2>
    </div>
    <div class="header-line"></div>

    <el-card class="cyber-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="cyber-form">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入美食名称" class="cyber-input" />
        </el-form-item>

        <el-form-item label="分类" prop="category_id">
          <el-select v-model="form.category_id" placeholder="选择分类" class="cyber-select">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>

        <!-- 适用餐点 -->
        <el-form-item label="适用餐点" prop="meals">
          <el-checkbox-group v-model="form.meals" class="meal-checkbox-group">
            <el-checkbox label="breakfast" class="meal-checkbox">
              <span class="meal-icon">🌅</span> 早餐
            </el-checkbox>
            <el-checkbox label="lunch" class="meal-checkbox">
              <span class="meal-icon">☀️</span> 午餐
            </el-checkbox>
            <el-checkbox label="dinner" class="meal-checkbox">
              <span class="meal-icon">🌙</span> 晚餐
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 移除了价格 -->

        <el-form-item label="图片" prop="image">
          <el-input v-model="form.image" placeholder="图片URL地址" class="cyber-input">
            <template #append>
              <el-button class="preview-btn" @click="previewImage">预览</el-button>
            </template>
          </el-input>
          <div v-if="form.image" class="image-preview">
            <img :src="form.image" alt="预览" />
          </div>
        </el-form-item>

        <el-form-item label="评分" prop="rating">
          <el-rate v-model="form.rating" show-score class="cyber-rate" />
        </el-form-item>

        <el-form-item label="食材" prop="ingredients">
          <el-input
            v-model="form.ingredients"
            type="textarea"
            :rows="3"
            placeholder="请输入食材清单，用逗号分隔，如：五花肉500g, 鸡蛋2个, 生抽2勺"
            class="cyber-textarea"
          />
        </el-form-item>

        <el-form-item label="调料" prop="seasonings">
          <el-input
            v-model="form.seasonings"
            type="textarea"
            :rows="2"
            placeholder="请输入所需调料，用逗号分隔，如：生抽, 老抽, 料酒, 盐"
            class="cyber-textarea"
          />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入美食描述"
            class="cyber-textarea"
          />
        </el-form-item>

        <el-form-item label="精选推荐" prop="is_featured">
          <el-switch v-model="form.is_featured" class="cyber-switch" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="cyber-btn" :loading="loading" @click="handleSubmit">
            {{ isEdit ? '保存修改' : '创建美食' }}
          </el-button>
          <el-button class="cyber-btn-secondary" @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const loading = ref(false)
const categories = ref([])

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  name: '',
  category_id: '',
  meals: ['lunch', 'dinner'],
  image: '',
  rating: 4,
  ingredients: '',
  seasonings: '',
  description: '',
  is_featured: false
})

const rules = {
  name: [{ required: true, message: '请输入美食名称', trigger: 'blur' }],
  category_id: [{ required: true, message: '请选择分类', trigger: 'change' }],
  meals: [{ required: true, message: '请选择适用餐点', trigger: 'change' }]
}

const fetchCategories = async () => {
  try {
    const res = await axios.get('/api/v1/categories')
    categories.value = res.data.data || []
  } catch (error) {
    categories.value = []
  }
}

const fetchFood = async () => {
  if (!isEdit.value) return
  try {
    const res = await axios.get(`/api/v1/foods/${route.params.id}`)
    const data = res.data.data
    Object.assign(form, data)
  } catch (error) {
    ElMessage.error('获取美食信息失败')
  }
}

const previewImage = () => {
  if (!form.image) {
    ElMessage.warning('请先输入图片地址')
  }
}

const handleSubmit = async () => {
  await formRef.value.validate()
  loading.value = true
  
  try {
    if (isEdit.value) {
      await axios.put(`/api/v1/foods/${route.params.id}`, form)
      ElMessage.success('更新成功')
    } else {
      await axios.post('/api/v1/foods', form)
      ElMessage.success('创建成功')
    }
    router.push('/foods')
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
  fetchFood()
})
</script>

<style scoped>
.food-edit { color: #fff; }
.page-header { margin-bottom: 16px; }
.cyber-title { display: flex; align-items: center; gap: 12px; font-size: 1.4rem; font-weight: 600; margin: 0; }
.cyber-title .icon { color: #00D4FF; font-size: 1rem; }
.cyber-title .subtitle { font-size: 0.75rem; color: rgba(255, 255, 255, 0.3); font-family: monospace; letter-spacing: 2px; margin-left: 12px; }
.header-line { height: 1px; background: linear-gradient(90deg, rgba(0, 212, 255, 0.5), transparent); margin-bottom: 24px; }

.cyber-card { background: linear-gradient(135deg, rgba(18, 18, 26, 0.8), rgba(13, 13, 20, 0.9)); border: 1px solid rgba(0, 212, 255, 0.1); }

.cyber-form { max-width: 700px; }

:deep(.el-form-item__label) { color: rgba(255, 255, 255, 0.7); }

.cyber-input :deep(.el-input__wrapper) { background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 212, 255, 0.2); box-shadow: none; }
.cyber-input :deep(.el-input__inner) { color: #fff; }
.cyber-input :deep(.el-input__inner::placeholder) { color: rgba(255, 255, 255, 0.3); }

.cyber-select { width: 100%; }
.cyber-select :deep(.el-input__wrapper) { background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 212, 255, 0.2); }

/* 餐点多选框 */
.meal-checkbox-group { display: flex; gap: 20px; }
.meal-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) { background-color: #00D4FF; border-color: #00D4FF; }
.meal-checkbox :deep(.el-checkbox__input.is-checked + .el-checkbox__label) { color: #00D4FF; }
.meal-checkbox :deep(.el-checkbox__label) { color: rgba(255, 255, 255, 0.8); display: flex; align-items: center; gap: 6px; }
.meal-icon { font-size: 1.2rem; }

.preview-btn { background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); color: #00D4FF; }
.preview-btn:hover { background: rgba(0, 212, 255, 0.2); }

.image-preview { margin-top: 12px; width: 200px; height: 150px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(0, 212, 255, 0.2); }
.image-preview img { width: 100%; height: 100%; object-fit: cover; }

.cyber-rate :deep(.el-rate__icon) { font-size: 1.5rem; }
.cyber-rate :deep(.el-rate__text) { color: #FFB800; }

.cyber-textarea :deep(.el-textarea__inner) { background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 212, 255, 0.2); color: #fff; }
.cyber-textarea :deep(.el-textarea__inner::placeholder) { color: rgba(255, 255, 255, 0.3); }

.cyber-switch :deep(.el-switch__core) { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2); }
.cyber-switch.is-checked :deep(.el-switch__core) { background: #00D4FF; border-color: #00D4FF; }

.cyber-btn { background: linear-gradient(135deg, #00D4FF, #0099CC); border: none; margin-right: 12px; }
.cyber-btn-secondary { background: transparent; border: 1px solid rgba(0, 212, 255, 0.3); color: rgba(255, 255, 255, 0.7); }
.cyber-btn-secondary:hover { border-color: #00D4FF; color: #00D4FF; }
</style>