const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const port = 8082;

app.use(cors());
app.use(express.json());

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'xiaosen',
  password: process.env.DB_PASSWORD || 'xiaosen123',
  database: process.env.DB_NAME || 'xiaosen_food',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

// 初始化数据库连接
async function initDB() {
  try {
    pool = mysql.createPool(dbConfig);
    // 测试连接
    await pool.query('SELECT 1');
    console.log('✅ 数据库连接成功');
    return true;
  } catch (err) {
    console.error('❌ 数据库连接失败:', err.message);
    console.log('⚠️  使用内存模式运行...');
    pool = null;
    return false;
  }
}

// 获取当前餐点类型
const getCurrentMealType = () => {
  const hour = new Date().getHours();
  if (hour < 10) return 'breakfast';
  if (hour < 15) return 'lunch';
  return 'dinner';
};

// ========== 内存模式（数据库未连接时） ==========
let memoryMode = {
  foods: [
    { id: 1, name: '红烧肉', description: '肥而不腻，入口即化的家常红烧肉', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600', category_id: 1, category: { name: '家常菜' }, meals: '["lunch","dinner"]', tags: '下饭菜,经典', rating: 4.9, is_featured: 1, ingredients: '五花肉500g, 冰糖30g, 生抽2勺, 老抽1勺, 料酒2勺, 生姜3片, 八角2个', seasonings: '生抽, 老抽, 料酒, 冰糖, 八角' },
    { id: 2, name: '西红柿鸡蛋汤', description: '清爽开胃的西红柿鸡蛋汤', image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=600', category_id: 2, category: { name: '汤羹' }, meals: '["lunch","dinner"]', tags: '快手,清淡', rating: 4.7, is_featured: 0, ingredients: '西红柿2个, 鸡蛋2个, 葱花适量', seasonings: '盐, 鸡精, 香油' },
    { id: 3, name: '蛋炒饭', description: '粒粒分明的黄金蛋炒饭', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?w=600', category_id: 1, category: { name: '家常菜' }, meals: '["breakfast","lunch","dinner"]', tags: '快手,主食', rating: 4.6, is_featured: 1, ingredients: '隔夜米饭2碗, 鸡蛋3个, 火腿肠1根', seasonings: '盐, 生抽, 白胡椒粉' },
    { id: 4, name: '葱花鸡蛋饼', description: '香软的葱花鸡蛋饼', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', category_id: 3, category: { name: '早餐' }, meals: '["breakfast"]', tags: '快手,早餐', rating: 4.5, is_featured: 0, ingredients: '面粉200g, 鸡蛋2个, 葱花适量', seasonings: '盐, 五香粉' },
    { id: 5, name: '小米粥', description: '养胃小米粥', image: 'https://images.unsplash.com/photo-1511910849309-0dffb8785146?w=600', category_id: 3, category: { name: '早餐' }, meals: '["breakfast"]', tags: '养生,早餐', rating: 4.6, is_featured: 1, ingredients: '小米100g, 清水适量, 红枣5颗', seasonings: '冰糖' },
    { id: 6, name: '煎饺子', description: '金黄酥脆的煎饺', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600', category_id: 5, category: { name: '小吃' }, meals: '["breakfast","lunch","dinner"]', tags: '主食,经典', rating: 4.7, is_featured: 1, ingredients: '饺子15个, 食用油2勺, 清水半碗', seasonings: '醋, 生抽, 辣椒油' },
    { id: 7, name: '可乐鸡翅', description: '甜中带咸的可乐鸡翅', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600', category_id: 1, category: { name: '家常菜' }, meals: '["lunch","dinner"]', tags: '下饭菜,人气', rating: 4.8, is_featured: 0, ingredients: '鸡翅中10个, 可乐1罐, 生姜3片', seasonings: '生抽, 老抽, 料酒, 盐' },
    { id: 8, name: '清蒸鲈鱼', description: '鲜嫩清蒸鲈鱼', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600', category_id: 1, category: { name: '家常菜' }, meals: '["lunch","dinner"]', tags: '清淡,营养', rating: 4.8, is_featured: 1, ingredients: '鲈鱼1条, 生姜5片, 葱2根', seasonings: '蒸鱼豉油, 料酒, 盐' },
  ],
  categories: [
    { id: 1, name: '家常菜', icon: '🥘' },
    { id: 2, name: '汤羹', icon: '🍲' },
    { id: 3, name: '早餐', icon: '🍳' },
    { id: 4, name: '甜点', icon: '🍰' },
    { id: 5, name: '小吃', icon: '🥟' },
    { id: 6, name: '饮品', icon: '🥤' }
  ],
  cart: { breakfast: [], lunch: [], dinner: [] },
  history: {}
};

// ========== API 路由 ==========

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', code: 200, db: pool ? 'connected' : 'memory' });
});

// 获取餐点类型
app.get('/api/v1/meal-types', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: [
      { id: 'breakfast', name: '早餐', icon: '🌅', time: '06:00-10:00' },
      { id: 'lunch', name: '午餐', icon: '☀️', time: '10:00-15:00' },
      { id: 'dinner', name: '晚餐', icon: '🌙', time: '15:00-21:00' }
    ],
    current: getCurrentMealType()
  });
});

// 获取分类列表
app.get('/api/v1/categories', async (req, res) => {
  try {
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM categories ORDER BY sort_order');
      res.json({ code: 200, message: 'success', data: rows });
    } else {
      res.json({ code: 200, message: 'success', data: memoryMode.categories });
    }
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 获取美食列表
app.get('/api/v1/foods', async (req, res) => {
  try {
    const { category_id, meal_type, keyword, page = 1, page_size = 10 } = req.query;
    
    let result;
    
    if (pool) {
      let sql = `
        SELECT f.*, c.name as category_name 
        FROM foods f 
        LEFT JOIN categories c ON f.category_id = c.id 
        WHERE 1=1
      `;
      const params = [];
      
      if (category_id) {
        sql += ' AND f.category_id = ?';
        params.push(category_id);
      }
      
      if (meal_type && meal_type !== 'all') {
        sql += ' AND JSON_CONTAINS(f.meals, ?)';
        params.push(`"${meal_type}"`);
      }
      
      if (keyword) {
        sql += ' AND (f.name LIKE ? OR f.description LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
      }
      
      sql += ' ORDER BY f.created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(page_size), (page - 1) * page_size);
      
      const [rows] = await pool.query(sql, params);
      
      // 获取总数
      let countSql = 'SELECT COUNT(*) as total FROM foods WHERE 1=1';
      const [countResult] = await pool.query(countSql);
      
      result = rows.map(row => ({
        ...row,
        category: { name: row.category_name },
        meals: JSON.parse(row.meals || '[]'),
        is_featured: !!row.is_featured
      }));
      
      res.json({
        code: 200,
        message: 'success',
        data: result,
        total: countResult[0].total,
        page: parseInt(page),
        page_size: parseInt(page_size)
      });
    } else {
      // 内存模式
      result = memoryMode.foods;
      
      if (category_id) {
        result = result.filter(f => f.category_id === parseInt(category_id));
      }
      
      if (meal_type && meal_type !== 'all') {
        result = result.filter(f => {
          const meals = JSON.parse(f.meals || '[]');
          return meals.includes(meal_type);
        });
      }
      
      if (keyword) {
        const k = keyword.toLowerCase();
        result = result.filter(f => f.name.toLowerCase().includes(k));
      }
      
      res.json({
        code: 200,
        message: 'success',
        data: result,
        total: result.length,
        page: parseInt(page),
        page_size: parseInt(page_size)
      });
    }
  } catch (err) {
    console.error('获取美食列表错误:', err);
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 获取美食详情
app.get('/api/v1/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (pool) {
      const [rows] = await pool.query(`
        SELECT f.*, c.name as category_name 
        FROM foods f 
        LEFT JOIN categories c ON f.category_id = c.id 
        WHERE f.id = ?
      `, [id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ code: 404, message: '美食不存在' });
      }
      
      const food = {
        ...rows[0],
        category: { name: rows[0].category_name },
        meals: JSON.parse(rows[0].meals || '[]'),
        is_featured: !!rows[0].is_featured
      };
      
      res.json({ code: 200, message: 'success', data: food });
    } else {
      const food = memoryMode.foods.find(f => f.id === parseInt(id));
      if (!food) {
        return res.status(404).json({ code: 404, message: '美食不存在' });
      }
      res.json({ code: 200, message: 'success', data: { ...food, meals: JSON.parse(food.meals || '[]') } });
    }
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 创建美食
app.post('/api/v1/foods', async (req, res) => {
  try {
    const { name, category_id, meals, image, rating, ingredients, seasonings, description, is_featured } = req.body;
    
    if (pool) {
      const [result] = await pool.query(
        'INSERT INTO foods (name, category_id, meals, image, rating, ingredients, seasonings, description, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, category_id, JSON.stringify(meals || []), image, rating, ingredients, seasonings, description, is_featured ? 1 : 0]
      );
      
      res.status(201).json({ code: 201, message: '创建成功', data: { id: result.insertId } });
    } else {
      const newFood = {
        id: memoryMode.foods.length + 1,
        name, category_id, meals: JSON.stringify(meals || []), image, rating, ingredients, seasonings, description,
        is_featured: is_featured ? 1 : 0,
        category: memoryMode.categories.find(c => c.id === category_id)
      };
      memoryMode.foods.unshift(newFood);
      res.status(201).json({ code: 201, message: '创建成功', data: newFood });
    }
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 更新美食
app.put('/api/v1/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (pool) {
      const fields = [];
      const values = [];
      
      for (const [key, value] of Object.entries(updates)) {
        if (key === 'meals') {
          fields.push(`${key} = ?`);
          values.push(JSON.stringify(value));
        } else if (key === 'is_featured') {
          fields.push(`${key} = ?`);
          values.push(value ? 1 : 0);
        } else {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
      
      await pool.query(`UPDATE foods SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
      res.json({ code: 200, message: '更新成功' });
    } else {
      const index = memoryMode.foods.findIndex(f => f.id === parseInt(id));
      if (index !== -1) {
        memoryMode.foods[index] = { ...memoryMode.foods[index], ...updates };
      }
      res.json({ code: 200, message: '更新成功' });
    }
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 删除美食
app.delete('/api/v1/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (pool) {
      await pool.query('DELETE FROM foods WHERE id = ?', [id]);
    } else {
      memoryMode.foods = memoryMode.foods.filter(f => f.id !== parseInt(id));
    }
    
    res.json({ code: 200, message: '删除成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// ========== 购物车接口 ==========

// 获取购物车
app.get('/api/v1/cart', async (req, res) => {
  try {
    if (pool) {
      const [rows] = await pool.query(`
        SELECT c.*, f.name, f.image, f.ingredients, f.seasonings 
        FROM cart c 
        JOIN foods f ON c.food_id = f.id 
        ORDER BY c.created_at DESC
      `);
      
      const cart = { breakfast: [], lunch: [], dinner: [] };
      rows.forEach(item => {
        cart[item.meal_type].push({
          id: item.id,
          food_id: item.food_id,
          name: item.name,
          image: item.image,
          ingredients: item.ingredients,
          seasonings: item.seasonings,
          quantity: item.quantity
        });
      });
      
      res.json({ code: 200, message: 'success', data: cart, currentMealType: getCurrentMealType() });
    } else {
      res.json({ code: 200, message: 'success', data: memoryMode.cart, currentMealType: getCurrentMealType() });
    }
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 添加到购物车
app.post('/api/v1/cart', async (req, res) => {
  try {
    const { food_id, meal_type, quantity = 1 } = req.body;
    const targetMeal = meal_type || getCurrentMealType();
    
    if (pool) {
      // 检查是否已存在
      const [existing] = await pool.query(
        'SELECT * FROM cart WHERE food_id = ? AND meal_type = ?',
        [food_id, targetMeal]
      );
      
      if (existing.length > 0) {
        await pool.query(
          'UPDATE cart SET quantity = quantity + ? WHERE id = ?',
          [quantity, existing[0].id]
        );
      } else {
        await pool.query(
          'INSERT INTO cart (food_id, meal_type, quantity) VALUES (?, ?, ?)',
          [food_id, targetMeal, quantity]
        );
      }
    } else {
      const existing = memoryMode.cart[targetMeal].find(item => item.food_id === food_id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        const food = memoryMode.foods.find(f => f.id === food_id);
        memoryMode.cart[targetMeal].push({
          id: Date.now(),
          food_id,
          name: food.name,
          image: food.image,
          ingredients: food.ingredients,
          seasonings: food.seasonings,
          quantity
        });
      }
    }
    
    res.status(201).json({ code: 201, message: '添加成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 更新购物车数量
app.put('/api/v1/cart/:meal_type/:id', async (req, res) => {
  try {
    const { meal_type, id } = req.params;
    const { quantity } = req.body;
    
    if (pool) {
      if (quantity <= 0) {
        await pool.query('DELETE FROM cart WHERE id = ?', [id]);
      } else {
        await pool.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, id]);
      }
    } else {
      const itemIndex = memoryMode.cart[meal_type].findIndex(item => item.id === parseInt(id));
      if (itemIndex !== -1) {
        if (quantity <= 0) {
          memoryMode.cart[meal_type].splice(itemIndex, 1);
        } else {
          memoryMode.cart[meal_type][itemIndex].quantity = quantity;
        }
      }
    }
    
    res.json({ code: 200, message: '更新成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 删除购物车项
app.delete('/api/v1/cart/:meal_type/:id', async (req, res) => {
  try {
    const { meal_type, id } = req.params;
    
    if (pool) {
      await pool.query('DELETE FROM cart WHERE id = ?', [id]);
    } else {
      memoryMode.cart[meal_type] = memoryMode.cart[meal_type].filter(item => item.id !== parseInt(id));
    }
    
    res.json({ code: 200, message: '删除成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 清空购物车
app.delete('/api/v1/cart/:meal_type', async (req, res) => {
  try {
    const { meal_type } = req.params;
    
    if (pool) {
      if (meal_type === 'all') {
        await pool.query('DELETE FROM cart');
      } else {
        await pool.query('DELETE FROM cart WHERE meal_type = ?', [meal_type]);
      }
    } else {
      if (meal_type === 'all') {
        memoryMode.cart = { breakfast: [], lunch: [], dinner: [] };
      } else {
        memoryMode.cart[meal_type] = [];
      }
    }
    
    res.json({ code: 200, message: '清空成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 完成餐点
app.post('/api/v1/cart/complete/:meal_type', async (req, res) => {
  try {
    const { meal_type } = req.params;
    const today = new Date().toISOString().split('T')[0];
    
    if (pool) {
      // 获取当前餐点的购物车内容
      const [cartItems] = await pool.query(
        'SELECT * FROM cart WHERE meal_type = ?',
        [meal_type]
      );
      
      // 移入历史记录
      for (const item of cartItems) {
        await pool.query(
          'INSERT INTO meal_history (date, meal_type, food_id, quantity) VALUES (?, ?, ?, ?)',
          [today, meal_type, item.food_id, item.quantity]
        );
      }
      
      // 清空当前餐点
      await pool.query('DELETE FROM cart WHERE meal_type = ?', [meal_type]);
    } else {
      // 内存模式
      if (!memoryMode.history[today]) {
        memoryMode.history[today] = { breakfast: [], lunch: [], dinner: [] };
      }
      memoryMode.history[today][meal_type] = [...memoryMode.cart[meal_type]];
      memoryMode.cart[meal_type] = [];
    }
    
    res.json({ code: 200, message: '完成餐点' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 获取购物车统计
app.get('/api/v1/cart/stats/:meal_type', async (req, res) => {
  try {
    const { meal_type } = req.params;
    
    let items;
    if (pool) {
      const [rows] = await pool.query(`
        SELECT c.*, f.ingredients, f.seasonings 
        FROM cart c 
        JOIN foods f ON c.food_id = f.id 
        WHERE c.meal_type = ?
      `, [meal_type]);
      items = rows;
    } else {
      items = memoryMode.cart[meal_type] || [];
    }
    
    const allIngredients = [];
    const allSeasonings = new Set();
    
    items.forEach(item => {
      if (item.ingredients) {
        item.ingredients.split(',').forEach(ing => {
          allIngredients.push({ name: ing.trim() });
        });
      }
      if (item.seasonings) {
        item.seasonings.split(',').forEach(s => allSeasonings.add(s.trim()));
      }
    });
    
    res.json({
      code: 200,
      message: 'success',
      data: {
        ingredients: allIngredients,
        seasonings: Array.from(allSeasonings),
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 获取用餐历史
app.get('/api/v1/meal-history/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    if (pool) {
      const [rows] = await pool.query(`
        SELECT h.*, f.name, f.image 
        FROM meal_history h 
        JOIN foods f ON h.food_id = f.id 
        WHERE h.date = ?
        ORDER BY h.completed_at DESC
      `, [date]);
      
      const history = { breakfast: [], lunch: [], dinner: [] };
      rows.forEach(item => {
        history[item.meal_type].push(item);
      });
      
      res.json({ code: 200, message: 'success', data: history });
    } else {
      res.json({ code: 200, message: 'success', data: memoryMode.history[date] || { breakfast: [], lunch: [], dinner: [] } });
    }
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 登录
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      
      if (rows.length === 0 || rows[0].password !== password) {
        return res.status(401).json({ code: 401, message: '用户名或密码错误' });
      }
      
      res.json({
        code: 200,
        message: '登录成功',
        data: {
          user: { id: rows[0].id, username: rows[0].username, role: rows[0].role },
          token: 'mock-jwt-token-' + rows[0].id
        }
      });
    } else {
      // 内存模式 - 简单验证
      if (username === 'admin' && password === 'admin123') {
        res.json({
          code: 200,
          message: '登录成功',
          data: {
            user: { id: 1, username: 'admin', role: 'admin' },
            token: 'mock-jwt-token-12345'
          }
        });
      } else {
        res.status(401).json({ code: 401, message: '用户名或密码错误' });
      }
    }
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 启动服务器
async function start() {
  await initDB();
  
  app.listen(port, () => {
    console.log(`🌲 小森美食后端运行在 http://localhost:${port}`);
    console.log(`📊 当前餐点: ${getCurrentMealType()}`);
    console.log(`💾 数据模式: ${pool ? 'MySQL数据库' : '内存模式'}`);
    console.log('');
    console.log('📋 数据库配置:');
    console.log(`   主机: ${dbConfig.host}`);
    console.log(`   端口: ${dbConfig.port}`);
    console.log(`   数据库: ${dbConfig.database}`);
    console.log('');
    console.log('如需连接数据库，请设置环境变量:');
    console.log('   DB_HOST=localhost DB_USER=xiaosen DB_PASSWORD=xiaosen123 npm start');
  });
}

start();