<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

<style>
:root {
  /* 小森美食 - 自然温馨配色 */
  --primary: #6B8E6E;        /* 森林绿 */
  --primary-light: #8FBC8F;  /* 浅绿 */
  --secondary: #D4A574;      /* 木色 */
  --accent: #F4A460;         /* 沙棕色 */
  --bg-cream: #FDF8F0;       /* 米白 */
  --bg-white: #FFFFFF;
  --bg-card: #F5F0E8;        /* 暖白 */
  --text-primary: #3D3D3D;   /* 深灰 */
  --text-secondary: #6B6B6B; /* 中灰 */
  --text-light: #999999;     /* 浅灰 */
  --border: #E8E0D5;         /* 暖边框 */
  --shadow: rgba(107, 142, 110, 0.15);
  --gradient-nature: linear-gradient(135deg, #6B8E6E 0%, #8FBC8F 100%);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html {
  font-size: 16px;
}

@media (max-width: 375px) {
  html { font-size: 14px; }
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: var(--bg-cream);
  color: var(--text-primary);
  min-height: 100vh;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

#app {
  min-height: 100vh;
}

/* 自然按钮 */
.btn-nature {
  background: var(--gradient-nature);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px var(--shadow);
}

.btn-nature:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 142, 110, 0.3);
}

.btn-nature:active {
  transform: translateY(0);
}

/* 卡片样式 */
.card-nature {
  background: var(--bg-white);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card-nature:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  transform: translateY(-4px);
}

/* 标签样式 */
.tag-nature {
  background: rgba(107, 142, 110, 0.1);
  color: var(--primary);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
}

/* 滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-cream);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-light);
  border-radius: 3px;
}

/* 安全区域适配 */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

/* 动画 */
@keyframes float-nature {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-float-nature {
  animation: float-nature 3s ease-in-out infinite;
}
</style>