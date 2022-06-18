package constant

/**
 * 整个项目相关的环境配置都定义在此处，一经初始化，不再修改
 */
var (
	// 定义的项目引导类配置变量
	BootstrapConfigData = &BootstrapConfig{}
	AppConfigData       = &AppConfig{}
)

// 项目引导类配置
type BootstrapConfig struct {
	// 服务名称&&读取配置的前缀
	ServerName string `json:"server_name"`
	// 版本号
	Version string `json:"version"`
	// 日志级别：panic,fatal,error,warn,info,debug,trace
	LogLevel string `json:"log_level"`
	// 服务注册中心地址
	RegisterHost string `json:"register_host"`
	// 服务注册中心端口
	RegisterPort int `json:"register_port"`
}

// 项目配置
type AppConfig struct {
	ServerConfig   ServerConfig   `json:"server"`
	AmapConfig     AmapConfig     `json:"amap"`
	DatabaseConfig DatabaseConfig `json:"database"`
}

// 系统相关配置
type ServerConfig struct {
	// debug 开发模式，release 生产模式
	Mode   string `json:"mode"`
	Port   string `json:"port"`
	JwtKey string `json:"jwt_key"`
}

// 高德地图配置
type AmapConfig struct {
	// 调用地址
	Url string `json:"url"`
	// 调用凭证
	Key string `json:"key"`
}

// 数据库配置
type DatabaseConfig struct {
	// 是否显示SQL语句
	ShowSql bool `json:"show_sql"`
	// 主数据源
	Primary DataSourceConfig `json:"primary"`
}

// 数据源配置
type DataSourceConfig struct {
	// 数据源名称
	DataSource string `json:"data_source"`
	// 驱动名
	DriverName string `json:"driver_name"`
	// 连接地址
	DataSourceName string `json:"data_source_name"`
	// 连接最大存活时间（单位: s）
	MaxLifeTime int `json:"max_life_time"`
	// 最大open连接数
	MaxOpenConns int `json:"max_open_conns"`
	// 最大挂起连接数
	MaxIdleConns int `json:"max_idle_conns"`
}
