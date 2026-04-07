# FoodieTech - 美食网站系统

## 快速启动

### 方式一：Docker Compose 一键部署（推荐）

```bash
# 1. 进入项目目录
cd foodie-tech

# 2. 启动所有服务
docker-compose up -d

# 3. 等待服务启动（约30秒）
docker-compose logs -f

# 4. 访问服务
# 前端网站: http://localhost:8080
# 管理系统: http://localhost:8081
# 后端API: http://localhost:8082
# MySQL: localhost:3306
```

### 方式二：本地开发环境

**1. 启动 MySQL**
```bash
docker run -d \
  --name mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=foodie_tech \
  -p 3306:3306 \
  mysql:8.0
```

**2. 启动后端**
```bash
cd backend
cp .env.example .env
go mod download
go run cmd/main.go
# 后端运行在 http://localhost:8080
```

**3. 启动前端**
```bash
cd frontend
npm install
npm run dev
# 前端运行在 http://localhost:3000
```

**4. 启动管理系统**
```bash
cd admin
npm install
npm run dev
# 管理后台运行在 http://localhost:3001
```

## 默认账号

管理系统登录：
- 用户名：admin
- 密码：admin123

## 项目结构

```
foodie-tech/
├── backend/          # Go后端服务
├── frontend/         # 前端展示网站 (Vue3)
├── admin/            # 管理后台 (Vue3)
└── docker-compose.yml
```

## 技术栈

- **后端**: Go + Gin + GORM + MySQL
- **前端**: Vue3 + TypeScript + Element Plus
- **部署**: Docker + Docker Compose

## 页面风格

科技感设计主题：
- 主色: #00D4FF (霓虹蓝)
- 辅色: #FF006E (霓虹粉)
- 背景: #0A0A0F (深空黑)
- 特效: 发光、浮动、渐变