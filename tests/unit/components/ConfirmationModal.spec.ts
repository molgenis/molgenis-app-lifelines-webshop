import { shallowMount, Wrapper, RouterLinkStub } from '@vue/test-utils'
import Vue from 'vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

describe('ConfirmationModal.vue', () => {
  let wrapper: Wrapper<Vue>

  wrapper = shallowMount(ConfirmationModal, {
    stubs: {
      RouterLink: RouterLinkStub
    },
    propsData: {
      backRoute: '/jest',
      title: 'title'
    },
    slots: {
      body: '<div class="body-slot-exists"/>',
      confirmButton: '<div class="confirmbutton-slot-exists"/>'
    }
  })

  it('should render a basic modal layout', () => {
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.find('.modal-header').exists()).toBe(true)
    expect(wrapper.find('.modal-body').exists()).toBe(true)
    expect(wrapper.find('.modal-footer').exists()).toBe(true)
    expect(wrapper.find('.body-slot-exists').exists()).toBe(true)
    expect(wrapper.find('.confirmbutton-slot-exists').exists()).toBe(true)
  })
})
