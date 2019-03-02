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
import files from '@/views/backend/FileMana'
import notebook from '@/views/backend/NoteBook'
import notes from '@/views/backend/NotesMana'
import publishnotes from '@/views/backend/PublishNotes'
import editnotes from '@/views/backend/EditNotes'
import planmana from '@/views/backend/PlanMana'
import transactionlist from '@/views/backend/TransactionList'
import financialForDay from '@/views/backend/FinancialForDay'
import financialForMonth from '@/views/backend/FinancialForMonth'
import financialForYear from '@/views/backend/FinancialForYear'
import apiMana from '@/views/backend/ApiMana'
import backUpDB from '@/views/backend/BackUpDB'


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
      path: '/api',
      component: BackendLayout,
      name: '能力开放',
      iconCls: 'fa el-icon-news', // 图标样式class
      children: [
        { path: '/api/nama', component: apiMana, name: '接口管理', hidden: false ,meta:{title: baseName + '接口管理'}},
        { path: '/api/db', component: backUpDB, name: '数据备份', hidden: false ,meta:{title: baseName + '数据备份'}}
      ]
    },
    {
      path: '/oss',
      component: BackendLayout,
      name: '数据存储',
      iconCls: 'fa el-icon-document', // 图标样式class
      children: [
        { path: '/oss/picture/wallpaper', component: wallpaper, name: '图片壁纸', hidden: false ,meta:{title: baseName + '图片壁纸'}},
        { path: '/oss/picture/illustration', component: illustration, name: '文章插图', hidden: false ,meta:{title: baseName + '文章插图'}},
        { path: '/oss/picture/files', component: files, name: '文档资料', hidden: false ,meta:{title: baseName + '文档资料'}}
      ]
    },
    {
      path: '/message',
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
      path: '/financial',
      component: BackendLayout,
      name: '财务流水',
      iconCls: 'fa fa-bar-chart', // 图标样式class
      children: [
        { path: '/financial/transactionlist', component: transactionlist, name: '财务流水', hidden: false ,meta:{title: baseName + '财务流水'}},
        { path: '/financial/financialForDay', component: financialForDay, name: '日度报表', hidden: false ,meta:{title: baseName + '日度报表'}},
        { path: '/financial/financialForMonth', component: financialForMonth, name: '月度报表', hidden: false ,meta:{title: baseName + '月度报表'}},
        { path: '/financial/financialForYear', component: financialForYear, name: '年度报表', hidden: false ,meta:{title: baseName + '年度报表'}},
      ]
    },
    {
      path: '/message',
      component: BackendLayout,
      name: '成长发展',
      iconCls: 'fa el-icon-star-on', // 图标样式class
      children: [
        { path: '/set/plan', component: planmana, name: '日程安排', hidden: false ,meta:{title: baseName + '日程安排'}},
        { path: '/message/notebook', component: notebook, name: '笔记分类', hidden: false ,meta:{title: baseName + '笔记分类'}},
        { path: '/message/notes', component: notes, name: '便笺笔记', hidden: false ,meta:{title: baseName + '便笺笔记'}},
        { path: '/message/notes/publish', component: publishnotes, name: '创建笔记', hidden: true ,meta:{title: baseName + '创建笔记'}},
        { path: '/message/notes/edit', component: editnotes, name: '编辑笔记', hidden: true ,meta:{title: baseName + '编辑笔记'}}
      ]
    }
  ]
})
