import { mount, Wrapper, TransitionStub } from '@vue/test-utils'
import Vue from 'vue'
import BlockExpand from '@/components/animations/BlockExpand.vue'

describe('BlockExpand.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(BlockExpand, {
      slots: { default: '<div><div id="test">test</div></div>' },
      propsData: {
        isExpanded: false
      }
    })
  })

  it('It animates the element', (done) => {
    expect(wrapper.classes('open')).toBeFalsy()
    wrapper.setProps({ isExpanded: true })
    expect(wrapper.classes('open')).toBeTruthy()
    wrapper.setProps({ isExpanded: false })
    expect(wrapper.classes('open')).toBeFalsy()
    setTimeout(function () {
      // wait for all events to be done
      done()
    }, 100)
  })
})
