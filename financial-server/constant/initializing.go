package constant

import (
	"fmt"
	consulConfig "github.com/asim/go-micro/plugins/config/source/consul/v4"
	"go-micro.dev/v4/config"
	"gopkg.in/ini.v1"
	"os"
)

// 服务的常量配置初始化单元

/**
 * 加载配置文件到内存中
 */

func LoadConfigFile() {
	file, err := ini.Load("constant/bootstrap.ini")
	if err != nil {
		fmt.Println("配置文件读取错误，请检查文件路径:", err)
		os.Exit(-1)
	}
	loadBootstrapConfigData(file.Section("bootstrap"))
}

/**
 * 加载引导类相关的配置
 */
func loadBootstrapConfigData(section *ini.Section) {
	BootstrapConfigData.ServerName = section.Key("ServerName").MustString("financial")
	BootstrapConfigData.Version = section.Key("Version").MustString("v1.0.0")
	BootstrapConfigData.LogLevel = section.Key("LogLevel").MustString("warn")
	BootstrapConfigData.RegisterHost = section.Key("RegisterHost").MustString("127.0.0.1")
	BootstrapConfigData.RegisterPort = section.Key("RegisterPort").MustInt(8500)
}

/**
 * 加载consul配置中心数据
 */
func LoadConsulConfig() {
	//添加配置中心
	//配置中心使用consul key/value 模式
	consulSource := consulConfig.NewSource(
		//设置配置中心地址
		consulConfig.WithAddress(fmt.Sprintf("%s:%d", BootstrapConfigData.RegisterHost, BootstrapConfigData.RegisterPort)),
		//设置前缀，不设置默认为 /micro/config
		consulConfig.WithPrefix(BootstrapConfigData.ServerName),
		//是否移除前缀，这里设置为true 表示可以不带前缀直接获取对应配置
		consulConfig.StripPrefix(false),
	)
	//配置初始化
	conf, err := config.NewConfig()
	if err != nil {
		fmt.Println("加载consul配置中心数据失败:", err)
		os.Exit(-1)
	}
	//加载配置
	err = conf.Load(consulSource)
	fmt.Println("加载到consul配置中心数据:", conf.Map())
	readConsulConfig(conf, BootstrapConfigData.ServerName)
}

/**
 * 获取consul配置中心数据
 */
func readConsulConfig(config config.Config, path ...string) {
	err := config.Get(path...).Scan(AppConfigData)
	if err != nil {
		fmt.Println("读取consul配置中心数据失败:", err)
		os.Exit(-1)
	}
	fmt.Println("读取到consul配置中心数据:", AppConfigData)
}
