# 美食网站系统 - FoodieTech

## 项目简介
一个前后端分离的科技感美食网站系统，采用 Go + Vue3 + Docker 技术栈。

## 技术架构

### 后端 (backend/)
- **语言**: Go 1.21+
- **框架**: Gin Web Framework
- **ORM**: GORM
- **数据库**: MySQL 8.0
- **API**: RESTful API

### 前端 (frontend/)
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI框架**: Element Plus (科技感主题定制)
- **HTTP客户端**: Axios

### 管理系统 (admin/)
- **框架**: Vue 3 + TypeScript
- **UI框架**: Element Plus
- **功能**: 美食数据录入、图片上传、内容管理

### 部署
- **容器化**: Docker + Docker Compose
- **数据库**: MySQL (容器内运行)

## 项目结构
```
foodie-tech/
├── backend/          # Go后端服务
│   ├── cmd/          # 入口程序
│   ├── internal/     # 内部代码
│   │   ├── handler/  # HTTP处理器
│   │   ├── model/    # 数据模型
│   │   ├── service/  # 业务逻辑
│   │   ├── repository/ # 数据访问
│   │   └── middleware/ # 中间件
│   ├── pkg/          # 公共包
│   ├── config/       # 配置文件
│   └── Dockerfile
├── frontend/         # 前端展示网站
│   ├── src/
│   ├── public/
│   └── Dockerfile
├── admin/            # 后端管理系统
│   ├── src/
│   ├── public/
│   └── Dockerfile
├── docker-compose.yml
├── nginx.conf        # Nginx反向代理配置
└── README.md
```

## 功能模块

### 前端网站
- 🍜 美食展示列表
- 🔍 美食搜索
- 📖 美食详情页
- 🏷️ 分类浏览
- 💫 科技感动画效果

### 管理系统
- 🔐 管理员登录
- 📝 美食数据CRUD
- 🖼️ 图片上传管理
- 🔗 链接管理
- 📊 数据统计面板

## 快速开始

```bash
# 1. 克隆项目
git clone <your-repo>
cd foodie-tech

# 2. 启动所有服务
docker-compose up -d

# 3. 访问服务
# 前端网站: http://localhost:8080
# 管理系统: http://localhost:8081
# API文档: http://localhost:8082
```

## API文档

### 美食相关接口
- `GET /api/v1/foods` - 获取美食列表
- `GET /api/v1/foods/:id` - 获取美食详情
- `POST /api/v1/foods` - 创建美食(管理)
- `PUT /api/v1/foods/:id` - 更新美食(管理)
- `DELETE /api/v1/foods/:id` - 删除美食(管理)

### 分类相关接口
- `GET /api/v1/categories` - 获取分类列表
- `POST /api/v1/categories` - 创建分类(管理)

### 认证接口
- `POST /api/v1/auth/login` - 管理员登录

## 科技风格主题色
- 主色: `#00D4FF` (霓虹蓝)
- 辅色: `#FF006E` (霓虹粉)
- 背景: `#0A0A0F` (深空黑)
- 卡片: `#12121A` (太空灰)
- 文字: `#E0E0FF` (星尘白)

## 许可证
MIT