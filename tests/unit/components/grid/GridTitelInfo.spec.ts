import { shallowMount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import GridTitelInfo from '@/components/grid/GridTitelInfo.vue'

describe('GridTitelInfo', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    wrapper = shallowMount(GridTitelInfo, {
      propsData: { name: 'name' },
      stubs: ['b-popover']
    })
  })

  it('should render the label (if it exists) else it will fall back to name', () => {
    expect(wrapper.find('.variable-title').text()).toBe('name')
    wrapper.setProps({ name: 'name', label: 'label' })
    expect(wrapper.find('.variable-title').text()).toBe('label')
  })
})
