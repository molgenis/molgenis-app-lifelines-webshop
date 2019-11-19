import { shallowMount, Wrapper, RouterLinkStub } from '@vue/test-utils'
import Vue from 'vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

describe('ConfirmationModal.vue', () => {
  let wrapper: Wrapper<Vue>

  let clicked = false

  wrapper = shallowMount(ConfirmationModal, {
    stubs: {
      RouterLink: RouterLinkStub
    },
    propsData: {
      backRoute: '/jest',
      confirmButton: 'Delete',
      confirmMethod: function () {
        clicked = true
      }
    },
    slots: {
      default: '<div class="slot-exists"/>'
    }
  })

  it('should render a basic modal layout', () => {
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.find('.modal-header').exists()).toBe(true)
    expect(wrapper.find('.modal-body').exists()).toBe(true)
    expect(wrapper.find('.modal-footer').exists()).toBe(true)
    expect(wrapper.find('.slot-exists').exists()).toBe(true)
  })

  it('handles a confirmation method', () => {
    wrapper.find('.t-btn-confirm').trigger('click')
    expect(clicked).toBe(true)
  })
})
