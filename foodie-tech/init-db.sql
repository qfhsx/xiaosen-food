-- 小森美食数据库初始化脚本
CREATE DATABASE IF NOT EXISTS xiaosen_food CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE xiaosen_food;

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    icon VARCHAR(50) DEFAULT '🍽️',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 美食表
CREATE TABLE IF NOT EXISTS foods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    video_url VARCHAR(500), -- 视频教程链接
    category_id INT,
    meals JSON, -- 适用餐点 ["breakfast", "lunch", "dinner"]
    tags VARCHAR(200),
    rating DECIMAL(2,1) DEFAULT 4.0,
    is_featured BOOLEAN DEFAULT FALSE,
    ingredients TEXT, -- 食材清单
    seasonings TEXT, -- 调料清单
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 购物车表
CREATE TABLE IF NOT EXISTS cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    food_id INT NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner') NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- 用餐历史记录表
CREATE TABLE IF NOT EXISTS meal_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner') NOT NULL,
    food_id INT NOT NULL,
    quantity INT DEFAULT 1,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- 用户表（管理员）
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入默认分类
INSERT INTO categories (name, description, icon, sort_order) VALUES
('家常菜', '日常家庭菜肴', '🥘', 1),
('汤羹', '营养汤品', '🍲', 2),
('早餐', '营养早餐', '🍳', 3),
('甜点', '自制甜品', '🍰', 4),
('小吃', '休闲小吃', '🥟', 5),
('饮品', '自制饮料', '🥤', 6);

-- 插入默认美食数据
INSERT INTO foods (name, description, image, category_id, meals, tags, rating, is_featured, ingredients, seasonings) VALUES
('红烧肉', '肥而不腻，入口即化的家常红烧肉', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600', 1, '["lunch", "dinner"]', '下饭菜,经典', 4.9, TRUE, '五花肉500g, 冰糖30g, 生抽2勺, 老抽1勺, 料酒2勺, 生姜3片, 八角2个', '生抽, 老抽, 料酒, 冰糖, 八角'),
('西红柿鸡蛋汤', '清爽开胃的西红柿鸡蛋汤', 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=600', 2, '["lunch", "dinner"]', '快手,清淡', 4.7, FALSE, '西红柿2个, 鸡蛋2个, 葱花适量', '盐, 鸡精, 香油'),
('蛋炒饭', '粒粒分明的黄金蛋炒饭', 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?w=600', 1, '["breakfast", "lunch", "dinner"]', '快手,主食', 4.6, TRUE, '隔夜米饭2碗, 鸡蛋3个, 火腿肠1根, 胡萝卜丁50g', '盐, 生抽, 白胡椒粉'),
('葱花鸡蛋饼', '香软的葱花鸡蛋饼，早餐首选', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', 3, '["breakfast"]', '快手,早餐', 4.5, FALSE, '面粉200g, 鸡蛋2个, 葱花适量', '盐, 五香粉'),
('小米粥', '养胃小米粥，早餐必备', 'https://images.unsplash.com/photo-1511910849309-0dffb8785146?w=600', 3, '["breakfast"]', '养生,早餐', 4.6, TRUE, '小米100g, 清水适量, 红枣5颗', '冰糖'),
('煎饺子', '金黄酥脆的煎饺', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600', 5, '["breakfast", "lunch", "dinner"]', '主食,经典', 4.7, TRUE, '饺子15个, 食用油2勺, 清水半碗', '醋, 生抽, 辣椒油'),
('可乐鸡翅', '甜中带咸的可乐鸡翅', 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600', 1, '["lunch", "dinner"]', '下饭菜,人气', 4.8, FALSE, '鸡翅中10个, 可乐1罐, 生姜3片', '生抽, 老抽, 料酒, 盐'),
('清蒸鲈鱼', '鲜嫩清蒸鲈鱼', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600', 1, '["lunch", "dinner"]', '清淡,营养', 4.8, TRUE, '鲈鱼1条, 生姜5片, 葱2根', '蒸鱼豉油, 料酒, 盐'),
('自制奶茶', '香浓顺滑的自制奶茶', 'https://images.unsplash.com/photo-1558855410-3112e255e40e?w=600', 6, '["breakfast"]', '甜品,自制', 4.8, FALSE, '红茶包2个, 牛奶500ml, 白糖适量', '红茶, 牛奶, 糖'),
('芒果班戟', '松软香甜的芒果班戟', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600', 4, '["breakfast"]', '甜品,下午茶', 4.9, TRUE, '低筋面粉100g, 牛奶250ml, 芒果1个', '糖粉, 香草精');

-- 插入默认管理员账号 (密码: admin123)
INSERT INTO users (username, password, email, role) VALUES
('admin', '$2b$10$YourHashedPasswordHere', 'admin@xiaosen.com', 'admin');