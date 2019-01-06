import Vue from 'vue'
import Router from 'vue-router'
import BackendLayout from '@/views/layout/Backend'
import HelloWorld from '@/views/backend/UploadLogo'
import Login from '@/views/backend/Login'
import Log from '@/views/backend/Log'
import info from '@/views/backend/BasicInfo'

Vue.use(Router)

var baseName = 'saya.ac.cn-'

export default new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/login',
      component: Login,
      name: '',
      hidden: true,
      meta: {
        title: baseName + '统一认证入口'
      }
    },
    {
      path: '/set',
      component: BackendLayout,
      name: '系统设置',
      iconCls: 'fa el-icon-setting', // 图标样式class
      children: [
        { path: '/set/info', component: info, name: '基本信息', hidden: false ,meta:{title: baseName + '基本信息'}},
        { path: '/set/log', component: Log, name: '操作日志', hidden: false ,meta:{title: baseName + '操作日志'}}
      ]
    },
    {
      path: '/fu',
      component: BackendLayout,
      name: '能力开放',
      iconCls: 'fa el-icon-news', // 图标样式class
      children: [
        { path: '/fu/login5', component: Login, name: '接口管理', hidden: false ,meta:{title: baseName + '接口管理'}},
        { path: '/main5', component: HelloWorld, name: '数据管理', hidden: false ,meta:{title: baseName + '数据管理'}}
      ]
    },
    {
      path: '/fu',
      component: BackendLayout,
      name: '数据存储',
      iconCls: 'fa el-icon-document', // 图标样式class
      children: [
        { path: '/fu/login4', component: Login, name: '图片相册', hidden: false ,meta:{title: baseName + '登录1'}},
        { path: '/main4', component: HelloWorld, name: '文档资料', hidden: false ,meta:{title: baseName + '登录1'}}
      ]
    },
    {
      path: '/fu',
      component: BackendLayout,
      name: '对外公布',
      iconCls: 'fa el-icon-message', // 图标样式class
      children: [
        { path: '/fu/login3', component: Login, name: '平台留言', hidden: false ,meta:{title: baseName + '登录3'}},
        { path: '/fu/login31', component: Login, name: '消息动态', hidden: false ,meta:{title: baseName + '登录3'}}
      ]
    },
    {
      path: '/fu',
      component: BackendLayout,
      name: '财务流水',
      iconCls: 'fa fa-bar-chart', // 图标样式class
      children: [
        { path: '/fu/login2', component: Login, name: '流水报表', hidden: false ,meta:{title: baseName + '接口管理'}},
        { path: '/main2', component: HelloWorld, name: '财务统计', hidden: false ,meta:{title: baseName + '数据管理'}}
      ]
    },
    {
      path: '/fu',
      component: BackendLayout,
      name: '成长发展',
      iconCls: 'fa el-icon-star-on', // 图标样式class
      children: [
        { path: '/fu/login1', component: Login, name: '日程安排', hidden: false ,meta:{title: baseName + '登录3'}},
        { path: '/main1', component: HelloWorld, name: '便笺笔记', hidden: false ,meta:{title: baseName + '登录4'}}
      ]
    }
  ]
})
