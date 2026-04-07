# 小森美食 - Docker 部署指南

## 🚀 一键部署

### 1. 确保已安装 Docker
```bash
docker --version
docker-compose --version
```

### 2. 克隆/复制项目到服务器
```bash
# 将 foodie-tech 文件夹上传到服务器
scp -r foodie-tech/ root@your-server:/opt/
```

### 3. 启动服务
```bash
cd /opt/foodie-tech
docker-compose up -d
```

### 4. 等待初始化完成（约30秒）
```bash
# 查看日志
docker-compose logs -f

# 当看到以下输出表示成功：
# ✅ 数据库连接成功
# 🌲 小森美食后端运行在 http://localhost:8082
```

### 5. 访问服务
| 服务 | 地址 |
|------|------|
| 🌲 小森美食前端 | http://服务器IP:8080 |
| 🖥️ 管理后台 | http://服务器IP:8081 |
| 🔧 后端API | http://服务器IP:8082 |

**管理账号**: admin / admin123

---

## 📁 文件说明

```
foodie-tech/
├── docker-compose.yml      # Docker编排配置
├── init-db.sql             # 数据库初始化脚本
├── backend/
│   ├── Dockerfile          # 后端容器配置
│   └── server-db.js        # Node后端代码
├── frontend/
│   └── Dockerfile          # 前端容器配置
└── admin/
    └── Dockerfile          # 管理后台容器配置
```

---

## 🔧 常用命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 进入数据库容器
docker exec -it xiaosen_mysql mysql -uxiaosen -p

# 备份数据库
docker exec xiaosen_mysql mysqldump -uxiaosen -pxiaosen123 xiaosen_food > backup.sql

# 查看运行状态
docker-compose ps
```

---

## ⚙️ 自定义配置

### 修改数据库密码
编辑 `docker-compose.yml`:
```yaml
mysql:
  environment:
    MYSQL_ROOT_PASSWORD: 你的新密码
    MYSQL_PASSWORD: 你的新密码
```

然后重启：
```bash
docker-compose down
docker-compose up -d
```

### 修改端口号
编辑 `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "8080:80"  # 改为 "9090:80"
```

---

## 💾 数据持久化

数据存储在Docker Volume中：
- `mysql_data`: MySQL数据库数据
- 即使删除容器，数据也不会丢失

```bash
# 查看数据卷
docker volume ls

# 备份数据卷
docker run --rm -v xiaosen_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql-backup.tar.gz -C /data .
```

---

## 🌐 生产环境部署建议

### 1. 使用 Nginx 反向代理
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8080;
    }
}
```

### 2. 启用 HTTPS
使用 Let's Encrypt:
```bash
docker run -d \
  --name=nginx-proxy \
  -p 80:80 \
  -p 443:443 \
  -v /var/run/docker.sock:/tmp/docker.sock:ro \
  jwilder/nginx-proxy
```

### 3. 设置自动备份
```bash
# 创建备份脚本
cat > /opt/backup.sh << 'EOF'
#!/bin/bash
docker exec xiaosen_mysql mysqldump -uxiaosen -pxiaosen123 xiaosen_food > /backup/$(date +%Y%m%d).sql
EOF
chmod +x /opt/backup.sh

# 添加到定时任务
echo "0 2 * * * /opt/backup.sh" | crontab -
```

---

## ❓ 常见问题

### 1. 端口被占用
```bash
# 查看占用端口的进程
lsof -i:8080

# 修改docker-compose.yml使用其他端口
```

### 2. 数据库连接失败
```bash
# 查看MySQL日志
docker-compose logs mysql

# 等待MySQL完全启动后再启动后端
docker-compose restart backend
```

### 3. 容器启动失败
```bash
# 检查配置
docker-compose config

# 重新构建
docker-compose down
docker-compose up -d --build
```

---

## 🎉 完成！

现在你可以通过 http://服务器IP:8080 访问小森美食系统了！