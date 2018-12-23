import Vue from 'vue'
import Router from 'vue-router'
import BackendLayout from '@/views/layout/Backend'
import HelloWorld from '@/views/HelloWorld'
import Login from '@/views/backend/Login'

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
      path: '/fu',
      component: BackendLayout,
      name: '系统设置',
      iconCls: 'fa el-icon-message', // 图标样式class
      children: [
        { path: '/fu/logins', component: Login, name: '基本信息', hidden: false ,meta:{title: baseName + '基本信息'}},
        { path: '/main', component: HelloWorld, name: '操作日志', hidden: false ,meta:{title: baseName + '操作日志'}}
      ]
    },
    {
      path: '/fu',
      component: BackendLayout,
      name: '能力开放',
      iconCls: 'fa el-icon-message', // 图标样式class
      children: [
        { path: '/fu/logins', component: Login, name: '接口管理', hidden: false ,meta:{title: baseName + '接口管理'}},
        { path: '/main', component: HelloWorld, name: '数据管理', hidden: false ,meta:{title: baseName + '数据管理'}}
      ]
    },
    {
      path: '/fu',
      component: BackendLayout,
      name: '导航一',
      iconCls: 'fa el-icon-message', // 图标样式class
      children: [
        { path: '/fu/logins', component: Login, name: '登录', hidden: false ,meta:{title: baseName + '登录1'}},
        { path: '/main', component: HelloWorld, name: '主页', hidden: false ,meta:{title: baseName + '登录1'}}
      ]
    }
  ]
})
