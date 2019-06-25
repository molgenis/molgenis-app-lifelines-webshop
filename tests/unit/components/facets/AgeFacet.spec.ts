import { shallowMount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import AgeFacet from '@/components/facets/AgeFacet.vue'

describe('AgeFacet.vue', () => {
  const ageAtOptions = [
    { value: 'ageGroupAt1A', text: 'baseline' },
    { value: 'ageGroupAt2A', text: 'second assessment' },
    { value: 'ageGroupAt3A', text: 'third assessment' }
  ]
  const ageGroupOptions = [
    { value: '1', text: '0-17' },
    { value: '2', text: '18-65' },
    { value: '3', text: '65+' }
  ]
  const basicProps = {
    facetId: 'my-age-facet',
    label: 'age facet label',
    ageAtOptions,
    ageGroupOptions,
    value: {}
  }

  describe('data', () => {
    let wrapper: Wrapper<Vue>

    beforeEach(() => {
      wrapper = shallowMount(AgeFacet, { propsData: basicProps })
    })

    it('selectedAgeGroups should be empty array if none are passed', () => {
      // @ts-ignore
      expect(wrapper.vm.selectedAgeGroups).toEqual([])
    })

    it('selectedAgeAt default to "ageGroupAt1A"', () => {
      // @ts-ignore
      expect(wrapper.vm.selectedAgeAt).toEqual('ageGroupAt1A')
    })
  })

  describe('change selected age groups', () => {
    let wrapper: Wrapper<Vue>

    beforeEach(() => {
      wrapper = shallowMount(AgeFacet, { propsData: basicProps })
    })

    it('should result in input event with updated selectedAgeAt object ', () => {
      const expectedPayload = {
        ageGroupAt1A: ['0-17'],
        ageGroupAt2A: [],
        ageGroupAt3A: []
      }
      wrapper.setData({ selectedAgeGroups: ['0-17'] })
      expect(wrapper.emitted().input[0][0]).toEqual(expectedPayload)
    })
  })

  describe('select age-at', () => {
    let wrapper: Wrapper<Vue>

    beforeEach(() => {
      const myProps = {
        facetId: 'my-age-facet',
        label: 'age facet label',
        ageAtOptions,
        ageGroupOptions,
        value: {
          ageGroupAt1A: ['0-17'],
          ageGroupAt2A: [],
          ageGroupAt3A: []
        }
      }
      wrapper = shallowMount(AgeFacet, { propsData: myProps })
    })

    it('should result in input event with updated selectedAgeAt object ', () => {
      const expectedPayload = {
        ageGroupAt1A: [],
        ageGroupAt2A: ['0-17'],
        ageGroupAt3A: []
      }
      wrapper.setData({ selectedAgeAt: 'ageGroupAt2A' })
      expect(wrapper.emitted().input[0][0]).toEqual(expectedPayload)
    })
  })
})
