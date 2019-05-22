import { shallowMount } from '@vue/test-utils'
import ContentView from '@/views/ContentView.vue'
import Vue from 'vue'

Vue.filter('i18n', (value: string) => value) // Add dummy filter for i18n

describe('ContentView.vue', () => {
  it('Renders the content', () => {
    const wrapper = shallowMount(ContentView)

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find('#Content-view').exists()).toBeTruthy()
  })
})
