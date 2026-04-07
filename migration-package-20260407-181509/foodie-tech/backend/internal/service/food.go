package service

import (
	"foodie-tech/internal/model"
	"foodie-tech/internal/repository"
)

type FoodService interface {
	CreateFood(food *model.Food) error
	GetFoodByID(id uint) (*model.Food, error)
	GetFoodList(page, pageSize int, categoryID uint, keyword string) ([]model.Food, int64, error)
	UpdateFood(food *model.Food) error
	DeleteFood(id uint) error
	GetCategories() ([]model.Category, error)
	CreateCategory(category *model.Category) error
	UpdateCategory(category *model.Category) error
	DeleteCategory(id uint) error
	GetFeaturedFoods() ([]model.Food, error)
}

type foodService struct {
	foodRepo     repository.FoodRepository
	categoryRepo repository.CategoryRepository
}

func NewFoodService(foodRepo repository.FoodRepository, categoryRepo repository.CategoryRepository) FoodService {
	return &foodService{
		foodRepo:     foodRepo,
		categoryRepo: categoryRepo,
	}
}

func (s *foodService) CreateFood(food *model.Food) error {
	return s.foodRepo.Create(food)
}

func (s *foodService) GetFoodByID(id uint) (*model.Food, error) {
	return s.foodRepo.GetByID(id)
}

func (s *foodService) GetFoodList(page, pageSize int, categoryID uint, keyword string) ([]model.Food, int64, error) {
	return s.foodRepo.GetAll(page, pageSize, categoryID, keyword)
}

func (s *foodService) UpdateFood(food *model.Food) error {
	return s.foodRepo.Update(food)
}

func (s *foodService) DeleteFood(id uint) error {
	return s.foodRepo.Delete(id)
}

func (s *foodService) GetCategories() ([]model.Category, error) {
	return s.categoryRepo.GetAll()
}

func (s *foodService) CreateCategory(category *model.Category) error {
	return s.categoryRepo.Create(category)
}

func (s *foodService) UpdateCategory(category *model.Category) error {
	return s.categoryRepo.Update(category)
}

func (s *foodService) DeleteCategory(id uint) error {
	return s.categoryRepo.Delete(id)
}

func (s *foodService) GetFeaturedFoods() ([]model.Food, error) {
	return s.foodRepo.GetFeatured()
}