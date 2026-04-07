#!/bin/bash
# 小森美食 - 一键打包迁移脚本
# 运行此脚本会生成包含所有代码和数据的部署包

set -e

echo "🍜 小森美食 - 一键打包迁移工具"
echo "================================"

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_DIR="$PROJECT_DIR/migration-package-$(date +%Y%m%d-%H%M%S)"

echo ""
echo "📦 步骤1: 备份数据库..."
sudo docker exec xiaosen_mysql mysqldump -uxiaosen -pxiaosen123 xiaosen_food > "$PROJECT_DIR/init-db-with-data.sql" 2>/dev/null || {
    echo "⚠️ 警告: 数据库备份失败，使用原始init-db.sql"
    cp "$PROJECT_DIR/foodie-tech/init-db.sql" "$PROJECT_DIR/init-db-with-data.sql"
}

echo "✅ 数据库备份完成"

echo ""
echo "📦 步骤2: 复制项目文件..."
mkdir -p "$BACKUP_DIR"

# 复制必要文件
cp -r "$PROJECT_DIR/foodie-tech" "$BACKUP_DIR/"
cp "$PROJECT_DIR/README-Docker.md" "$BACKUP_DIR/"
cp "$PROJECT_DIR/迁移指南.md" "$BACKUP_DIR/"

# 使用带数据的SQL
cp "$PROJECT_DIR/init-db-with-data.sql" "$BACKUP_DIR/foodie-tech/init-db.sql"

echo "✅ 项目文件复制完成"

echo ""
echo "📦 步骤3: 创建启动脚本..."
cat > "$BACKUP_DIR/start.sh" << 'EOF'
#!/bin/bash
echo "🍜 启动小森美食..."
sudo docker-compose up -d
echo ""
echo "⏳ 等待服务启动..."
sleep 10
echo ""
echo "✅ 服务已启动!"
echo ""
echo "访问地址:"
echo "  🌲 前端网站: http://$(hostname -I | awk '{print $1}'):8080"
echo "  🖥️ 管理后台: http://$(hostname -I | awk '{print $1}'):8081"
echo "  🔧 后端API:  http://$(hostname -I | awk '{print $1}'):8082"
echo ""
echo "管理账号: admin / admin123"
EOF
chmod +x "$BACKUP_DIR/start.sh"

echo ""
echo "📦 步骤4: 打包..."
cd "$PROJECT_DIR"
tar czvf "xiaosen-food-migration-$(date +%Y%m%d).tar.gz" "$(basename "$BACKUP_DIR")"

echo ""
echo "🎉 打包完成!"
echo "======================"
echo ""
echo "📦 部署包位置:"
echo "   $PROJECT_DIR/xiaosen-food-migration-$(date +%Y%m%d).tar.gz"
echo ""
echo "📋 迁移到新服务器的步骤:"
echo "   1. 将压缩包上传到服务器"
echo "   2. 解压: tar xzvf xiaosen-food-migration-xxx.tar.gz"
echo "   3. 进入目录: cd migration-package-xxx/foodie-tech"
echo "   4. 启动: sudo docker-compose up -d"
echo "   5. 访问: http://服务器IP:8080"
echo ""
echo "详细说明请查看: 迁移指南.md"
