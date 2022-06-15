package router

import (
	"github.com/gin-gonic/gin"
)

func InitRouters() *gin.Engine {
	ginRouter := gin.Default()
	ginRouter.POST("/orders/", func(ctx *gin.Context) {
		ctx.String(200, "get orderinfos")
	})
	return ginRouter
}
