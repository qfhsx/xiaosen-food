package main

import (
	"foodie-tech/internal/config"
	"foodie-tech/internal/handler"
	"foodie-tech/internal/middleware"
	"foodie-tech/internal/repository"
	"foodie-tech/internal/service"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// 加载配置
	cfg := config.Load()

	// 初始化数据库
	db, err := repository.InitDB(cfg.Database)
	if err != nil {
		log.Fatal("数据库连接失败:", err)
	}

	// 自动迁移
	repository.AutoMigrate(db)

	// 初始化仓库
	foodRepo := repository.NewFoodRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)
	userRepo := repository.NewUserRepository(db)

	// 初始化服务
	foodService := service.NewFoodService(foodRepo, categoryRepo)
	authService := service.NewAuthService(userRepo, cfg.JWT.Secret)

	// 初始化处理器
	foodHandler := handler.NewFoodHandler(foodService)
	authHandler := handler.NewAuthHandler(authService)

	// 创建Gin引擎
	r := gin.Default()

	// CORS中间件
	r.Use(middleware.CORS())

	// API路由组
	api := r.Group("/api/v1")
	{
		// 公开接口
		api.GET("/foods", foodHandler.GetFoodList)
		api.GET("/foods/:id", foodHandler.GetFoodDetail)
		api.GET("/categories", foodHandler.GetCategories)
		api.POST("/auth/login", authHandler.Login)

		// 需要认证的接口
		admin := api.Group("/")
		admin.Use(middleware.JWTAuth(cfg.JWT.Secret))
		{
			admin.POST("/foods", foodHandler.CreateFood)
			admin.PUT("/foods/:id", foodHandler.UpdateFood)
			admin.DELETE("/foods/:id", foodHandler.DeleteFood)
			admin.POST("/categories", foodHandler.CreateCategory)
			admin.PUT("/categories/:id", foodHandler.UpdateCategory)
			admin.DELETE("/categories/:id", foodHandler.DeleteCategory)
		}
	}

	// 健康检查
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	log.Printf("服务器启动在端口 %s", cfg.Server.Port)
	if err := r.Run(":" + cfg.Server.Port); err != nil {
		log.Fatal("服务器启动失败:", err)
	}
}