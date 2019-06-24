import { shallowMount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import FacetContainer from '@/components/facets/FacetContainer.vue'

describe('FacetContainer.vue', () => {
  describe('handleFacetToggle', () => {
    it('should emit the facetToggle passing on the current state', () => {
      let wrapper = shallowMount(FacetContainer, {
        stubs: ['font-awesome-icon'],
        propsData: {
          facetId: 'my-facet',
          label: 'label yo',
          collapsable: true,
          collapsed: false
        }
      })
      // @ts-ignore
      wrapper.vm.handleFacetToggle()
      expect(wrapper.emitted().facetToggle[0][0]).toEqual({ facetId: 'my-facet', collapsed: false })
    })

    it('should short cicuit if not collapsable', () => {
      let wrapper = shallowMount(FacetContainer, {
        stubs: ['font-awesome-icon'],
        propsData: {
          facetId: 'my-facet',
          label: 'label yo',
          collapsable: false,
          collapsed: false
        }
      })
      // @ts-ignore
      wrapper.vm.handleFacetToggle()
      expect(wrapper.emitted()).toEqual({})
    })
  })
})
