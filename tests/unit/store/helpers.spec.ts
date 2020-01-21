import { getErrorMessage, tryAction, toCart, fromCart } from '@/store/helpers'
import Vue from 'vue'
import emptyState from '../fixtures/state'
import { CartFilter, Cart } from '@/types/Cart'
import Filter from '@/types/Filter'

describe('store', () => {
  describe('helpers', () => {
    describe('getErrorMessage', () => {
      it('converts error response with code', () => {
        const errorResponse = {
          errors: [{
            code: 'D01',
            message: 'Errors in your data.'
          }]
        }
        expect(getErrorMessage(errorResponse)).toBe('Errors in your data. (D01)')
      })

      it('converts error response without code', () => {
        const errorResponse = {
          errors: [{
            message: 'Errors in your data.'
          }]
        }
        expect(getErrorMessage(errorResponse)).toBe('Errors in your data.')
      })

      it('converts error response with status code', () => {
        expect(getErrorMessage({
          status: 401
        })).toBe('Error status: 401')
      })

      it('converts error response with status code and text', () => {
        expect(getErrorMessage({
          status: 401,
          statusText: 'The request was rejected because the URL was not normalized.'
        })).toBe('The request was rejected because the URL was not normalized. (401)')
      })

      it('returns message from Error', () => {
        expect(getErrorMessage(new Error('Some error'))).toBe('Some error')
      })
    })

    describe('tryAction', () => {
      it('returns successful result', () => {
        const result = Promise.resolve('succes')
        expect(tryAction(() => result)()).toEqual(result)
      })

      it('commits error message toast for failed result', (done) => {
        const action = () => Promise.reject(new Error('Something went wrong'))
        const commit = jest.fn()
        const context = { commit }
        const toast = { message: 'Something went wrong', textType: 'light', title: 'Error', type: 'danger' }
        tryAction(action)(context)
        Vue.nextTick(() => {
          expect(commit).toHaveBeenCalledWith('setToast', toast)
          done()
        })
      })
    })

    const facetFilter: Filter = {
      ageGroupAt1A: ['1'],
      ageGroupAt2A: ['2', '3'],
      ageGroupAt3A: ['3'],
      gender: ['1'],
      subcohort: ['gwas'],
      yearOfBirthRange: [1960, 1970]
    }

    const cartFilter: CartFilter = {
      ageGroupAt1A: ['0-17'],
      ageGroupAt2A: ['18-65', '65+'],
      ageGroupAt3A: ['65+'],
      gender: ['Male'],
      subcohort: ['GWAS'],
      yearOfBirthRange: [1960, 1970]
    }

    describe('toCart', () => {
      it('converts empty state to empty cart', () => {
        expect(toCart(emptyState)).toEqual({ filters: {}, selection: [] })
      })
      it('converts facetFilter to cart filter', () => {
        expect(toCart({
          ...emptyState,
          facetFilter
        })).toEqual({
          filters: cartFilter,
          selection: []
        })
      })
      it('complains when it cannot find a filter option', () =>
        expect(() =>
          toCart({
            ...emptyState,
            facetFilter: {
              ...emptyState.facetFilter,
              ageGroupAt1A: ['123']
            }
          })).toThrowError('Cannot find ageGroupAt1A facet option with id 123')
      )
      it('converts gridSelection to cart selections', () => {
        expect(toCart({
          ...emptyState,
          variables: {
            1: { id: 1, name: 'VAR1', label: 'variable 1', subsections: [1] },
            2: { id: 2, name: 'VAR2', label: 'variable 2', subsections: [1] }
          },
          assessments: {
            1: { id: 1, name: '1A' },
            2: { id: 2, name: '1B' }
          },
          gridSelection: {
            1: [1, 2],
            2: [1]
          }
        })).toEqual({
          filters: {},
          selection: [{
            assessment: '1A',
            variables: ['VAR1', 'VAR2']
          }, {
            assessment: '1B',
            variables: ['VAR1']
          }]
        })
      })
    })

    describe('fromCart', () => {
      it('converts empty cart', () => {
        expect(fromCart({ filters: {}, selection: [] }, emptyState))
          .toEqual({
            facetFilter: emptyState.facetFilter,
            gridSelection: {}
          })
      })
      it('converts cart selection to grid selection', () => {
        expect(fromCart({
          filters: {},
          selection: [{
            assessment: '1A',
            variables: ['VAR1', 'VAR2']
          }, {
            assessment: '1B',
            variables: ['VAR1']
          }]
        }, {
          ...emptyState,
          variables: {
            1: { id: 1, name: 'VAR1', label: 'variable 1', subsections: [1] },
            2: { id: 2, name: 'VAR2', label: 'variable 2', subsections: [1] }
          },
          assessments: {
            1: { id: 1, name: '1A' },
            2: { id: 2, name: '1B' }
          }
        })).toEqual({
          facetFilter: emptyState.facetFilter,
          gridSelection: {
            1: [1, 2],
            2: [1]
          }
        })
      })
      it('converts cart filter to facetFilter', () => {
        expect(fromCart({ filters: cartFilter, selection: [] }, emptyState))
          .toEqual({ facetFilter, gridSelection: {} })
      })
      it('complains when it cannot find a filter option', () =>
        expect(() =>
          fromCart({ filters: { ageGroupAt1A: ['blah'] }, selection: [] }, emptyState)
        ).toThrowError('Cannot find ageGroupAt1A facet option with text blah')
      )

      it('should throw an error if the cart selection assessments are not found in the application state', () => {
        const cart: Cart = {
          selection: [{
            assessment: 'assessment1',
            variables: []
          }],
          filters: cartFilter
        }
        expect(() => (fromCart(cart, emptyState))).toThrowError('Cannot find assessment with name assessment1.')
      })

      it('should throw an error if the cart selection variables are non found in the application state', () => {
        const cart: Cart = {
          selection: [{
            assessment: 'assessment1',
            variables: ['variable1']
          }],
          filters: cartFilter
        }
        const assessments = {
          1: { id: 1, name: 'assessment1' }
        }
        expect(() => (fromCart(cart, { ...emptyState, assessments }))).toThrowError('Cannot find variable with name variable1.')
      })
    })
  })
})
