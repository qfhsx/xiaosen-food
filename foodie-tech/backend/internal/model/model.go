package model

import (
	"time"
	"gorm.io/gorm"
)

// 美食模型
type Food struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Name        string         `gorm:"size:100;not null" json:"name"`
	Description string         `gorm:"type:text" json:"description"`
	Image       string         `gorm:"size:500" json:"image"`
	CategoryID  uint           `json:"category_id"`
	Category    Category       `json:"category,omitempty"`
	Meals       string         `gorm:"type:json" json:"meals"` // ["breakfast", "lunch", "dinner"]
	Tags        string         `gorm:"size:200" json:"tags"`
	Rating      float64        `json:"rating"`
	IsFeatured  bool           `json:"is_featured"`
	Ingredients string         `gorm:"type:text" json:"ingredients"`
	Seasonings  string         `gorm:"type:text" json:"seasonings"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// 分类模型
type Category struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Name        string         `gorm:"size:50;not null;unique" json:"name"`
	Description string         `gorm:"size:200" json:"description"`
	Icon        string         `gorm:"size:100" json:"icon"`
	SortOrder   int            `json:"sort_order"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// 用户模型（管理员）
type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Username  string         `gorm:"size:50;not null;unique" json:"username"`
	Password  string         `gorm:"size:100;not null" json:"-"`
	Email     string         `gorm:"size:100" json:"email"`
	Role      string         `gorm:"size:20;default:'admin'" json:"role"`
	IsActive  bool           `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// 购物车模型
type Cart struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	FoodID    uint      `gorm:"not null" json:"food_id"`
	Food      Food      `gorm:"foreignKey:FoodID" json:"food,omitempty"`
	MealType  string    `gorm:"size:20;not null" json:"meal_type"` // breakfast, lunch, dinner
	Quantity  int       `gorm:"default:1" json:"quantity"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// 用餐历史记录模型
type MealHistory struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	Date       string    `gorm:"type:date;not null" json:"date"`
	MealType   string    `gorm:"size:20;not null" json:"meal_type"` // breakfast, lunch, dinner
	FoodID     uint      `gorm:"not null" json:"food_id"`
	Food       Food      `gorm:"foreignKey:FoodID" json:"food,omitempty"`
	Quantity   int       `gorm:"default:1" json:"quantity"`
	CompletedAt time.Time `json:"completed_at"`
}

// API响应格式
type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// 分页响应
type PaginatedResponse struct {
	Code     int         `json:"code"`
	Message  string      `json:"message"`
	Data     interface{} `json:"data"`
	Total    int64       `json:"total"`
	Page     int         `json:"page"`
	PageSize int         `json:"page_size"`
}