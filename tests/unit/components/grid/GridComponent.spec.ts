import { shallowMount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import GridComponent from '@/components/grid/GridComponent.vue'

describe('GridComponent.vue', () => {
  const emptyProps = {
    grid: [],
    gridAssessments: [],
    gridVariables: [],
    gridSelections: [],
    isLoading: false
  }

  describe('when created', () => {
    let wrapper: Wrapper<Vue>

    beforeEach(() => {
      window.addEventListener = jest.fn()
      wrapper = shallowMount(GridComponent, {
        propsData: { ...emptyProps }
      })
    })

    it('should render the grid', () => {
      expect(wrapper.find('#grid')).toBeTruthy()
      expect(window.addEventListener).toHaveBeenCalled()
    })
  })

  describe('when destroyed', () => {
    let wrapper: Wrapper<Vue>

    beforeEach(() => {
      window.removeEventListener = jest.fn()
      wrapper = shallowMount(GridComponent, {
        propsData: { ...emptyProps }
      })
    })

    it('should remove the scroll listener', () => {
      wrapper.destroy()
      expect(window.removeEventListener).toHaveBeenCalled()
    })
  })
})
