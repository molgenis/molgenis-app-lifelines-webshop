import { mount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import CollapsibleTree from '@/components/tree/CollapsibleTree.vue'

describe('CollapsibleTree.vue', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    wrapper = mount(CollapsibleTree, {
      stubs: {
        'font-awesome-icon': '<div/>'
      },
      propsData: {
        opensection: '',
        selection: -1,
        structure: [
          {
            name: 'test-parent',
            children: [
              {
                id: 10,
                name: 'test-child'
              }
            ]
          }
        ]
      }
    })
  })

  it('should render a list with a test-parent and test-child', () => {
    wrapper.find('[title="test-parent"]').trigger('click')
    const items = wrapper.findAll('[title]')
    expect(items.at(0).text()).toEqual('test-parent')
    expect(items.at(1).text()).toEqual('test-child')
  })

  it('can open a section', () => {
    wrapper.find('[title="test-parent"]').trigger('click')
    expect(wrapper.emitted().updateopensection).toEqual([['test-parent']])
  })

  it('can select child', () => {
    wrapper.find('[title="test-parent"]').trigger('click')
    wrapper.find('[title="test-child"]').trigger('click')
    expect(wrapper.emitted().updateselection).toEqual([[10]])
  })

  it('will close by selecting the same section', () => {
    wrapper.setProps({ opensection: 'test-parent' })
    wrapper.find('[title="test-parent"]').trigger('click')
    expect(wrapper.emitted().updateopensection).toEqual([['']])
  })
})
