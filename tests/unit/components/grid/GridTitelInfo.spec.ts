import { shallowMount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import GridTitelInfo from '@/components/grid/GridTitelInfo.vue'

describe('GridTitelInfo', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    wrapper = shallowMount(GridTitelInfo, {
      propsData: { info: { name: 'name' } }
    })
  })

  it('should render the label (if it exists) else it will fall back to name', () => {
    expect(wrapper.find('.variable-title').text()).toBe('name')
    wrapper.setProps({ info: { name: 'name', label: 'label' } })
    expect(wrapper.find('.variable-title').text()).toBe('label')
  })
})
