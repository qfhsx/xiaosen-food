package repository

import (
	"foodie-tech/internal/model"

	"gorm.io/gorm"
)

type FoodRepository interface {
	Create(food *model.Food) error
	GetByID(id uint) (*model.Food, error)
	GetAll(page, pageSize int, categoryID uint, keyword string) ([]model.Food, int64, error)
	Update(food *model.Food) error
	Delete(id uint) error
	GetFeatured() ([]model.Food, error)
}

type foodRepository struct {
	db *gorm.DB
}

func NewFoodRepository(db *gorm.DB) FoodRepository {
	return &foodRepository{db: db}
}

func (r *foodRepository) Create(food *model.Food) error {
	return r.db.Create(food).Error
}

func (r *foodRepository) GetByID(id uint) (*model.Food, error) {
	var food model.Food
	err := r.db.Preload("Category").First(&food, id).Error
	return &food, err
}

func (r *foodRepository) GetAll(page, pageSize int, categoryID uint, keyword string) ([]model.Food, int64, error) {
	var foods []model.Food
	var total int64

	query := r.db.Model(&model.Food{}).Preload("Category")

	if categoryID > 0 {
		query = query.Where("category_id = ?", categoryID)
	}

	if keyword != "" {
		query = query.Where("name LIKE ? OR description LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
	}

	query.Count(&total)

	offset := (page - 1) * pageSize
	err := query.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&foods).Error

	return foods, total, err
}

func (r *foodRepository) Update(food *model.Food) error {
	return r.db.Save(food).Error
}

func (r *foodRepository) Delete(id uint) error {
	return r.db.Delete(&model.Food{}, id).Error
}

func (r *foodRepository) GetFeatured() ([]model.Food, error) {
	var foods []model.Food
	err := r.db.Where("is_featured = ?", true).Preload("Category").Limit(6).Find(&foods).Error
	return foods, err
}