# 美食网站系统 - Docker 部署指南

📅 更新日期: 2026-04-07

本项目包含两个独立的美食网站工程，支持使用 Docker 一键部署，方便迁移到任意服务器。

---

## 📁 项目结构

```
work/
├── README-Docker.md          # 本文档
├── foodie-tech/              # 🍜 小森美食完整系统
│   ├── docker-compose.yml    # Docker编排配置
│   ├── init-db.sql           # 数据库初始化脚本
│   ├── backend/              # Node.js 后端服务
│   │   ├── Dockerfile
│   │   ├── server-db.js
│   │   └── package.json
│   ├── frontend/             # Vue3 前端网站
│   │   ├── Dockerfile
│   │   ├── nginx.conf
│   │   └── package.json
│   └── admin/                # Vue3 管理后台
│       ├── Dockerfile
│       ├── nginx.conf
│       └── package.json
└── vue-food-website/         # 🥘 Vue美食网站（独立前端）
    ├── package.json
    ├── vite.config.js
    └── src/
```

---

## 🚀 快速启动（推荐方式）

### 前置要求

确保服务器已安装 Docker 和 Docker Compose：

```bash
# 检查版本
docker --version        # 需要 20.10+
docker-compose --version # 需要 1.29+ 或 2.x

# 如未安装，参考以下命令安装（Ubuntu/Debian）
# curl -fsSL https://get.docker.com | sh
# sudo usermod -aG docker $USER
# newgrp docker
```

---

## 🍜 项目一：小森美食系统 (foodie-tech)

这是一个完整的美食平台，包含前端展示、管理后台、后端API和数据库。

### 服务架构

| 服务 | 容器名 | 内部端口 | 外部端口 | 说明 |
|------|--------|----------|----------|------|
| 🌲 前端网站 | xiaosen_frontend | 80 | 8080 | 用户访问的美食网站 |
| 🖥️ 管理后台 | xiaosen_admin | 80 | 8081 | 管理员后台系统 |
| 🔧 后端API | xiaosen_backend | 8080 | 8082 | RESTful API服务 |
| 🗄️ 数据库 | xiaosen_mysql | 3306 | 3306 | MySQL 8.0 |

### 一键部署步骤

```bash
# 1. 进入项目目录
cd ~/Desktop/work/foodie-tech

# 2. 启动所有服务（后台运行）
docker-compose up -d

# 3. 等待初始化完成（约30-60秒）
docker-compose logs -f

# 当看到以下输出表示启动成功：
# ✅ 数据库连接成功
# 🌲 小森美食后端运行在 http://localhost:8080
```

### 访问服务

| 服务 | 访问地址 | 说明 |
|------|----------|------|
| 🌲 小森美食前端 | http://服务器IP:8080 | 美食展示网站 |
| 🖥️ 管理后台 | http://服务器IP:8081 | 后台管理系统 |
| 🔧 后端API | http://服务器IP:8082 | API接口文档 |

**管理后台登录账号**:
- 用户名: `admin`
- 密码: `admin123`

---

## 🥘 项目二：Vue美食网站 (vue-food-website)

这是一个独立的 Vue3 前端项目，使用 Vite 构建。

### 部署方式

#### 方式A：开发模式（适合调试）

```bash
cd ~/Desktop/work/vue-food-website

# 安装依赖（首次需要）
npm install

# 启动开发服务器
npm run dev

# 访问 http://服务器IP:5173
```

#### 方式B：Docker部署（生产环境）

由于该项目没有 Dockerfile，你可以创建以下配置：

**1. 创建 Dockerfile**

```bash
cat > ~/Desktop/work/vue-food-website/Dockerfile << 'EOF'
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
```

**2. 创建 nginx.conf**

```bash
cat > ~/Desktop/work/vue-food-website/nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF
```

**3. 创建 docker-compose.yml**

```bash
cat > ~/Desktop/work/vue-food-website/docker-compose.yml << 'EOF'
version: '3.8'

services:
  vue-food-web:
    build: .
    container_name: vue_food_website
    restart: always
    ports:
      - "8083:80"
    networks:
      - food_network

networks:
  food_network:
    driver: bridge
EOF
```

**4. 启动服务**

```bash
cd ~/Desktop/work/vue-food-website
docker-compose up -d

# 访问 http://服务器IP:8083
```

---

## 🔧 常用运维命令

### 小森美食系统 (foodie-tech)

```bash
cd ~/Desktop/work/foodie-tech

# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 停止并删除数据卷（⚠️ 会清空数据库）
docker-compose down -v

# 查看服务状态
docker-compose ps

# 查看实时日志
docker-compose logs -f

# 查看单个服务日志
docker-compose logs -f backend
docker-compose logs -f mysql

# 重启单个服务
docker-compose restart backend

# 重新构建并启动
docker-compose up -d --build

# 进入容器内部
docker exec -it xiaosen_backend /bin/sh
docker exec -it xiaosen_mysql mysql -uxiaosen -pxiaosen123
```

### Vue美食网站

```bash
cd ~/Desktop/work/vue-food-website

# 如果使用Docker部署
docker-compose up -d
docker-compose down
docker-compose logs -f

# 开发模式
npm run dev      # 开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产版本
```

---

## 💾 数据备份与恢复

### 备份数据库

```bash
# 自动备份脚本
cat > ~/backup-xiaosen.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/xiaosen"
mkdir -p $BACKUP_DIR

# 备份数据库
docker exec xiaosen_mysql mysqldump -uxiaosen -pxiaosen123 xiaosen_food > $BACKUP_DIR/backup_$DATE.sql

# 保留最近7天的备份
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

echo "✅ 备份完成: $BACKUP_DIR/backup_$DATE.sql"
EOF

chmod +x ~/backup-xiaosen.sh

# 手动执行备份
~/backup-xiaosen.sh

# 添加到定时任务（每天凌晨2点备份）
echo "0 2 * * * ~/backup-xiaosen.sh >> /var/log/backup.log 2>&1" | crontab -
```

### 恢复数据库

```bash
# 恢复指定备份文件
BACKUP_FILE="/backup/xiaosen/backup_20260407_120000.sql"
docker exec -i xiaosen_mysql mysql -uxiaosen -pxiaosen123 xiaosen_food < $BACKUP_FILE

echo "✅ 数据库恢复完成"
```

### 备份整个项目

```bash
# 打包整个work目录
cd ~/Desktop
tar czvf foodie-projects-backup-$(date +%Y%m%d).tar.gz work/

# 导出Docker镜像（可选）
docker save -o xiaosen-images.tar xiaosen_frontend xiaosen_admin xiaosen_backend
```

---

## 🌐 生产环境配置

### 1. 修改默认端口

如果服务器已有其他服务占用端口，编辑 `docker-compose.yml`：

```yaml
services:
  frontend:
    ports:
      - "9090:80"    # 改为9090端口

  admin:
    ports:
      - "9091:80"    # 改为9091端口

  backend:
    ports:
      - "9092:8080"  # 改为9092端口

  mysql:
    ports:
      - "3307:3306"  # 改为3307端口
```

### 2. 修改数据库密码

编辑 `docker-compose.yml`：

```yaml
mysql:
  environment:
    MYSQL_ROOT_PASSWORD: 你的强密码
    MYSQL_PASSWORD: 你的强密码

backend:
  environment:
    DB_PASSWORD: 你的强密码  # 与上面一致
```

### 3. 使用 Nginx 反向代理 + HTTPS

```bash
# 安装 Nginx
sudo apt install nginx certbot python3-certbot-nginx

# 创建配置文件
sudo tee /etc/nginx/sites-available/foodie << 'EOF'
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端网站
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # 管理后台
    location /admin/ {
        proxy_pass http://localhost:8081/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # API接口
    location /api/ {
        proxy_pass http://localhost:8082/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# 启用配置
sudo ln -s /etc/nginx/sites-available/foodie /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 申请SSL证书
sudo certbot --nginx -d your-domain.com
```

---

## ❓ 常见问题排查

### 1. 端口被占用

```bash
# 查看端口占用
sudo lsof -i:8080
sudo netstat -tlnp | grep 8080

# 解决方案A：停止占用端口的进程
sudo kill -9 <PID>

# 解决方案B：修改 docker-compose.yml 使用其他端口
```

### 2. 容器启动失败

```bash
# 查看详细错误
docker-compose logs

# 检查配置文件语法
docker-compose config

# 重新构建镜像
docker-compose down
docker-compose up -d --build --no-cache
```

### 3. 数据库连接失败

```bash
# 检查MySQL是否正常运行
docker-compose ps
docker-compose logs mysql

# 手动测试连接
docker exec -it xiaosen_mysql mysql -uxiaosen -pxiaosen123 -e "SHOW DATABASES;"

# 重启后端服务
docker-compose restart backend
```

### 4. 前端页面空白/404

```bash
# 检查前端容器日志
docker-compose logs frontend

# 确认Nginx配置正确
docker exec xiaosen_frontend cat /etc/nginx/conf.d/default.conf

# 重新构建前端
docker-compose up -d --build frontend
```

### 5. 数据卷权限问题

```bash
# 修复MySQL数据权限
docker-compose down
docker volume rm foodie-tech_mysql_data
docker-compose up -d mysql
```

---

## 📦 迁移到新服务器

### 步骤1: 在新服务器安装Docker

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

### 步骤2: 复制项目文件

```bash
# 从旧服务器打包
tar czvf ~/work-backup.tar.gz ~/Desktop/work/

# 传输到新服务器
scp ~/work-backup.tar.gz user@new-server:/home/user/

# 在新服务器解压
tar xzvf ~/work-backup.tar.gz
```

### 步骤3: 启动服务

```bash
cd ~/Desktop/work/foodie-tech
docker-compose up -d
```

### 步骤4: 恢复数据（如有备份）

```bash
# 复制备份文件到新服务器
scp backup_20260407_120000.sql user@new-server:/home/user/

# 在新服务器恢复
docker exec -i xiaosen_mysql mysql -uxiaosen -pxiaosen123 xiaosen_food < backup_20260407_120000.sql
```

---

## 🔐 安全建议

1. **修改默认密码**: 生产环境务必修改所有默认密码
2. **关闭不必要端口**: 只开放 80/443，数据库不映射到公网
3. **定期更新**: `docker-compose pull && docker-compose up -d`
4. **启用防火墙**: 使用 ufw/iptables 限制访问
5. **日志监控**: 配置日志收集和告警

---

## 📞 技术支持

如有问题，请检查：
1. Docker和Docker Compose版本是否符合要求
2. 端口是否被占用
3. 日志输出是否有明确错误信息
4. 配置文件语法是否正确

---

**祝部署顺利！** 🎉
