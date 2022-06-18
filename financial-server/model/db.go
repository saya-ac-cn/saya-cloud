package model

import (
	"financial-server/constant"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/wenj91/gobatis"
	"sync"
)

var (
	PrimaryDataSource     *gobatis.DB
	primaryDataSourceOnce sync.Once
)

func InitPrimaryDataSource() *gobatis.DB {
	primaryDataSourceOnce.Do(func() {
		fmt.Println("init primaryDataSource instance...")
		// 初始化db
		ds1 := gobatis.NewDataSourceBuilder().
			DataSource(constant.AppConfigData.DatabaseConfig.Primary.DataSource).
			DriverName(constant.AppConfigData.DatabaseConfig.Primary.DriverName).
			DataSourceName(constant.AppConfigData.DatabaseConfig.Primary.DataSourceName).
			MaxLifeTime(constant.AppConfigData.DatabaseConfig.Primary.MaxLifeTime).
			MaxOpenConns(constant.AppConfigData.DatabaseConfig.Primary.MaxOpenConns).
			MaxIdleConns(constant.AppConfigData.DatabaseConfig.Primary.MaxIdleConns).
			Build()

		option := gobatis.NewDSOption().
			DS([]*gobatis.DataSource{ds1}).
			Mappers([]string{"./model/productMapper.xml", "./model/userMapper.xml", "./model/logMapper.xml"}).
			ShowSQL(constant.AppConfigData.DatabaseConfig.ShowSql)
		gobatis.Init(option)
		// 获取数据源，参数为数据源名称，如：ds1
		PrimaryDataSource = gobatis.Get(constant.AppConfigData.DatabaseConfig.Primary.DataSource)
	})
	return PrimaryDataSource
}
