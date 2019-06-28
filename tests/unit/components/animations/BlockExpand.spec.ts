import { mount, Wrapper, TransitionStub } from '@vue/test-utils'
import Vue from 'vue'
import BlockExpand from '@/components/animations/BlockExpand.vue'

describe('BlockExpand.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(BlockExpand, {
      slots: { default: '<div><div id="test">test</div></div>' },
      propsData: {
        isExpaned: false
      }
    })
  })

  it('It animates the element', (done) => {
    expect(wrapper.classes('expanded')).toBeFalsy()
    wrapper.setProps({ isExpaned: true })
    expect(wrapper.classes('expanded')).toBeTruthy()
    wrapper.setProps({ isExpaned: false })
    expect(wrapper.classes('expanded')).toBeFalsy()
    setTimeout(function () {
      // wait for all events to be done
      done()
    }, 100)
  })
})
