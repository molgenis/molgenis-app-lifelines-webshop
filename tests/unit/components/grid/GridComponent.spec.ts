import { shallowMount, Wrapper, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import GridComponent from '@/components/grid/GridComponent.vue'

const localVue = createLocalVue()

localVue.directive('b-popover', { /* stub */ })

describe('GridComponent.vue', () => {
  const emptyProps = {
    gridAssessments: [],
    gridColumns: [],
    gridRows: null,
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
        localVue,
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
        localVue,
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
      vm.getTableTop = jest.fn().mockReturnValue(140)
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
        gridRows: [[1, 2], [3, 4]],
        gridAssessments: [{ id: 'c1' }, { id: 'c2' }],
        gridColumns: [{ id: 'c1' }, { id: 'c2' }],
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
        localVue,
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
        gridRows: [[1, 2], [3, 4]],
        gridAssessments: [{ id: 'c1' }, { id: 'c2' }],
        gridColumns: [{ id: 'c1' }, { id: 'c2' }],
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
        localVue,
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

  describe('Collapsing variables', () => {
    let wrapper: Wrapper<Vue>
    let props: any

    beforeEach(() => {
      props = {
        gridAssessments: [{ id: 10 }, { id: 11 }, { id: 12 }],
        gridColumns: [{ id: 10 }, { id: 11 }, { id: 12 }],
        gridRows: [[1, 2], [3, 4]],
        gridVariables: [{
          name: 'a',
          id: 101,
          subvariables: [{ id: 102 }, { id: 103 }]
        }, {
          name: 'b',
          id: 102,
          subvariableOf: { id: 101 },
          subvariables: []
        }, {
          name: 'c',
          id: 103,
          subvariableOf: { id: 101 },
          subvariables: []
        }, {
          name: 'd',
          id: 104,
          subvariables: []
        }],
        gridSelections: [[false, false], [false, false]],
        isLoading: false,
        isSignedIn: true
      }

      wrapper = shallowMount(GridComponent, {
        localVue,
        propsData: { ...props }
      })
      wrapper.setProps({
        gridVariables: [...props.gridVariables, { name: 'f', id: 105, subvariables: [] }]
      })
    })

    it('starts with closed collapsible variable-sets', async () => {
      await wrapper.vm.$nextTick()
      // @ts-ignore
      expect(wrapper.vm.openVariableSets).toEqual([101])
    })

    it('can use variableSetIsOpen to find open variables sets', () => {
      // @ts-ignore
      expect(wrapper.vm.variableSetIsOpen(props.gridVariables[0])).toBeTruthy()
      // @ts-ignore
      expect(wrapper.vm.variableSetIsOpen(props.gridVariables[1])).toBeFalsy()
      // @ts-ignore
      wrapper.vm.openVariableSets = []
      // @ts-ignore
      expect(wrapper.vm.variableSetIsOpen(props.gridVariables[0])).toBeFalsy()
    })

    it('can use isVisibleVariable to find visable variables sets', () => {
      // @ts-ignore
      expect(wrapper.vm.openVariableSets).toEqual([101])
      // @ts-ignore
      expect(wrapper.vm.isVisibleVariable(props.gridVariables[0])).toBeTruthy()
      // @ts-ignore
      expect(wrapper.vm.isVisibleVariable(props.gridVariables[1])).toBeFalsy()
      // @ts-ignore
      wrapper.vm.openVariableSets = []
      // @ts-ignore
      expect(wrapper.vm.isVisibleVariable(props.gridVariables[1])).toBeTruthy()
    })

    it('can use variableSetClickHandler to open en close variable sets', () => {
      // @ts-ignore
      expect(wrapper.vm.openVariableSets).toEqual([101])
      // @ts-ignore
      wrapper.vm.variableSetClickHandler(props.gridVariables[0])
      // @ts-ignore
      expect(wrapper.vm.openVariableSets).toEqual([])
      // @ts-ignore
      wrapper.vm.variableSetClickHandler(props.gridVariables[0])
      // @ts-ignore
      expect(wrapper.vm.openVariableSets).toEqual([101])
    })

    it('can use variableSetClass to help with rendering', () => {
      // @ts-ignore
      expect(wrapper.vm.variableSetClass(props.gridVariables[0])).toEqual('closed')
      // @ts-ignore
      wrapper.vm.openVariableSets = []
      // @ts-ignore
      expect(wrapper.vm.variableSetClass(props.gridVariables[0])).toEqual('start')
      // @ts-ignore
      expect(wrapper.vm.variableSetClass(props.gridVariables[1])).toEqual('line')
      // @ts-ignore
      expect(wrapper.vm.variableSetClass(props.gridVariables[2])).toEqual('end')
      // @ts-ignore
      expect(wrapper.vm.variableSetClass(props.gridVariables[3])).toEqual(undefined)
    })
  })

  describe('Building popup data', () => {
    let wrapper:any
    let popoverTitle: string
    let bodyHtml: string

    const propsData = {
      grid: [[1]],
      gridAssessments: [{ id: 10 }],
      gridVariables: [{
        name: 'a',
        id: 101,
        subvariables: [],
        options: [{ label_en: 'my option' }],
        definitionEn: 'enDef',
        definitionNL: 'nlDef'
      }],
      gridSelections: [[false]],
      isLoading: false,
      isSignedIn: true
    }

    beforeEach(() => {
      wrapper = shallowMount(GridComponent, { localVue, propsData })
      popoverTitle = wrapper.vm.popupTitle(0)
      bodyHtml = wrapper.vm.popupBody(0)
    })

    it('set the name as popover title', () => {
      expect(popoverTitle).toEqual('a')
    })

    it('generate the body html', () => {
      const expectedHtml = `
      <div>
        <strong>Description (en):</strong>
        <p>enDef</p>
        <strong>Description (nl):</strong>
        <p>nlDef</p>
        <strong>Categorical values (en):</strong>
        <p><span>my option</span></p>
      </div>`
      expect(bodyHtml).toEqual(expectedHtml)
    })
  })

  describe('setGridHeaderSpacer', () => {
    let wrapper:any

    const propsData = {
      gridRows: [[1]],
      gridColumns: [{ id: 10 }],
      gridVariables: [{
        name: 'a',
        id: 101,
        subvariables: []
      }],
      gridSelections: [[false]],
      isLoading: false,
      isSignedIn: true
    }

    it('should toggle the recalculate spacer when the grid changes', async (done) => {
      wrapper = shallowMount(GridComponent, { localVue, propsData })
      wrapper.setProps({ gridVariables: [{
        name: 'a',
        id: 101,
        subvariables: []
      }] })
      wrapper.setProps({ gridRows: [[101]] })
      wrapper.vm.$nextTick(() => {
        expect(wrapper).toBeDefined()
        // 0px as jest dom has no width
        expect(wrapper.vm.$refs.varspacer.style.width).toEqual('0px')
        done()
      })
    })

    it('should not throw error in case of empty grid', () => {
      const propsData = {
        gridRows: [],
        gridColumns: [],
        gridVariables: [],
        gridSelections: [],
        isLoading: false,
        isSignedIn: true
      }
      wrapper = shallowMount(GridComponent, { localVue, propsData })
      try {
        wrapper.vm.setGridHeaderSpacer()
      } catch (e) {
        // have test fail
        expect(false).toBeTruthy()
      }
      expect(true).toBeTruthy()
    })
  })
})
