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

  it('It animates the element', () => {
    expect(wrapper.classes('expanded')).toBeFalsy()
    wrapper.vm.expand()
    expect(wrapper.classes('expanded')).toBeTruthy()
    wrapper.vm.collapse()
    expect(wrapper.classes('expanded')).toBeFalsy()
  })
})
