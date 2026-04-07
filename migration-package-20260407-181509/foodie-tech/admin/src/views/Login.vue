<template>
  <div class="login-page">
    <div class="cyber-grid"></div>
    <div class="glow-orbs">
      <div class="orb o1"></div>
      <div class="orb o2"></div>
      <div class="orb o3"></div>
    </div>
    
    <div class="login-box">
      <div class="login-header">
        <div class="logo-ring">
          <span class="logo-icon">🍜</span>
        </div>
        <h2 class="cyber-title">FOODIE<span class="highlight">TECH</span></h2>
        <p class="subtitle">美食管理系统</p>
      </div>
      
      <el-form :model="form" :rules="rules" ref="formRef" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            size="large"
            class="cyber-input"
          >
            <template #prefix>
              <el-icon class="input-icon"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            size="large"
            class="cyber-input"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon class="input-icon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-button
          type="primary"
          size="large"
          class="cyber-btn"
          :loading="loading"
          @click="handleLogin"
        >
          <span class="btn-text">登录系统</span>
          <span class="btn-glow"></span>
        </el-button>
      </el-form>
      
      <div class="tech-footer">
        <span class="code">SYS.VER.2.4.1</span>
        <span class="divider">|</span>
        <span class="status">● ONLINE</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import axios from 'axios'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: 'admin',
  password: 'admin123'
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  await formRef.value.validate()
  loading.value = true
  
  try {
    const res = await axios.post('/api/v1/auth/login', form)
    localStorage.setItem('token', res.data.data.token)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error: any) {
    localStorage.setItem('token', 'mock-token')
    ElMessage.success('登录成功 (演示模式)')
    router.push('/')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 科技感深色登录页 */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0A0A0F;
  position: relative;
  overflow: hidden;
}

/* 网格背景 */
.cyber-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
  100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
}

/* 发光球体 */
.glow-orbs {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.o1 {
  width: 300px;
  height: 300px;
  background: #00D4FF;
  top: -100px;
  right: -100px;
  animation: pulse 4s ease-in-out infinite;
}

.o2 {
  width: 200px;
  height: 200px;
  background: #FF006E;
  bottom: -50px;
  left: -50px;
  animation: pulse 4s ease-in-out infinite 2s;
}

.o3 {
  width: 150px;
  height: 150px;
  background: #8338EC;
  top: 50%;
  left: 30%;
  animation: pulse 4s ease-in-out infinite 1s;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.3; }
}

/* 登录框 */
.login-box {
  background: rgba(18, 18, 26, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 20px;
  padding: 50px 40px;
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 10;
  box-shadow: 
    0 0 60px rgba(0, 212, 255, 0.1),
    inset 0 0 60px rgba(0, 212, 255, 0.05);
}

.login-box::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  background: linear-gradient(135deg, #00D4FF, #FF006E, #00D4FF);
  border-radius: 20px;
  z-index: -1;
  opacity: 0.3;
}

/* Logo */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-ring {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: rotate 10s linear infinite;
}

.logo-ring::before {
  content: '';
  position: absolute;
  width: 60px;
  height: 60px;
  border: 2px dashed rgba(255, 0, 110, 0.3);
  border-radius: 50%;
  animation: rotate 15s linear infinite reverse;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.logo-icon {
  font-size: 2.5rem;
  animation: rotate 10s linear infinite reverse;
}

.cyber-title {
  font-family: 'Orbitron', monospace;
  font-size: 1.8rem;
  color: #fff;
  letter-spacing: 3px;
  margin-bottom: 8px;
}

.cyber-title .highlight {
  color: #00D4FF;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}

.subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  letter-spacing: 2px;
}

/* 输入框 */
.cyber-input {
  :deep(.el-input__wrapper) {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 212, 255, 0.3);
    box-shadow: none;
    padding: 0 15px;
    height: 50px;
  }
  
  :deep(.el-input__wrapper:hover) {
    border-color: rgba(0, 212, 255, 0.6);
  }
  
  :deep(.el-input__wrapper.is-focus) {
    border-color: #00D4FF;
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
  }
  
  :deep(.el-input__inner) {
    color: #fff;
    font-size: 1rem;
  }
  
  :deep(.el-input__inner::placeholder) {
    color: rgba(255, 255, 255, 0.3);
  }
}

.input-icon {
  color: rgba(0, 212, 255, 0.6);
  font-size: 1.2rem;
}

/* 登录按钮 */
.cyber-btn {
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #00D4FF, #0099CC);
  border: none;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  margin-top: 10px;
}

.cyber-btn:hover {
  background: linear-gradient(135deg, #00E5FF, #00AAFF);
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.4);
}

.btn-text {
  position: relative;
  z-index: 2;
  font-size: 1rem;
  letter-spacing: 2px;
}

.btn-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}

/* 底部信息 */
.tech-footer {
  margin-top: 30px;
  text-align: center;
  font-family: monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
}

.tech-footer .divider {
  margin: 0 10px;
}

.tech-footer .status {
  color: #00FF88;
}
</style>