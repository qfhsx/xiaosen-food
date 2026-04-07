#!/bin/bash
# 小森美食 - 服务器迁移脚本
# 使用方法: ./deploy.sh

set -e

echo "🍜 小森美食部署脚本"
echo "===================="

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

echo "✅ Docker环境检查通过"

# 创建项目目录
mkdir -p /opt/xiaosen-food
cd /opt/xiaosen-food

echo "📁 项目目录: /opt/xiaosen-food"
echo ""
echo "请上传以下文件到当前目录:"
echo "  - docker-compose.yml"
echo "  - init-db.sql"
echo "  - backend/ (文件夹)"
echo "  - frontend/ (文件夹)"
echo "  - admin/ (文件夹)"
echo ""
echo "上传完成后，运行: docker-compose up -d"
