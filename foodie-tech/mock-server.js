const express = require('express');
const cors = require('cors');
const app = express();
const port = 8082;

app.use(cors());
app.use(express.json());

// 获取当前餐点类型
const getCurrentMealType = () => {
  const hour = new Date().getHours();
  if (hour < 10) return 'breakfast';
  if (hour < 15) return 'lunch';
  return 'dinner';
};

// 购物车数据 - 按日期和餐点分类
let cart = {
  breakfast: [],
  lunch: [],
  dinner: []
};

// 每日用餐记录
let mealHistory = {};

// Mock 数据 - 带餐点分类和食材
const categories = [
  { id: 1, name: '家常菜', icon: '🥘' },
  { id: 2, name: '汤羹', icon: '🍲' },
  { id: 3, name: '早餐', icon: '🍳' },
  { id: 4, name: '甜点', icon: '🍰' },
  { id: 5, name: '小吃', icon: '🥟' },
  { id: 6, name: '饮品', icon: '🥤' }
];

// 餐点分类
const mealTypes = [
  { id: 'breakfast', name: '早餐', icon: '🌅', time: '06:00-10:00' },
  { id: 'lunch', name: '午餐', icon: '☀️', time: '10:00-15:00' },
  { id: 'dinner', name: '晚餐', icon: '🌙', time: '15:00-21:00' }
];

const foods = [
  { 
    id: 1, 
    name: '红烧肉', 
    description: '肥而不腻，入口即化的家常红烧肉', 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600', 
    category_id: 1,
    category: { name: '家常菜' },
    meals: ['lunch', 'dinner'],
    tags: '下饭菜,经典', 
    rating: 4.9, 
    ingredients: '五花肉500g, 冰糖30g, 生抽2勺, 老抽1勺, 料酒2勺, 生姜3片, 八角2个',
    seasonings: '生抽, 老抽, 料酒, 冰糖, 八角',
    created_at: '2024-01-15T10:00:00Z'
  },
  { 
    id: 2, 
    name: '西红柿鸡蛋汤', 
    description: '清爽开胃的西红柿鸡蛋汤，酸甜适口', 
    image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=600', 
    category_id: 2,
    category: { name: '汤羹' },
    meals: ['lunch', 'dinner'],
    tags: '快手,清淡', 
    rating: 4.7, 
    ingredients: '西红柿2个, 鸡蛋2个, 葱花适量, 香菜适量',
    seasonings: '盐, 鸡精, 香油, 白胡椒粉',
    created_at: '2024-01-14T09:30:00Z'
  },
  { 
    id: 3, 
    name: '蛋炒饭', 
    description: '粒粒分明的黄金蛋炒饭', 
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?w=600', 
    category_id: 1,
    category: { name: '家常菜' },
    meals: ['breakfast', 'lunch', 'dinner'],
    tags: '快手,主食', 
    rating: 4.6, 
    ingredients: '隔夜米饭2碗, 鸡蛋3个, 火腿肠1根, 胡萝卜丁50g, 青豆50g',
    seasonings: '盐, 生抽, 白胡椒粉',
    created_at: '2024-01-13T14:00:00Z'
  },
  { 
    id: 4, 
    name: '自制奶茶', 
    description: '香浓顺滑的自制奶茶', 
    image: 'https://images.unsplash.com/photo-1558855410-3112e255e40e?w=600', 
    category_id: 6,
    category: { name: '饮品' },
    meals: ['breakfast', 'afternoon'],
    tags: '甜品,自制', 
    rating: 4.8, 
    ingredients: '红茶包2个, 牛奶500ml, 水200ml, 白糖适量',
    seasonings: '红茶, 牛奶, 糖',
    created_at: '2024-01-12T11:00:00Z'
  },
  { 
    id: 5, 
    name: '煎饺子', 
    description: '金黄酥脆的煎饺，外焦里嫩', 
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600', 
    category_id: 5,
    category: { name: '小吃' },
    meals: ['breakfast', 'lunch', 'dinner'],
    tags: '主食,经典', 
    rating: 4.7, 
    ingredients: '饺子15个, 食用油2勺, 清水半碗, 芝麻适量',
    seasonings: '醋, 生抽, 辣椒油, 香油',
    created_at: '2024-01-11T16:00:00Z'
  },
  { 
    id: 6, 
    name: '可乐鸡翅', 
    description: '甜中带咸的可乐鸡翅，色泽红亮', 
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600', 
    category_id: 1,
    category: { name: '家常菜' },
    meals: ['lunch', 'dinner'],
    tags: '下饭菜,人气', 
    rating: 4.8, 
    ingredients: '鸡翅中10个, 可乐1罐, 生姜3片, 蒜3瓣',
    seasonings: '生抽, 老抽, 料酒, 盐',
    created_at: '2024-01-10T18:00:00Z'
  },
  { 
    id: 7, 
    name: '葱花鸡蛋饼', 
    description: '香软的葱花鸡蛋饼，早餐首选', 
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', 
    category_id: 3,
    category: { name: '早餐' },
    meals: ['breakfast'],
    tags: '快手,早餐', 
    rating: 4.5, 
    ingredients: '面粉200g, 鸡蛋2个, 葱花适量, 清水适量',
    seasonings: '盐, 五香粉',
    created_at: '2024-01-09T12:00:00Z'
  },
  { 
    id: 8, 
    name: '芒果班戟', 
    description: '松软香甜的芒果班戟', 
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600', 
    category_id: 4,
    category: { name: '甜点' },
    meals: ['afternoon', 'dinner'],
    tags: '甜品,下午茶', 
    rating: 4.9, 
    ingredients: '低筋面粉100g, 牛奶250ml, 鸡蛋1个, 芒果1个, 淡奶油200ml',
    seasonings: '糖粉, 香草精',
    created_at: '2024-01-08T15:00:00Z'
  },
  { 
    id: 9, 
    name: '小米粥', 
    description: '养胃小米粥，早餐必备', 
    image: 'https://images.unsplash.com/photo-1511910849309-0dffb8785146?w=600', 
    category_id: 3,
    category: { name: '早餐' },
    meals: ['breakfast'],
    tags: '养生,早餐', 
    rating: 4.6, 
    ingredients: '小米100g, 清水适量, 红枣5颗, 枸杞适量',
    seasonings: '冰糖（可选）',
    created_at: '2024-01-08T15:00:00Z'
  },
  { 
    id: 10, 
    name: '清蒸鲈鱼', 
    description: '鲜嫩清蒸鲈鱼，营养健康', 
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600', 
    category_id: 1,
    category: { name: '家常菜' },
    meals: ['lunch', 'dinner'],
    tags: '清淡,营养', 
    rating: 4.8, 
    ingredients: '鲈鱼1条, 生姜5片, 葱2根, 红椒丝适量',
    seasonings: '蒸鱼豉油, 料酒, 盐',
    created_at: '2024-01-08T15:00:00Z'
  }
];

// ========== 健康检查 ==========
app.get('/health', (req, res) => {
  res.json({ status: 'ok', code: 200 });
});

// ========== 美食接口 ==========

// 获取美食列表
app.get('/api/v1/foods', (req, res) => {
  let result = [...foods];
  const { category_id, meal_type, keyword, page = 1, page_size = 10 } = req.query;
  
  if (category_id) {
    result = result.filter(f => f.category_id === parseInt(category_id));
  }
  
  if (meal_type && meal_type !== 'all') {
    result = result.filter(f => f.meals && f.meals.includes(meal_type));
  }
  
  if (keyword) {
    const k = keyword.toLowerCase();
    result = result.filter(f => 
      f.name.toLowerCase().includes(k) || 
      f.description.toLowerCase().includes(k) ||
      (f.ingredients && f.ingredients.toLowerCase().includes(k))
    );
  }
  
  const total = result.length;
  const start = (page - 1) * page_size;
  const end = start + parseInt(page_size);
  result = result.slice(start, end);
  
  res.json({
    code: 200,
    message: 'success',
    data: result,
    total,
    page: parseInt(page),
    page_size: parseInt(page_size)
  });
});

// 获取美食详情
app.get('/api/v1/foods/:id', (req, res) => {
  const food = foods.find(f => f.id === parseInt(req.params.id));
  if (!food) {
    return res.status(404).json({ code: 404, message: '美食不存在' });
  }
  res.json({ code: 200, message: 'success', data: food });
});

// 创建美食
app.post('/api/v1/foods', (req, res) => {
  const category = categories.find(c => c.id === req.body.category_id);
  const newFood = {
    id: foods.length + 1,
    ...req.body,
    category: category ? { name: category.name } : null,
    meals: req.body.meals || ['lunch', 'dinner'],
    created_at: new Date().toISOString()
  };
  foods.unshift(newFood);
  res.status(201).json({ code: 201, message: '创建成功', data: newFood });
});

// 更新美食
app.put('/api/v1/foods/:id', (req, res) => {
  const index = foods.findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ code: 404, message: '美食不存在' });
  }
  const category = categories.find(c => c.id === req.body.category_id);
  foods[index] = { 
    ...foods[index], 
    ...req.body,
    category: category ? { name: category.name } : foods[index].category,
    updated_at: new Date().toISOString()
  };
  res.json({ code: 200, message: '更新成功', data: foods[index] });
});

// 删除美食
app.delete('/api/v1/foods/:id', (req, res) => {
  const index = foods.findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ code: 404, message: '美食不存在' });
  }
  foods.splice(index, 1);
  res.json({ code: 200, message: '删除成功' });
});

// ========== 餐点类型接口 ==========

// 获取餐点类型
app.get('/api/v1/meal-types', (req, res) => {
  res.json({ 
    code: 200, 
    message: 'success', 
    data: mealTypes,
    current: getCurrentMealType()
  });
});

// ========== 分类接口 ==========

app.get('/api/v1/categories', (req, res) => {
  res.json({ code: 200, message: 'success', data: categories });
});

app.post('/api/v1/categories', (req, res) => {
  const newCategory = {
    id: categories.length + 1,
    ...req.body,
    created_at: new Date().toISOString()
  };
  categories.push(newCategory);
  res.status(201).json({ code: 201, message: '创建成功', data: newCategory });
});

app.put('/api/v1/categories/:id', (req, res) => {
  const index = categories.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ code: 404, message: '分类不存在' });
  }
  categories[index] = { ...categories[index], ...req.body };
  res.json({ code: 200, message: '更新成功', data: categories[index] });
});

app.delete('/api/v1/categories/:id', (req, res) => {
  const index = categories.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ code: 404, message: '分类不存在' });
  }
  categories.splice(index, 1);
  res.json({ code: 200, message: '删除成功' });
});

// ========== 购物车接口 ==========

// 获取购物车
app.get('/api/v1/cart', (req, res) => {
  res.json({ 
    code: 200, 
    message: 'success', 
    data: cart,
    currentMealType: getCurrentMealType()
  });
});

// 添加到购物车
app.post('/api/v1/cart', (req, res) => {
  const { food_id, meal_type, quantity = 1 } = req.body;
  const food = foods.find(f => f.id === food_id);
  
  if (!food) {
    return res.status(404).json({ code: 404, message: '美食不存在' });
  }
  
  // 默认使用当前餐点类型
  const targetMeal = meal_type || getCurrentMealType();
  
  const existingItem = cart[targetMeal].find(item => item.food_id === food_id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart[targetMeal].push({
      id: Date.now(),
      food_id: food.id,
      name: food.name,
      image: food.image,
      ingredients: food.ingredients,
      seasonings: food.seasonings,
      quantity: quantity
    });
  }
  
  res.status(201).json({ code: 201, message: '添加成功', data: cart });
});

// 更新购物车数量
app.put('/api/v1/cart/:meal_type/:id', (req, res) => {
  const { meal_type, id } = req.params;
  const { quantity } = req.body;
  
  const itemIndex = cart[meal_type].findIndex(item => item.id === parseInt(id));
  
  if (itemIndex === -1) {
    return res.status(404).json({ code: 404, message: '购物车项不存在' });
  }
  
  if (quantity <= 0) {
    cart[meal_type].splice(itemIndex, 1);
  } else {
    cart[meal_type][itemIndex].quantity = quantity;
  }
  
  res.json({ code: 200, message: '更新成功', data: cart });
});

// 删除购物车项
app.delete('/api/v1/cart/:meal_type/:id', (req, res) => {
  const { meal_type, id } = req.params;
  cart[meal_type] = cart[meal_type].filter(item => item.id !== parseInt(id));
  res.json({ code: 200, message: '删除成功', data: cart });
});

// 清空某个餐点购物车
app.delete('/api/v1/cart/:meal_type', (req, res) => {
  const { meal_type } = req.params;
  if (meal_type === 'all') {
    cart = { breakfast: [], lunch: [], dinner: [] };
  } else {
    cart[meal_type] = [];
  }
  res.json({ code: 200, message: '清空成功', data: cart });
});

// 完成餐点（移入历史记录）
app.post('/api/v1/cart/complete/:meal_type', (req, res) => {
  const { meal_type } = req.params;
  const today = new Date().toISOString().split('T')[0];
  
  if (!mealHistory[today]) {
    mealHistory[today] = { breakfast: [], lunch: [], dinner: [] };
  }
  
  // 将当前餐点移入历史记录
  mealHistory[today][meal_type] = [...cart[meal_type]];
  
  // 清空当前餐点
  cart[meal_type] = [];
  
  res.json({ 
    code: 200, 
    message: '完成餐点', 
    data: { cart, history: mealHistory[today] }
  });
});

// 获取购物车统计
app.get('/api/v1/cart/stats/:meal_type', (req, res) => {
  const { meal_type } = req.params;
  const items = cart[meal_type] || [];
  
  const allIngredients = [];
  const allSeasonings = new Set();
  
  items.forEach(item => {
    if (item.ingredients) {
      const ingredients = item.ingredients.split(',').map(i => i.trim());
      allIngredients.push(...ingredients.map(ing => ({
        name: ing,
        dish: item.name,
        quantity: item.quantity
      })));
    }
    
    if (item.seasonings) {
      const seasonings = item.seasonings.split(',').map(s => s.trim());
      seasonings.forEach(s => allSeasonings.add(s));
    }
  });
  
  const ingredientMap = {};
  allIngredients.forEach(ing => {
    const key = ing.name;
    if (!ingredientMap[key]) {
      ingredientMap[key] = { name: ing.name, dishes: [] };
    }
    ingredientMap[key].dishes.push(ing.dish);
  });
  
  res.json({
    code: 200,
    message: 'success',
    data: {
      ingredients: Object.values(ingredientMap),
      seasonings: Array.from(allSeasonings),
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0)
    }
  });
});

// ========== 用餐历史记录接口 ==========

// 获取某天的用餐记录
app.get('/api/v1/meal-history/:date', (req, res) => {
  const { date } = req.params;
  const history = mealHistory[date] || { breakfast: [], lunch: [], dinner: [] };
  res.json({ code: 200, message: 'success', data: history });
});

// 获取所有历史记录
app.get('/api/v1/meal-history', (req, res) => {
  res.json({ code: 200, message: 'success', data: mealHistory });
});

// ========== 登录接口 ==========
app.post('/api/v1/auth/login', (req, res) => {
  const { username, password } = req.body;
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
});

app.listen(port, () => {
  console.log(`🌲 小森美食后端运行在 http://localhost:${port}`);
  console.log(`📊 当前餐点: ${getCurrentMealType()}`);
});

module.exports = { getCurrentMealType };