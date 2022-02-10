import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '@/store/index';
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页'
    },
    component: () => import('@/views/home.vue'), 
  },
  {
    path: '/expenditureSubmit',
    name: 'expenditureSubmit',
    meta: {
      title: '提交支出信息'
    },
    component: () => import('@/views/expenditureSubmit.vue'), 
  },
  {
    path: '/incomeSubmit',
    name: 'incomeSubmit',
    meta: {
      title: '提交收入信息'
    },
    component: () => import('@/views/incomeSubmit.vue'), 
  },
  {
    path: '/list',
    name: 'list',
    meta: {
      title: '列表'
    },
    component: () => import('@/views/list.vue'), 
  },
  {
    path: '/detial/:id',
    name: 'detial',
    meta: {
      title: '详情'
    },
    component: () => import('@/views/detial.vue'), 
  },
  {
    path: '/analysis',
    name: 'analysis',
    meta: {
      title: '分析'
    },
    component: () => import('@/views/analysis.vue'), 
  }
  
  
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  // base:'/hhzhgd/wechat/',//测试的时候注释掉
  routes
})

export default router
