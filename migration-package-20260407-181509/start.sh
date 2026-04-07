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
