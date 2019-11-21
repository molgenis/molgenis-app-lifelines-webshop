import { shallowMount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import GridComponent from '@/components/grid/GridComponent.vue'

describe('GridComponent.vue', () => {
  const emptyProps = {
    grid: null,
    gridAssessments: [],
    gridVariables: null,
    gridSelections: null,
    isLoading: false,
    isSignedIn: true
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

    it('should change table header on scroll', () => {
      const vm:any = wrapper.vm
      vm.getTableTop = jest.fn().mockReturnValue(10)
      vm.getHeaderHeight = jest.fn().mockReturnValue(20)
      expect(vm.$data.stickyTableHeader).toBeFalsy()
      vm.scroll()
      expect(vm.$data.stickyTableHeader).toBeTruthy()
      vm.getTableTop = jest.fn().mockReturnValue(80)
      vm.getHeaderHeight = jest.fn().mockReturnValue(10)
      vm.scroll()
      expect(vm.$data.stickyTableHeader).toBeFalsy()
    })
  })

  describe('when not signed in ', () => {
    let wrapper: Wrapper<Vue>
    let props

    beforeEach(() => {
      props = {
        grid: [[1, 2], [3, 4]],
        gridAssessments: [],
        gridVariables: [{
          name: 'a',
          id: 101
        },
        {
          name: 'b',
          id: 102
        }],
        gridSelections: [[false, false], [false, false]],
        isLoading: false,
        isSignedIn: false
      }
      wrapper = shallowMount(GridComponent, {
        propsData: { ...props }
      })
    })

    it('should show a disabled select-all toggle', () => {
      expect(wrapper.find('.t-btn-all-toggle').attributes('disabled')).toBeTruthy()
    })
  })

  describe('On user interaction', () => {
    let wrapper: Wrapper<Vue>
    let props

    beforeEach(() => {
      props = {
        grid: [[1, 2], [3, 4]],
        gridAssessments: [{ id: 'c1' }, { id: 'c2' }],
        gridVariables: [{
          name: 'a',
          id: 101
        }, {
          name: 'b',
          id: 102
        }],
        gridSelections: [[false, false], [false, false]],
        isLoading: false,
        isSignedIn: true
      }
      wrapper = shallowMount(GridComponent, {
        propsData: { ...props }
      })
    })

    it('.t-btn-all-toggle should trigger gridAllToggle event', () => {
      wrapper.find('.t-btn-all-toggle').trigger('click')
      expect(wrapper.emitted()).toEqual({ gridAllToggle: [ [] ] })
    })

    it('.t-btn-row-toggle should trigger gridRowToggle event', () => {
      wrapper.find('.t-btn-row-toggle').trigger('click')
      expect(wrapper.emitted()).toEqual({ gridRowToggle: [ [101] ] })
    })

    it('.t-btn-column-toggle should trigger gridColumnToggle event', () => {
      wrapper.find('.t-btn-column-toggle').trigger('click')
      expect(wrapper.emitted()).toEqual({ gridColumnToggle: [ ['c1'] ] })
    })

    it('.t-btn-cell-toggle should trigger gridCellToggle event', () => {
      wrapper.find('.t-btn-cell-toggle').trigger('click')
      expect(wrapper.emitted()).toEqual({ gridCellToggle: [ [0, 0] ] })
    })
  })
})
