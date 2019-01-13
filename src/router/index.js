import Vue from 'vue'
import Router from 'vue-router'
import BackendLayout from '@/views/layout/Backend'
import HelloWorld from '@/views/backend/UploadLogo'
import Login from '@/views/backend/Login'
import Log from '@/views/backend/Log'
import info from '@/views/backend/BasicInfo'
import editor from '@/views/backend/MarkDownUtils'
import newsmane from '@/views/backend/NewsMana'
import publishnews from '@/views/backend/PublishNews'
import editnews from '@/views/backend/EditNews'
import guestbook from '@/views/backend/GuestBook'
import wallpaper from '@/views/backend/Wallpaper'
import illustration from '@/views/backend/Lllustration'

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
      path: '/editor',
      component: editor,
      name: '',
      hidden: true,
      meta: {
        title: baseName + '在线编辑器'
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
        { path: '/oss/picture/wallpaper', component: wallpaper, name: '图片壁纸', hidden: false ,meta:{title: baseName + '图片壁纸'}},
        { path: '/oss/picture/illustration', component: illustration, name: '文章插图', hidden: false ,meta:{title: baseName + '文章插图'}},
        { path: '/main4', component: HelloWorld, name: '文档资料', hidden: false ,meta:{title: baseName + '登录1'}}
      ]
    },
    {
      path: '/fu',
      component: BackendLayout,
      name: '对外公布',
      iconCls: 'fa el-icon-message', // 图标样式class
      children: [
        { path: '/message/guestbook', component: guestbook, name: '平台留言', hidden: false ,meta:{title: baseName + '平台留言'}},
        { path: '/message/news', component: newsmane, name: '消息动态', hidden: false ,meta:{title: baseName + '消息动态'}},
        { path: '/message/news/publish', component: publishnews, name: '发布动态', hidden: true ,meta:{title: baseName + '发布动态'}},
        { path: '/message/news/edit', component: editnews, name: '编辑动态', hidden: true ,meta:{title: baseName + '发布动态'}},
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
