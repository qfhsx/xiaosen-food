<template>
  <div class="category-list">
    <div class="page-header">
      <h2 class="cyber-title">
        <span class="icon">◇</span>
        分类管理
        <span class="subtitle">CATEGORY MANAGEMENT</span>
      </h2>
      <el-button type="primary" class="cyber-btn" @click="showDialog = true">
        <el-icon><Plus /></el-icon>添加分类
      </el-button>
    </div>

    <div class="header-line"></div>

    <el-card class="cyber-card">
      <el-table :data="categories" v-loading="loading" class="cyber-table" stripe>
        <el-table-column type="index" width="60">
          <template #default="{ $index }">
            <span class="index-num">{{ String($index + 1).padStart(2, '0') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="150">
          <template #default="{ row }">
            <span class="category-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200">
          <template #default="{ row }">
            <span class="desc-text">{{ row.description || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort_order" label="排序" width="100">
          <template #default="{ row }">
            <span class="sort-num">{{ row.sort_order }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" class="action-btn" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" class="action-btn" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="showDialog" :title="isEdit ? '编辑分类' : '添加分类'" width="500px" class="cyber-dialog">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" class="cyber-form">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" class="cyber-input" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" rows="3" placeholder="请输入分类描述" class="cyber-textarea" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort_order" :min="0" class="cyber-input-number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button class="cyber-btn-secondary" @click="showDialog = false">取消</el-button>
        <el-button type="primary" class="cyber-btn" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const categories = ref([])
const loading = ref(false)
const showDialog = ref(false)
const submitLoading = ref(false)
const isEdit = ref(false)
const formRef = ref()

const form = reactive({
  id: '',
  name: '',
  description: '',
  sort_order: 0
})

const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

const fetchCategories = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/v1/categories')
    categories.value = res.data.data || []
  } catch (error) {
    categories.value = [
      { id: 1, name: '日式料理', description: '日本传统美食', sort_order: 1 },
      { id: 2, name: '西式快餐', description: '汉堡披萨等快餐', sort_order: 2 },
      { id: 3, name: '中式美食', description: '中国传统菜肴', sort_order: 3 },
    ]
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.id = ''
  form.name = ''
  form.description = ''
  form.sort_order = 0
  isEdit.value = false
}

const handleEdit = (row: any) => {
  Object.assign(form, row)
  isEdit.value = true
  showDialog.value = true
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除「${row.name}」吗？`, '提示', { type: 'warning' })
    await axios.delete(`/api/v1/categories/${row.id}`)
    ElMessage.success('删除成功')
    fetchCategories()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async () => {
  await formRef.value.validate()
  submitLoading.value = true
  
  try {
    if (isEdit.value) {
      await axios.put(`/api/v1/categories/${form.id}`, form)
      ElMessage.success('更新成功')
    } else {
      await axios.post('/api/v1/categories', form)
      ElMessage.success('创建成功')
    }
    showDialog.value = false
    resetForm()
    fetchCategories()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.category-list { color: #fff; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.cyber-title { display: flex; align-items: center; gap: 12px; font-size: 1.4rem; font-weight: 600; margin: 0; }
.cyber-title .icon { color: #00D4FF; font-size: 1rem; }
.cyber-title .subtitle { font-size: 0.75rem; color: rgba(255, 255, 255, 0.3); font-family: monospace; letter-spacing: 2px; margin-left: 12px; }
.header-line { height: 1px; background: linear-gradient(90deg, rgba(0, 212, 255, 0.5), transparent); margin-bottom: 24px; }

.cyber-btn { background: linear-gradient(135deg, #00D4FF, #0099CC); border: none; }
.cyber-btn-secondary { background: transparent; border: 1px solid rgba(0, 212, 255, 0.3); color: rgba(255, 255, 255, 0.7); }

/* Card 深色系 */
:deep(.cyber-card) { background: linear-gradient(135deg, rgba(18, 18, 26, 0.95), rgba(13, 13, 20, 0.98)) !important; border: 1px solid rgba(0, 212, 255, 0.1) !important; }
:deep(.cyber-card .el-card__body) { background: transparent !important; }

/* Table 深色系 - 完全覆盖 */
:deep(.cyber-table) { background: transparent !important; --el-table-bg-color: transparent !important; --el-table-header-bg-color: rgba(0, 0, 0, 0.4) !important; --el-table-row-hover-bg-color: rgba(0, 212, 255, 0.08) !important; }
:deep(.cyber-table .el-table__header-wrapper) { background: transparent !important; }
:deep(.cyber-table .el-table__body-wrapper) { background: transparent !important; }
:deep(.cyber-table th.el-table__cell) { background: rgba(0, 0, 0, 0.5) !important; color: rgba(255, 255, 255, 0.8) !important; border-bottom: 1px solid rgba(0, 212, 255, 0.2) !important; font-weight: 600; }
:deep(.cyber-table td.el-table__cell) { background: transparent !important; border-bottom: 1px solid rgba(0, 212, 255, 0.1) !important; color: rgba(255, 255, 255, 0.9) !important; }
:deep(.cyber-table tr:hover > td.el-table__cell) { background: rgba(0, 212, 255, 0.1) !important; }
:deep(.cyber-table .el-table__body tr) { background: transparent !important; }
:deep(.cyber-table .el-table__body tr:nth-child(even)) { background: rgba(0, 212, 255, 0.03) !important; }
:deep(.cyber-table .el-table__inner-wrapper::before) { display: none; }
:deep(.cyber-table .cell) { color: inherit; }

.index-num { font-family: monospace; color: rgba(255, 255, 255, 0.4); }
.category-name { color: #fff; font-weight: 500; }
.desc-text { color: rgba(255, 255, 255, 0.6); }
.sort-num { color: #00D4FF; font-family: monospace; }
.action-btn { font-size: 0.85rem; }

/* 对话框样式 */
:deep(.cyber-dialog .el-dialog) { background: linear-gradient(135deg, rgba(18, 18, 26, 0.98), rgba(13, 13, 20, 0.99)) !important; border: 1px solid rgba(0, 212, 255, 0.2) !important; }
:deep(.cyber-dialog .el-dialog__header) { border-bottom: 1px solid rgba(0, 212, 255, 0.1) !important; }
:deep(.cyber-dialog .el-dialog__title) { color: #fff !important; }
:deep(.cyber-dialog .el-dialog__headerbtn .el-dialog__close) { color: rgba(255, 255, 255, 0.5) !important; }
:deep(.cyber-dialog .el-dialog__headerbtn:hover .el-dialog__close) { color: #00D4FF !important; }

.cyber-form :deep(.el-form-item__label) { color: rgba(255, 255, 255, 0.7); }
.cyber-input :deep(.el-input__wrapper) { background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 212, 255, 0.2); box-shadow: none; }
.cyber-input :deep(.el-input__inner) { color: #fff; }
.cyber-textarea :deep(.el-textarea__inner) { background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 212, 255, 0.2); color: #fff; }
.cyber-input-number :deep(.el-input__wrapper) { background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 212, 255, 0.2); }
.cyber-input-number :deep(.el-input__inner) { color: #fff; }
</style>