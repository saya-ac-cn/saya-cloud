package main

import (
	"financial-server/router"
	"github.com/asim/go-micro/plugins/registry/consul/v3" //注意这些地址变了
	"github.com/asim/go-micro/v3/registry"              //注意这些地址变了
	"github.com/asim/go-micro/v3/web"                   //注意这些地址变了
)

var etcdReg registry.Registry

func init() {
	//新建一个etcd注册的地址，也就是我们etcd服务启动的机器ip+端口
	etcdReg = consul.NewRegistry(
		registry.Addrs("127.0.0.1:2379"))
}

func main() {
	//初始化路由
	ginRouter := router.InitRouters()
	//注册服务
	microService := web.NewService(
		web.Name("financial-server"),
		// web.RegisterTTL(time.Second*30),//设置注册服务的过期时间
		// web.RegisterInterval(time.Second*20),//设置间隔多久再次注册服务
		web.Address(":18001"),
		web.Handler(ginRouter),
		web.Registry(etcdReg),
		// 为注册的服务添加Metadata，指定请求协议为http->在使用go-plugins插件进行服务调用时，在服务发现时为选择器添加了过滤，限定了请求协议，要求Metadata的键值必须为"protocol":"http"，否则返回的服务节点切片长度将为0。
		web.Metadata(map[string]string{"protocol":"http"}),
		)
	microService.Run()
}
