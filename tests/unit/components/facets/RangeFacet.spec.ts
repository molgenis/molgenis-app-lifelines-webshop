import { shallowMount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import RangeFacet from '@/components/facets/RangeFacet.vue'

describe('RangeFacet.vue', () => {
  
  const minimalProps = {
    facetId: 'my-range-facet',
    label: 'my range facet label',
  }

  describe('initializeSlider', () => {
    it('should initialize the range if none is passed', () => {
      let wrapper = shallowMount(RangeFacet, { propsData: minimalProps})
        // @ts-ignore
        expect(wrapper.vm.sliderValue).toEqual([1900, 2050])
    })

    it('should used the passed range if set', () => {
        const propsData = {
            facetId: 'my-range-facet',
            label: 'my range facet label',
            value: [1990, 2010]
          }
        let wrapper = shallowMount(RangeFacet, { propsData })
          // @ts-ignore
          expect(wrapper.vm.sliderValue).toEqual([1990, 2010])
    })

    it('should use the default if empty range is passed', () => {
        const propsData = {
            facetId: 'my-range-facet',
            label: 'my range facet label',
            value: []
          }
        let wrapper = shallowMount(RangeFacet, { propsData })
          // @ts-ignore
          expect(wrapper.vm.sliderValue).toEqual([1900, 2050])
    })
  })

  describe('handleSliderChange', () => {
    let wrapper: Wrapper<Vue>

    beforeEach(() => {
      wrapper = shallowMount(RangeFacet, { propsData: minimalProps})
    })

    it('should emit a input event passing a clone of the new data', () => {
      // @ts-ignore
      wrapper.vm.handleSliderChange(['1980', '2019'])
      expect(wrapper.emitted().input[0][0]).toEqual([1980, 2019])
    })
  })

  describe('handleFromChange', () => {
    let wrapper: Wrapper<Vue>

    beforeEach(() => {
        wrapper = shallowMount(RangeFacet, { propsData: minimalProps})
    })

    it('should update the from value and emit the new range', () => {
      const event = {
        currentTarget: {
            value: '2011'
        }
      }
      // @ts-ignore
      wrapper.vm.handleFromChange(event)
      expect(wrapper.emitted().input[0][0]).toEqual([2011, 2050])
    })
  })

  describe('handleUntilChange', () => {
    let wrapper: Wrapper<Vue>

    beforeEach(() => {
        wrapper = shallowMount(RangeFacet, { propsData: minimalProps})
    })

    it('should update the until value and emit the new range', () => {
      const event = {
        currentTarget: {
            value: '2019'
        }
      }
      // @ts-ignore
      wrapper.vm.handleUntilChange(event)
      expect(wrapper.emitted().input[0][0]).toEqual([1900, 2019])
    })
  })
})