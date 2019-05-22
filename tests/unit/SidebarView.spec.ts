import { shallowMount } from '@vue/test-utils'
import SidebarView from '@/views/SidebarView.vue'
import Vue from 'vue'

Vue.filter('i18n', (value: string) => value) // Add dummy filter for i18n

describe('SidebarView.vue', () => {
  it('Renders the sidebar', () => {
    const wrapper = shallowMount(SidebarView)

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find('#Sidebar-view').exists()).toBeTruthy()
  })
})
