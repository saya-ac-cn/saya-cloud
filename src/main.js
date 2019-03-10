// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import './assets/theme/element-#752B7D/index.css'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import 'font-awesome/css/font-awesome.min.css'
import VueWechatTitle from 'vue-wechat-title'
// 导入vue-resource
import VueResource from 'vue-resource'
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueWechatTitle)
// 注册resource
Vue.use(VueResource)
// 开启debug模式
Vue.config.debug = true
// const routers = new VueRouter({
//   router
// })

router.beforeEach((to, from, next) => {
  console.log(to.path)
  if (to.path === '/login') {
    sessionStorage.removeItem(sessionStorage.getItem('user'))
    console.log('进入到登录页面')
  }
  let user = sessionStorage.getItem('user')
  if (!user && to.meta.requireAuth) {
    /**
     * 如果该页面需要验证，且用户没有登录
     */
    console.log('未登录')
    next({path: '/login'})
  } else {
    console.log('继续')
    next()
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// })

/* eslint-disable no-new */
new Vue({
  // el: '#app',
  router,
  // components: { App },
  // template: '<App/>'
  render: h => h(App)
}).$mount('#app')
