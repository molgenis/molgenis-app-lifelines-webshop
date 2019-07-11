import SearchComponent from '@/components/search/SearchComponent.vue'
import Vue from 'vue'
import { shallowMount, Wrapper } from '@vue/test-utils'

describe('Search Component', () => {
  let wrapper: Wrapper<Vue>

  describe('when no props are passed', () => {
    beforeEach(() => {
      wrapper = shallowMount(SearchComponent)
    })

    it('should render a search input', () => {
      expect(wrapper.find('input')).toBeTruthy()
    })
  })

  describe('when search prop is passed', () => {
    beforeEach(() => {
      wrapper = shallowMount(SearchComponent, { propsData: {
        value: 'testing'
      } })
    })

    it('should render the passed search prop as search value', () => {
      // @ts-ignore
      expect(wrapper.find('input').element.value).toEqual('testing')
    })
  })

  describe('when a search value is entered', () => {
    beforeEach(() => {
      wrapper = shallowMount(SearchComponent)
      wrapper.find('input').setValue('dem')
    })

    it('should emit a search val changed event', (done) => {
      setTimeout(() => {
        expect(wrapper.emitted().seachChanged[0][0]).toEqual('dem')
        done()
      }, 300)
    })
  })
})
