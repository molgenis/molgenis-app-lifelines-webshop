import { shallowMount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import GridInfoDialog from '@/components/grid/GridInfoDialog.vue'

let basicModel = { data: { name: 'variable_name', options: [] } }

describe('GridInfoDialog', () => {
  let wrapper: any // should be Wrapper<Vue>

  it(`should set class overflow-hidden on <HTML> on create, and remove it on destroy`, () => {
    expect(document.getElementsByTagName('html')[0].classList).not.toContain('overflow-hidden')
    wrapper = shallowMount(GridInfoDialog, { propsData: basicModel })
    expect(document.getElementsByTagName('html')[0].classList).toContain('overflow-hidden')
    wrapper.destroy()
    expect(document.getElementsByTagName('html')[0].classList).not.toContain('overflow-hidden')
  })

  it('should emit "close" on call to onClickOutside ', () => {
    wrapper = shallowMount(GridInfoDialog, { propsData: basicModel })
    expect(wrapper.emitted()).toEqual({})
    wrapper.vm.onClickOutside()
    expect(wrapper.emitted().close).toBeDefined()
  })

  it('should use name if label is empty', () => {
    wrapper = shallowMount(GridInfoDialog, { propsData: basicModel })
    expect(wrapper.find('.pr-4').text()).toBe(basicModel.data.name)
  })

  it('should show label and name if label is specified', () => {
    let dataModel = { data: { name: 'variable_name', label: 'myLabel', options: [] } }
    wrapper = shallowMount(GridInfoDialog, { propsData: dataModel })
    expect(wrapper.find('.pr-4').text()).toContain(dataModel.data.label)
    expect(wrapper.find('.pr-4').text()).toContain(dataModel.data.name)
  })
})
