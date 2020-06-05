import { mount, createLocalVue } from '@vue/test-utils'
import App from '@/App.vue'
import Vuex from 'vuex'
import { router } from '@/router'

describe('App.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  const stubs: any = {
    'toast-component': true,
    'cookie-wall': true,
    'footer-component': true,
    'navigation-bar': true,
    'sidebar-view': true,
    'content-view': true
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

  beforeEach(() => {
  })

  it('renders the main view at / route', async (done) => {
    const wrapper = mount(App, {
      localVue,
      router,
      stubs,
      store
    })

    expect(wrapper).toBeDefined()
    router.push('/')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('div #main-view').exists()).toBe(true)
    done()
  })
})
