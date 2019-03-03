<template>
    <section class="chart-container" v-loading="listLoading">
        <el-row>
            <el-col :span="8">
                <div id="chartPie" style="width:100%; height:300px;"></div>
            </el-col>
            <el-col :span="11">
                <div id="chartBar" style="width:100%; height:300px;"></div>
            </el-col>
            <el-col :span="5">
                  <div id="wordCloud" style="width:100%; height:300px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartLine" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartLineActive" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartColumn" style="width:100%; height:300px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartBoardColumn" style="width:100%; height:300px;"></div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    require('echarts-wordcloud')
    import { getDashBoard } from '../../api/api';
    import echarts from 'echarts'
    export default {
        data() {
            return {
              // 是否显示加载
              listLoading: false,
              chartWord: null,
              chartColumn: null,
              chartBar: null,
              chartLine: null,
              chartPie: null,
              activeLine: null,
              BoardColumn: null,
              // 后台返回的数据集
              data: {
                newsCount: 11,
                guestCount: 6,
                pictureCount: 2,
                fileCount: 1,
                logCount: 61,
                notesCount: 0,
                planCount: 15,
                bookCount: 3,
                bookList: [{
                  "name": "测试-1",
                  "notesCount": 2,
                }, {
                  "name": "测试",
                  "notesCount": 4,
                }, {
                  "name": "测试",
                  "notesCount": 2,
                }],
                financial6: [{
                  "deposited": 4137.56,
                  "expenditure": 630.49,
                  "tradeDate": "2018-09",
                  "currencyNumber": 5771.05
                }, {
                  "deposited": 4153.0,
                  "expenditure": 2433.63,
                  "tradeDate": "2018-10",
                  "currencyNumber": 6586.63
                }, {
                  "deposited": 5153.88,
                  "expenditure": 9012.42,
                  "tradeDate": "2018-11",
                  "currencyNumber": 14166.3
                }, {
                  "deposited": 4153.0,
                  "expenditure": 5842.86,
                  "tradeDate": "2018-12",
                  "currencyNumber": 9981.87
                }, {
                  "deposited": 17841.46,
                  "expenditure": 1433.34,
                  "tradeDate": "2019-01",
                  "currencyNumber": 19274.7
                }, {
                  "deposited": 8708.88,
                  "expenditure": 3809.92,
                  "tradeDate": "2019-02",
                  "currencyNumber": 12518.8
                }],
                log6: {
                  "2018-09": 34,
                  "2018-10": 45,
                  "2018-11": 23,
                  "2018-12": 34,
                  "2019-01": 47,
                  "2019-02": 50
                },
                files6: {
                  "2018-09": 5,
                  "2018-10": 3,
                  "2018-11": 6,
                  "2018-12": 5,
                  "2019-01": 7,
                  "2019-02": 9
                },
                news6: {
                  "2018-09": 2,
                  "2018-10": 4,
                  "2018-11": 5,
                  "2018-12": 3,
                  "2019-01": 3,
                  "2019-02": 1
                },
                board: {
                  "2018-09": 1,
                  "2018-10": 3,
                  "2018-11": 2,
                  "2018-12": 1,
                  "2019-01": 3,
                  "2019-02": 2
                },
              },
            }
        },

        methods: {
          drawPieChart() {
            this.chartPie = echarts.init(document.getElementById('chartPie'));
            this.chartPie.setOption({
              title: {
                text: '数据分布',
                x: 'center'
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: 'vertical',
                left: 'left',
                data: ['动态', '留言', '图片', '文件', '笔记', '计划', '笔记簿']
              },
              series: [
                {
                  name: '记录总数',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '60%'],
                  data: [
                    { value: this.data.newsCount, name: '动态' },
                    { value: this.data.guestCount, name: '留言' },
                    { value: this.data.pictureCount, name: '图片' },
                    { value: this.data.fileCount, name: '文件' },
                    { value: this.data.notesCount, name: '笔记' },
                    { value: this.data.planCount, name: '计划' },
                    { value: this.data.bookCount, name: '笔记簿' }
                  ],
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            });
          },
            drawWordChart() {
              var data = Array();
              for(var i = 0; i < this.data.bookList.length; i++){
                var item = this.data.bookList[i]
                data.push({"name":item.name,"value":item.notesCount})
              }
              this.chartWord = echarts.init(document.getElementById('wordCloud'));
              this.chartWord.setOption({
                series: [
                  {
                    type: 'wordCloud',
                    shape: 'ellipse',
                    gridSize: 8,
                    textStyle: {
                      normal: {
                        fontFamily: '微软雅黑',
                        color: function () {
                          var colors = ['#fda67e', '#81cacc', '#cca8ba', "#88cc81", "#82a0c5", '#fddb7e', '#735ba1', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                          return colors[parseInt(Math.random() * 10)];
                        }
                      }
                    },
                    data: data
                  }
                ]
              });
            },
            drawColumnChart() {
              var mongth = Array();
              var count = Array();
              for(var key in this.data.files6){
                mongth.push(key)
                count.push(this.data.files6[key])
              }
              this.chartColumn = echarts.init(document.getElementById('chartColumn'));
              this.chartColumn.setOption({
                title: { text: '过去的6个月里文件上传量' },
                tooltip: {},
                xAxis: {
                    data: mongth
                },
                yAxis: {},
                series: [{
                    name: '上传数',
                    type: 'bar',
                    data: count
                  }]
              });
            },
            chartBoardColumn() {
              var mongth = Array();
              var count = Array();
              for(var key in this.data.board){
                mongth.push(key)
                count.push(this.data.board[key])
              }
              this.BoardColumn = echarts.init(document.getElementById('chartBoardColumn'));
              this.BoardColumn.setOption({
                title: { text: '过去的6个月里文件上传量' },
                tooltip: {},
                xAxis: {
                  data: mongth
                },
                yAxis: {},
                series: [{
                  name: '上传数',
                  type: 'bar',
                  data: count
                }]
              });
            },
            drawBarChart() {
              var data = Array();
              data.push(['product', '流入', '流出', '总额'])
              for(var i = 0; i < this.data.financial6.length; i++){
                var item = this.data.financial6[i]
                data.push([item.tradeDate, item.deposited, item.expenditure, item.currencyNumber])
              }
              this.chartBar = echarts.init(document.getElementById('chartBar'));
              this.chartBar.setOption({
                  title: {
                      text: '近6个月财务流水',
                  },
                  legend: {},
                  tooltip: {},
                  dataset: {
                    source: data
                  },
                  xAxis: {type: 'category'},
                  yAxis: {},
                  series: [
                    {type: 'bar'},
                    {type: 'bar'},
                    {type: 'bar'}
                  ]
              });
            },
            drawLineChart() {
              var mongth = Array();
              var count = Array();
              for(var key in this.data.news6){
                mongth.push(key)
                count.push(this.data.news6[key])
              }
              this.chartLine = echarts.init(document.getElementById('chartLine'));
              this.chartLine.setOption({
                  title: {
                      text: '过去6个月动态发布情况'
                  },
                  tooltip: {},
                  legend: {},
                  xAxis: {
                    type: 'category',
                    data: mongth
                  },
                  yAxis: {
                    type: 'value'
                  },
                  series: [{
                    data: count,
                    type: 'line',
                    smooth: true
                  }]
              });
            },
            chartLineActive() {
              var mongth = Array();
              var count = Array();
              for(var key in this.data.log6){
                mongth.push(key)
                count.push(this.data.log6[key])
              }
              this.activeLine = echarts.init(document.getElementById('chartLineActive'));
              this.activeLine.setOption({
                title: {
                  text: '过去6个月活跃情况'
                },
                tooltip: {},
                legend: {},
                xAxis: {
                  type: 'category',
                  data: mongth
                },
                yAxis: {
                  type: 'value'
                },
                series: [{
                  data: count,
                  type: 'line',
                  smooth: true
                }]
              });
            },
            getData(){
              this.drawWordChart()
              this.drawColumnChart()
              this.drawBarChart()
              this.drawLineChart()
              this.drawPieChart()
              this.chartLineActive()
              this.chartBoardColumn()
              // this.listLoading = true
              // getDashBoard(null).then((datas) => {
              //   this.listLoading = false;
              //   let { msg, code, data } = datas;
              //   if(code === 0)
              //   {
              //     this.data = data
              //     // 数据加载完成后，开始渲染数据
              //     this.drawWordChart()
              //     this.drawColumnChart()
              //     this.drawBarChart()
              //     this.drawLineChart()
              //     this.drawPieChart()
              //   }else if (code === -7) {
              //     // 未登录或登录失效
              //     sessionStorage.removeItem('user');
              //     this.$router.push('/login');
              //   } else {
              //     this.$message({
              //       message: msg,
              //       type: 'error'
              //     });
              //   }
              // });
            },
        },

        mounted: function () {
            this.getData()
        },
        updated: function () {
            this.getData()
        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 30px 20px;
    }
</style>
