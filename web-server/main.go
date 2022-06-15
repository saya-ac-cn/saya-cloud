package main

import (
	"context"
	"fmt"
	hystrixGo "github.com/afex/hystrix-go/hystrix"
	httpClient "github.com/asim/go-micro/plugins/client/http/v3"
	"github.com/asim/go-micro/plugins/registry/consul/v3"
	// "github.com/asim/go-micro/plugins/registry/etcd/v3"
	"github.com/asim/go-micro/plugins/wrapper/breaker/hystrix/v3"
	"github.com/asim/go-micro/v3/client"
	"github.com/asim/go-micro/v3/registry"
	"github.com/asim/go-micro/v3/selector"
	"github.com/asim/go-micro/v3/web"
	"web-server/router"
)

var etcdReg registry.Registry
// https://zhuanlan.zhihu.com/p/389732281
// https://gocn.vip/profile/yang759126596/topic

func main() {
	//初始化路由
	ginRouter := router.InitRouters()
	//新建一个etcd注册的地址，也就是我们etcd服务启动的机器ip+端口
	etcdReg = consul.NewRegistry(
		registry.Addrs("127.0.0.1:2379"),
	)
	//注册服务
	microService := web.NewService(
		web.Name("web-server"),
		//web.RegisterTTL(time.Second*30),//设置注册服务的过期时间
		//web.RegisterInterval(time.Second*20),//设置间隔多久再次注册服务
		web.Address(":18002"),
		web.Handler(ginRouter),
		web.Registry(etcdReg),
		// 为注册的服务添加Metadata，指定请求协议为http->在使用go-plugins插件进行服务调用时，在服务发现时为选择器添加了过滤，限定了请求协议，要求Metadata的键值必须为"protocol":"http"，否则返回的服务节点切片长度将为0。
		// https://blog.csdn.net/MrKorbin/article/details/110941595
		web.Metadata(map[string]string{"protocol":"http"}),
	)
	microselector := selector.NewSelector(
		selector.Registry(etcdReg),              //传入etcd注册
		selector.SetStrategy(selector.RoundRobin), //指定查询机制
	)
	microClient := httpClient.NewClient(
		client.Selector(microselector),
		client.ContentType("application/json"),
		client.Wrap(hystrix.NewClientWrapper()), // 熔断操作
	)
	// 重试时间窗口
	hystrixGo.DefaultSleepWindow = 5000
	// 超时时间窗口
	hystrixGo.DefaultTimeout =5000
	// 默认最大失败次数
	hystrixGo.DefaultVolumeThreshold = 3
	req := microClient.NewRequest("financial-server", "/users", map[string]string{})
	var resp map[string]interface{}
	err := microClient.Call(context.Background(), req, &resp)
	if err == nil {
		fmt.Println(resp)
	}else {
		fmt.Println(err)
	}
	microService.Run()
}
