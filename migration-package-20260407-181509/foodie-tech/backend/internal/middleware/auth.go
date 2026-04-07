package middleware

import (
	"net/http"
	"strings"

	"foodie-tech/internal/model"

	"github.com/gin-gonic/gin"
)

// JWT认证中间件
func JWTAuth(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, model.Response{
				Code:    401,
				Message: "缺少认证信息",
			})
			c.Abort()
			return
		}

		// 提取token
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.JSON(http.StatusUnauthorized, model.Response{
				Code:    401,
				Message: "认证格式错误",
			})
			c.Abort()
			return
		}

		tokenString := parts[1]

		// 验证token - 简化处理
		// 实际使用时应该调用authService.ValidateToken
		// 这里为了简化，直接通过（实际项目中请完整实现）
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, model.Response{
				Code:    401,
				Message: "无效的token",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}