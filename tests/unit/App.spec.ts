import { mount, createLocalVue } from '@vue/test-utils'
import App from '@/App.vue'
import Vuex from 'vuex'
import routes from '@/routes'
import VueRouter from 'vue-router'

const router = new VueRouter({ base: process.env.BASE_URL, routes })

describe('App.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  const stubs: any = {
    'toast-component': true,
    'cookie-wall': true,
    'header-component': true,
    'footer-component': true,
    'navigation-bar': true,
    'sidebar-view': true,
    'content-view': true,
    'router-view': true
  }

  const store = new Vuex.Store({
    state: {
      context: {
        context: {
          showCookieWall: false
        }
      },
      gridSelection: {}
    },
    actions: {},
    getters: {
      molgenisMenu: jest.fn(),
      molgenisFooter: jest.fn(),
      isSignedIn: jest.fn()
    },
    mutations: {}
  })

  it('renders the page content', async (done) => {
    const wrapper = mount(App, {
      localVue,
      router,
      stubs,
      store
    })

    expect(wrapper).toBeDefined()
    router.push('/')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('main.mg-page-content').exists()).toBe(true)
    done()
  })
})
