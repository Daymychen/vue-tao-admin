import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import Home from '@/pages/home/Home.vue'
import Console from '@/pages/dashboard/Console'
import setting from '@/config/setting'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false, easing: 'ease', speed: 500 })
Vue.use(Router)

// 不需要权限的路由
export const routes = [
  {
    path: '/',
    redirect: '/dashboard/console'
  },{
    path: '/dashboard',
    component: Home,
    meta: {
      title: '监控中心'
    },
    children: [
      {
        path: 'console',
        component: Console,
        meta: {
          title: '工作台'
        }
      }
    ]
  },{
    path: '/login',
    component: () => import('@/pages/login/Login'),
    meta: {
      title: '登录',
      newPage: true
    }
  },{
    path: '/exception',
    component: Home,
    meta: {
      title: '异常页面'
    },
    children: [
      {
        path: '403',
        component: () => import('@/pages/exception/403'),
        meta: {
          title: '403'
        }
      },
      {
        path: '404',
        component: () => import('@/pages/exception/404'),
        meta: {
          title: '404'
        }
      },
      {
        path: '500',
        component: () => import('@/pages/exception/500'),
        meta: {
          title: '500'
        }
      }
    ]
  }
]

const router = new Router({
  routes
})

// 需要权限的路由
export const allowRouters = [
  {
    path: '/article',
    component: Home,
    meta: {
      title: '文章管理'
    },
    children: [
      {
        path: 'article-publish',
        component: () => import('@/pages/article/ArticlePublish'),
        meta: {
          title: '文章发布'
        }
      },
      {
        path: 'article-edit',
        component: () => import('@/pages/article/ArticleEdit'),
        meta: {
          title: '文章编辑'
        }
      },
      {
        path: 'article-list',
        component: () => import('@/pages/article/ArticleList'),
        meta: {
          title: '文章列表'
        }
      },
      {
        path: 'classify',
        component: () => import('@/pages/article/Classify'),
        meta: {
          title: '文章分类'
        }
      },
    ]
  },{
    path: '/message',
    component: Home,
    meta: {
      title: '消息中心'
    },
    children: [
      {
        path: 'message',
        component: () => import('@/pages/message/Message'),
        meta: {
          title: '系统消息'
        }
      }
    ]
  },{
    path: '/system',
    component: Home,
    meta: {
      title: '系统设置'
    },
    children: [
      {
        path: 'setting',
        component: () => import('@/pages/system/Setting'),
        meta: {
          title: '系统设置'
        }
      },
      {
        path: 'log',
        component: () => import('@/pages/system/Log'),
        meta: {
          title: '操作日志'
        }
      }
    ]
  },{
    path: '/safeguard',
    component: Home,
    meta: {
      title: '运维管理'
    },
    children: [
      {
        path: 'server',
        component: () => import('@/pages/safeguard/server'),
        meta: {
          title: '服务器管理'
        }
      },{
        path: 'database',
        component: () => import('@/pages/safeguard/database'),
        meta: {
          title: '数据库管理'
        }
      }
    ]
  },{
    path: '/plan',
    component: Home,
    meta: {
      title: '计划'
    },
    children: [
      {
        path: 'year-plan',
        component: () => import('@/pages/plan/YearPlan'),
        meta: {
          title: '年度计划'
        }
      }
    ]
  },{
    path: '/user',
    component: Home,
    meta: {
      title: '用户管理'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/pages/user/User'),
        meta: {
          title: '个人中心'
        }
      },
      {
        path: 'account',
        component: () => import('@/pages/user/Account'),
        meta: {
          title: '账号管理'
        }
      },
      {
        path: 'department',
        component: () => import('@/pages/user/Department'),
        meta: {
          title: '部门管理'
        }
      },
      {
        path: 'role',
        component: () => import('@/pages/user/Role'),
        meta: {
          title: '角色权限'
        }
      }
    ]
  },{
    path: '/menu',
    component: Home,
    meta: {
      title: '菜单管理'
    },
    children: [
      {
        path: 'menu',
        component: () => import('@/pages/menu/menu'),
        meta: {
          title: '菜单权限'
        }
      },
      {
        path: 'api',
        component: () => import('@/pages/menu/api'),
        meta: {
          title: 'API管理'
        }
      },
      {
        path: 'operation',
        component: () => import('@/pages/menu/operation'),
        meta: {
          title: '操作历史'
        }
      }
    ]
  },{
    path: '/widget',
    component: Home,
    meta: {
      title: '组件中心'
    },
    children: [
      {
        path: 'excel',
        component: () => import('@/pages/widget/excel'),
        meta: {
          title: 'Excel'
        }
      },
      {
        path: 'icon',
        component: () => import('@/pages/widget/icon'),
        meta: {
          title: 'Icon'
        }
      }
    ]
  }
]

export const allRoutes = routes.concat(allowRouters);

router.beforeEach((to, from, next) => {
  let isLogin = false
  let { meta, matched } = to
  let { title, title_en, newPage, keepAlive } = meta
  let { showNprogress } = store.state.setting.setting
  let sys = JSON.parse(localStorage.getItem("sys"))

  if(showNprogress) {
    NProgress.start()
  }

  if(sys) {
    isLogin = sys.user.isLogin
  }

  to.params.keepAlive = keepAlive

  if(!isLogin && to.path !== '/login') {
    next('/login')
    return
  }else {
    let { menuList } = store.state.menu

    if(menuList.length > 0) { // 菜单数据加载成功
      if(!matched.length) {   // 打开的页面不存在
        router.push('/exception/404')
        return
      }
    }
    next()
  }

  // 不是标签页
  if (newPage) {
    return
  }

  // 路由添加到标签页
  store.dispatch('worktab/worktabRoute', {
    to: {
      name: to.name ? to.name : '',
      title: (to.meta && title) ? title : '',
      title_en: (to.meta && title_en) ? title_en : '',
      path: to.path,
      params: to.params
    },
    from: {
      name: from.name ? from.name : '',
      title: (from.meta && from.meta.title) ? from.meta.title : '',
      title_en: (from.meta && from.meta.title_en) ? from.meta.title_en : '',
      path: from.path,
      params: to.params
    }
  })

  // 设置网页title
  if(title) {
    document.title = `${title} - ${setting.systemName}`
  }
  return
})

router.afterEach(() => {
  let { showNprogress } = store.state.setting.setting

  if(showNprogress) {
    NProgress.done()
  }
})

export default router