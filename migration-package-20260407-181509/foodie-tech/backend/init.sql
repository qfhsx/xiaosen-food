-- 数据库初始化脚本
-- 创建默认管理员账号

-- 密码: admin123 (bcrypt hash)
INSERT INTO users (username, password, email, role, is_active, created_at, updated_at) 
VALUES ('admin', '$2a$10$YourHashHere', 'admin@foodietech.com', 'admin', true, NOW(), NOW());

-- 创建默认分类
INSERT INTO categories (name, description, icon, sort_order, created_at, updated_at) VALUES
('日式料理', '寿司、拉面等日本美食', '🍣', 1, NOW(), NOW()),
('西式快餐', '汉堡、披萨、炸鸡等', '🍔', 2, NOW(), NOW()),
('中式美食', '传统中国菜肴', '🥟', 3, NOW(), NOW()),
('甜点饮品', '蛋糕、奶茶、咖啡等', '🍰', 4, NOW(), NOW()),
('韩式料理', '韩国烤肉、泡菜等', '🍱', 5, NOW(), NOW()),
('东南亚菜', '泰国、越南等美食', '🍜', 6, NOW(), NOW());

-- 创建示例美食数据
INSERT INTO foods (name, description, image, price, category_id, tags, link, rating, is_featured, created_at, updated_at) VALUES
('霓虹拉面', '一碗充满科技感的日式拉面，采用秘制猪骨汤底，配以溏心蛋、叉烧肉和新鲜葱花', 
 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500', 48.00, 1, '热门,推荐,新品', 
 'https://example.com/ramen', 4.8, true, NOW(), NOW()),
 
('量子汉堡', '双层牛肉饼配特制酱汁，科技感十足的汉堡体验', 
 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', 68.00, 2, '热销,经典', 
 'https://example.com/burger', 4.6, true, NOW(), NOW()),
 
('星际寿司拼盘', '精选12贯新鲜寿司，带你遨游日本美食宇宙', 
 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500', 128.00, 1, '新品,精选', 
 'https://example.com/sushi', 4.9, true, NOW(), NOW()),
 
('赛博奶茶', '特调珍珠奶茶，渐变分层效果，拍照神器', 
 'https://images.unsplash.com/photo-1558855410-3112e255e40e?w=500', 28.00, 4, '网红,必点', 
 'https://example.com/bubbletea', 4.5, false, NOW(), NOW()),
 
('未来炸鸡', '外酥里嫩，秘制香料腌制，科技感包装', 
 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500', 38.00, 2, '热销', 
 'https://example.com/chicken', 4.4, false, NOW(), NOW()),
 
('机器人烧烤', '智能烤制的完美肉串，肉质鲜嫩多汁', 
 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500', 88.00, 5, '推荐,特色', 
 'https://example.com/bbq', 4.7, true, NOW(), NOW());