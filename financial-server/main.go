package main

import (
	"financial-server/constant"
	"financial-server/model"
	"financial-server/router"
	"fmt"
	consulRegister "github.com/asim/go-micro/plugins/registry/consul/v4"
	"go-micro.dev/v4/registry" //注意这些地址变了
	"go-micro.dev/v4/web"      //注意这些地址变了
)

func init() {
	// 加载引导类配置，引导配置加载完毕后，才能使用配置中心的配置
	constant.LoadConfigFile()

	// 初始化日志脚手架(前置项：配置文件加载完毕且读取到日志级别)
	constant.SetupLogger()

	// 加载配置中心(前置项：日志脚手架初始化完毕且读取到注册配置中心地址)
	constant.LoadConsulConfig()
}

func main() {
	// 初始化数据库
	model.InitPrimaryDataSource()

	//初始化gin以及路由
	ginRouter := router.InitRouters()

	//新建一个consul注册的地址，也就是我们consul服务启动的机器ip+端口
	consulReg := consulRegister.NewRegistry(
		registry.Addrs(fmt.Sprintf("%s:%d", constant.BootstrapConfigData.RegisterHost, constant.BootstrapConfigData.RegisterPort)))
	//注册服务
	microService := web.NewService(
		web.Name(constant.BootstrapConfigData.ServerName),
		web.Version(constant.BootstrapConfigData.Version),
		// web.RegisterTTL(time.Second*30),//设置注册服务的过期时间
		// web.RegisterInterval(time.Second*20),//设置间隔多久再次注册服务
		web.Address(constant.AppConfigData.ServerConfig.Port), //设置服务的端口
		web.Handler(ginRouter),
		web.Registry(consulReg),
		// 为注册的服务添加Metadata，指定请求协议为http->在使用go-plugins插件进行服务调用时，在服务发现时为选择器添加了过滤，限定了请求协议，要求Metadata的键值必须为"protocol":"http"，否则返回的服务节点切片长度将为0。
		web.Metadata(map[string]string{"protocol": "http"}),
	)
	microService.Run()
}
