package main

import (
	"financial-server/router"
	consulConfig "github.com/asim/go-micro/plugins/config/source/consul/v4"
	consulRegister "github.com/asim/go-micro/plugins/registry/consul/v4" //注意这些地址变了
	"go-micro.dev/v4/config"
	"go-micro.dev/v4/logger"
	"go-micro.dev/v4/registry" //注意这些地址变了
	"go-micro.dev/v4/web"      //注意这些地址变了
)

var consulReg registry.Registry

func init() {
	//新建一个consul注册的地址，也就是我们consul服务启动的机器ip+端口
	consulReg = consulRegister.NewRegistry(
		registry.Addrs("10.100.30.212:8500"))
}

func main() {
	// 加载配置中心
	consulConfigData, err := GetConsulConfig()
	if err != nil {
		logger.Fatal(err)
	}

	// Mysql配置信息
	mysqlInfo, err := GetAppConfigFromConsul(consulConfigData, "server")
	if err != nil {
		logger.Fatal(err)
	}

	logger.Info("Mysql配置信息:", mysqlInfo)

	//初始化路由
	ginRouter := router.InitRouters()
	//注册服务
	microService := web.NewService(
		web.Name("financial-server"),
		web.Version("1.0.0"),
		// web.RegisterTTL(time.Second*30),//设置注册服务的过期时间
		// web.RegisterInterval(time.Second*20),//设置间隔多久再次注册服务
		web.Address(":18001"),
		web.Handler(ginRouter),
		web.Registry(consulReg),
		// 为注册的服务添加Metadata，指定请求协议为http->在使用go-plugins插件进行服务调用时，在服务发现时为选择器添加了过滤，限定了请求协议，要求Metadata的键值必须为"protocol":"http"，否则返回的服务节点切片长度将为0。
		web.Metadata(map[string]string{"protocol": "http"}),
	)
	microService.Run()
}

// GetConsulConfig 设置配置中心
func GetConsulConfig() (config.Config, error) {
	//添加配置中心
	//配置中心使用consul key/value 模式
	consulSource := consulConfig.NewSource(
		//设置配置中心地址
		consulConfig.WithAddress("10.100.30.212:8500"),
		//设置前缀，不设置默认为 /micro/config
		consulConfig.WithPrefix("/shmily"),
		//是否移除前缀，这里设置为true 表示可以不带前缀直接获取对应配置
		consulConfig.StripPrefix(true),
	)
	//配置初始化
	conf, err := config.NewConfig()
	if err != nil {
		return conf, err
	}
	//加载配置
	err = conf.Load(consulSource)
	return conf, err
}

// GetMysqlFromConsul 获取mysql的配置（json）
func GetMysqlFromConsul(config config.Config, path ...string) (*MysqlConfig, error) {
	mysqlConfig := &MysqlConfig{}
	//获取配置
	err := config.Get(path...).Scan(mysqlConfig)
	if err != nil {
		return nil, err
	}
	return mysqlConfig, nil
}

func GetAppConfigFromConsul(config config.Config, path ...string) (*AppConfig, error) {
	//获取配置
	appConfig := &AppConfig{}
	//获取配置
	err := config.Get(path...).Scan(appConfig)
	if err != nil {
		return nil, err
	}
	return appConfig, nil
}

// MysqlConfig 创建结构体
type MysqlConfig struct {
	Host     string `json:"host"`
	User     string `json:"user"`
	Pwd      string `json:"pwd"`
	Database string `json:"database"`
	Port     int64  `json:"port"`
}

type AppConfig struct {
	Db struct {
		Ip   string `yaml:"ip"`
		Port int    `yaml:"port"`
	} `yaml:"db"`
	Redis struct {
		Ip   string `yaml:"ip"`
		Port int    `yaml:"port"`
	} `yaml:"redis"`
}
