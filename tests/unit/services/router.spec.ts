import { anonymousNavigationGuard } from '@/router'
import store from '@/store/store'

jest.mock('@/store/store', () => ({
  getters: {
    isSignedIn: false
  }
}))

describe('router', () => {
  describe('anonymous navigation', () => {
    describe('when not signed in', () => {
      beforeEach(() => { store.getters.isSignedIn = false })

      it('allows navigation to shop', () => {
        const next = jest.fn()
        anonymousNavigationGuard({ name: 'shop' } as any, null as any, next)
        expect(next).toHaveBeenCalled()
      })

      it('does not allow navigation to other routes', () => {
        const next = jest.fn()
        anonymousNavigationGuard({ name: 'other' } as any, null as any, next)
        expect(next).not.toHaveBeenCalled()
      })
    })
  })

  describe('when signed in', () => {
    beforeEach(() => { store.getters.isSignedIn = true })

    it('allows navigation to shop', () => {
      const next = jest.fn()
      anonymousNavigationGuard({ name: 'shop' } as any, null as any, next)
      expect(next).toHaveBeenCalled()
    })

    it('allows navigation to other routes', () => {
      const next = jest.fn()
      anonymousNavigationGuard({ name: 'other' } as any, null as any, next)
      expect(next).toHaveBeenCalled()
    })
  })
})
