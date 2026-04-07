package handler

import (
	"net/http"
	"strconv"

	"foodie-tech/internal/model"
	"foodie-tech/internal/service"

	"github.com/gin-gonic/gin"
)

type FoodHandler struct {
	foodService service.FoodService
}

func NewFoodHandler(foodService service.FoodService) *FoodHandler {
	return &FoodHandler{foodService: foodService}
}

// 获取美食列表
func (h *FoodHandler) GetFoodList(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	categoryID, _ := strconv.Atoi(c.Query("category_id"))
	keyword := c.Query("keyword")

	foods, total, err := h.foodService.GetFoodList(page, pageSize, uint(categoryID), keyword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Code:    500,
			Message: "获取美食列表失败",
		})
		return
	}

	c.JSON(http.StatusOK, model.PaginatedResponse{
		Code:     200,
		Message:  "success",
		Data:     foods,
		Total:    total,
		Page:     page,
		PageSize: pageSize,
	})
}

// 获取美食详情
func (h *FoodHandler) GetFoodDetail(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Code:    400,
			Message: "无效的美食ID",
		})
		return
	}

	food, err := h.foodService.GetFoodByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, model.Response{
			Code:    404,
			Message: "美食不存在",
		})
		return
	}

	c.JSON(http.StatusOK, model.Response{
		Code:    200,
		Message: "success",
		Data:    food,
	})
}

// 创建美食
func (h *FoodHandler) CreateFood(c *gin.Context) {
	var food model.Food
	if err := c.ShouldBindJSON(&food); err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Code:    400,
			Message: "请求参数错误: " + err.Error(),
		})
		return
	}

	if err := h.foodService.CreateFood(&food); err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Code:    500,
			Message: "创建美食失败",
		})
		return
	}

	c.JSON(http.StatusCreated, model.Response{
		Code:    201,
		Message: "创建成功",
		Data:    food,
	})
}

// 更新美食
func (h *FoodHandler) UpdateFood(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Code:    400,
			Message: "无效的美食ID",
		})
		return
	}

	var food model.Food
	if err := c.ShouldBindJSON(&food); err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Code:    400,
			Message: "请求参数错误: " + err.Error(),
		})
		return
	}

	food.ID = uint(id)
	if err := h.foodService.UpdateFood(&food); err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Code:    500,
			Message: "更新美食失败",
		})
		return
	}

	c.JSON(http.StatusOK, model.Response{
		Code:    200,
		Message: "更新成功",
		Data:    food,
	})
}

// 删除美食
func (h *FoodHandler) DeleteFood(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Code:    400,
			Message: "无效的美食ID",
		})
		return
	}

	if err := h.foodService.DeleteFood(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Code:    500,
			Message: "删除美食失败",
		})
		return
	}

	c.JSON(http.StatusOK, model.Response{
		Code:    200,
		Message: "删除成功",
	})
}

// 获取分类列表
func (h *FoodHandler) GetCategories(c *gin.Context) {
	categories, err := h.foodService.GetCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Code:    500,
			Message: "获取分类列表失败",
		})
		return
	}

	c.JSON(http.StatusOK, model.Response{
		Code:    200,
		Message: "success",
		Data:    categories,
	})
}

// 创建分类
func (h *FoodHandler) CreateCategory(c *gin.Context) {
	var category model.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Code:    400,
			Message: "请求参数错误: " + err.Error(),
		})
		return
	}

	if err := h.foodService.CreateCategory(&category); err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Code:    500,
			Message: "创建分类失败",
		})
		return
	}

	c.JSON(http.StatusCreated, model.Response{
		Code:    201,
		Message: "创建成功",
		Data:    category,
	})
}

// 更新分类
func (h *FoodHandler) UpdateCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Code:    400,
			Message: "无效的分类ID",
		})
		return
	}

	var category model.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Code:    400,
			Message: "请求参数错误: " + err.Error(),
		})
		return
	}

	category.ID = uint(id)
	if err := h.foodService.UpdateCategory(&category); err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Code:    500,
			Message: "更新分类失败",
		})
		return
	}

	c.JSON(http.StatusOK, model.Response{
		Code:    200,
		Message: "更新成功",
		Data:    category,
	})
}

// 删除分类
func (h *FoodHandler) DeleteCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Code:    400,
			Message: "无效的分类ID",
		})
		return
	}

	if err := h.foodService.DeleteCategory(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Code:    500,
			Message: "删除分类失败",
		})
		return
	}

	c.JSON(http.StatusOK, model.Response{
		Code:    200,
		Message: "删除成功",
	})
}