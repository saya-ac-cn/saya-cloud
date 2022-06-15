package router

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"time"
)

func InitRouters() *gin.Engine {
	ginRouter := gin.Default()
	ginRouter.POST("/users", func(ctx *gin.Context) {
		go func() {
			time.Sleep(time.Second * 5)
			fmt.Println("超时测试")
		}()
		ctx.String(200, "{\"name\":\"John\"}")
	})
	return ginRouter
}
