#!/bin/bash
# Docker 部署脚本 - 更新视频教程功能

set -e

echo "🚀 开始部署视频教程功能..."

# 1. 执行数据库迁移（添加 video_url 字段）
echo "📦 执行数据库迁移..."
docker exec -i xiaosen_mysql mysql -uxiaosen -pxiaosen123 xiaosen_food < migration-add-video-url.sql

# 2. 添加测试视频数据（可选）
echo "🎬 添加测试视频数据..."
docker exec -i xiaosen_mysql mysql -uxiaosen -pxiaosen123 xiaosen_food < test-video-data.sql

# 3. 停止并删除旧容器
echo "🛑 停止旧容器..."
docker-compose stop backend frontend admin

# 4. 重新构建镜像（--no-cache 确保使用最新代码）
echo "🔨 重新构建镜像..."
docker-compose build --no-cache backend frontend admin

# 5. 启动新容器
echo "▶️  启动新容器..."
docker-compose up -d backend frontend admin

# 6. 查看状态
echo "📊 查看容器状态..."
docker-compose ps

echo ""
echo "✅ 部署完成！"
echo ""
echo "访问地址："
echo "  - 前端: http://localhost:8080"
echo "  - 后台: http://localhost:8081"
echo "  - API:  http://localhost:8082"
echo ""
echo "测试："
echo "  1. 访问红烧肉详情页，应该显示视频播放器"
echo "  2. 登录后台，编辑菜品可添加视频链接"
