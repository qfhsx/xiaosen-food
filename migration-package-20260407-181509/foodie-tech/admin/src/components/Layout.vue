<template>
  <el-container class="layout">
    <el-aside width="260px" class="sidebar">
      <div class="sidebar-bg"></div>
      <div class="logo">
        <div class="logo-pulse"></div>
        <span class="logo-icon">🍜</span>
        <div class="logo-text">
          <span class="main">FOODIE</span>
          <span class="sub">TECH</span>
        </div>
      </div>
      
      <div class="menu-header">
        <span class="line"></span>
        <span class="text">MAIN MENU</span>
        <span class="line"></span>
      </div>
      
      <el-menu
        :default-active="$route.path"
        router
        class="cyber-menu"
        background-color="transparent"
        text-color="rgba(255,255,255,0.6)"
        active-text-color="#00D4FF"
      >
        <el-menu-item index="/" class="menu-item">
          <el-icon class="menu-icon"><DataLine /></el-icon>
          <span class="menu-text">数据面板</span>
          <div class="menu-glow"></div>
        </el-menu-item>
        
        <el-menu-item index="/foods" class="menu-item">
          <el-icon class="menu-icon"><Food /></el-icon>
          <span class="menu-text">美食管理</span>
          <div class="menu-glow"></div>
        </el-menu-item>
        
        <el-menu-item index="/categories" class="menu-item">
          <el-icon class="menu-icon"><FolderOpened /></el-icon>
          <span class="menu-text">分类管理</span>
          <div class="menu-glow"></div>
        </el-menu-item>
      </el-menu>
      
      <div class="sidebar-footer">
        <div class="system-info">
          <div class="info-item">
            <span class="label">CPU</span>
            <div class="bar"><div class="fill" style="width: 32%"></div></div>
            <span class="value">32%</span>
          </div>
          <div class="info-item">
            <span class="label">MEM</span>
            <div class="bar"><div class="fill" style="width: 45%"></div></div>
            <span class="value">45%</span>
          </div>
        </div>
        <div class="version">v2.4.1 BUILD 2024</div>
      </div>
    </el-aside>
    
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <div class="breadcrumb">
            <span class="bc-icon">⌘</span>
            <span class="bc-text">{{ $route.path === '/' ? 'DASHBOARD' : $route.path.replace('/', '').toUpperCase() }}</span>
          </div>
        </div>
        
        <div class="header-center">
          <div class="live-indicator">
            <span class="pulse"></span>
            <span class="text">SYSTEM ONLINE</span>
          </div>
        </div>
        
        <div class="header-right">
          <div class="time-display">
            <span class="time">{{ currentTime }}</span>
            <span class="date">{{ currentDate }}</span>
          </div>
          
          <el-dropdown @command="handleCommand" class="user-dropdown">
            <div class="user-info">
              <div class="avatar-ring">
                <el-avatar :size="36" class="user-avatar">A</el-avatar>
              </div>
              <div class="user-meta">
                <span class="name">ADMIN</span>
                <span class="role">超级管理员</span>
              </div>
              <el-icon class="arrow"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="cyber-dropdown">
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentTime = ref('')
const currentDate = ref('')
let timer: any = null

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  currentDate.value = now.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', weekday: 'short' })
}

const handleCommand = (command: string) => {
  if (command === 'logout') {
    localStorage.removeItem('token')
    router.push('/login')
  }
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* 科技感深色布局 */
.layout {
  min-height: 100vh;
  background: #0A0A0F;
}

/* 侧边栏 */
.sidebar {
  background: linear-gradient(180deg, #0D0D14 0%, #12121A 100%);
  border-right: 1px solid rgba(0, 212, 255, 0.1);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.sidebar-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.02) 1px, transparent 1px);
  background-size: 100% 4px;
  pointer-events: none;
}

.logo {
  height: 80px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
  position: relative;
}

.logo-pulse {
  position: absolute;
  width: 40px;
  height: 40px;
  background: rgba(0, 212, 255, 0.2);
  border-radius: 50%;
  left: 24px;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.3); opacity: 0; }
}

.logo-icon {
  font-size: 1.8rem;
  z-index: 1;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-text .main {
  font-family: 'Orbitron', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
}

.logo-text .sub {
  font-family: 'Orbitron', monospace;
  font-size: 0.8rem;
  color: #00D4FF;
  letter-spacing: 3px;
}

/* 菜单标题 */
.menu-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 24px 10px;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 2px;
}

.menu-header .line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent);
}

/* 菜单 */
.cyber-menu {
  border-right: none;
  flex: 1;
}

.menu-item {
  height: 56px;
  line-height: 56px;
  margin: 8px 16px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.menu-item:hover {
  background: rgba(0, 212, 255, 0.1) !important;
}

.menu-item.is-active {
  background: rgba(0, 212, 255, 0.15) !important;
}

.menu-item.is-active .menu-glow {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #00D4FF;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
}

.menu-icon {
  font-size: 1.3rem;
  margin-right: 12px;
}

.menu-text {
  font-size: 0.95rem;
  letter-spacing: 1px;
}

/* 侧边栏底部 */
.sidebar-footer {
  padding: 20px 24px;
  border-top: 1px solid rgba(0, 212, 255, 0.1);
}

.system-info {
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 0.7rem;
}

.info-item .label {
  color: rgba(255, 255, 255, 0.4);
  width: 30px;
  font-family: monospace;
}

.info-item .bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.info-item .fill {
  height: 100%;
  background: linear-gradient(90deg, #00D4FF, #00FF88);
  border-radius: 2px;
  transition: width 0.5s;
}

.info-item .value {
  color: #00D4FF;
  font-family: monospace;
  width: 35px;
  text-align: right;
}

.version {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.3);
  text-align: center;
  font-family: monospace;
}

/* 顶部栏 */
.header {
  background: rgba(13, 13, 20, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 260px;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 99;
  height: 70px;
  padding: 0 30px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bc-icon {
  color: #00D4FF;
  font-size: 1.1rem;
}

.bc-text {
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 1px;
}

/* 在线指示器 */
.live-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 255, 136, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(0, 255, 136, 0.2);
}

.live-indicator .pulse {
  width: 8px;
  height: 8px;
  background: #00FF88;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; box-shadow: 0 0 10px #00FF88; }
  50% { opacity: 0.5; box-shadow: 0 0 20px #00FF88; }
}

.live-indicator .text {
  color: #00FF88;
  font-size: 0.75rem;
  font-family: monospace;
  letter-spacing: 1px;
}

/* 时间和用户 */
.header-right {
  display: flex;
  align-items: center;
  gap: 30px;
}

.time-display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.time-display .time {
  color: #00D4FF;
  font-family: 'Orbitron', monospace;
  font-size: 1.1rem;
  letter-spacing: 2px;
}

.time-display .date {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.05);
}

.avatar-ring {
  padding: 2px;
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-radius: 50%;
}

.user-avatar {
  background: linear-gradient(135deg, #00D4FF, #0099CC);
  color: #fff;
  font-weight: 600;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-meta .name {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
}

.user-meta .role {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
}

.arrow {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
}

/* 主内容区 */
.main {
  margin-left: 260px;
  margin-top: 70px;
  background: #0A0A0F;
  min-height: calc(100vh - 70px);
  padding: 24px;
}

/* 下拉菜单 */
:global(.cyber-dropdown) {
  background: #12121A !important;
  border: 1px solid rgba(0, 212, 255, 0.2) !important;
}

:global(.cyber-dropdown .el-dropdown-menu__item) {
  color: rgba(255, 255, 255, 0.7) !important;
}

:global(.cyber-dropdown .el-dropdown-menu__item:hover) {
  background: rgba(0, 212, 255, 0.1) !important;
  color: #00D4FF !important;
}
</style>