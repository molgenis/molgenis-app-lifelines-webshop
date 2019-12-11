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
        searchTerm: 'testing'
      } })
    })

    it('should render the passed search prop as search value', () => {
      // @ts-ignore
      expect(wrapper.find('input').element.value).toEqual('testing')
    })
  })

  describe('when a search value is entered', () => {
    let wrapper:any
    beforeEach(() => {
      wrapper = shallowMount(SearchComponent)
    })

    describe('and types chars are 3 or more, dem', () => {
      beforeEach(() => wrapper.find('input').setValue('dem'))

      it('should emit a search val changed event with value dem', (done) => {
        setTimeout(() => {
          expect(wrapper.emitted().searchChanged[0][0]).toEqual('dem')
          done()
        }, 300)
      })
    })

    describe('and only a single char is entered, while the previous search was more then 3 chars', () => {
      beforeEach(() => {
        wrapper.setData({ lastSearched: '1234' })
        wrapper.find('input').setValue('d')
      })

      it('should emit a empty search invent, clearing the search', (done) => {
        setTimeout(() => {
          expect(wrapper.emitted().searchChanged[0][0]).toEqual('')
          done()
        }, 300)
      })
    })

    describe('and only a single char is entered, while the previous search was less then 3 chars', () => {
      beforeEach(() => {
        wrapper.setData({ lastSearched: '12' })
        wrapper.find('input').setValue('d')
      })

      it('should emit a empty search invent, clearing the search', (done) => {
        setTimeout(() => {
          console.log(wrapper.emitted())
          expect(wrapper.emitted()).toEqual({})
          done()
        }, 300)
      })
    })
  })
})
