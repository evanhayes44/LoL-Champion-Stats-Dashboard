import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

const fetchChampionsSpy = vi.fn()

vi.mock('./stores/champions', () => ({
  useChampionsStore: () => ({
    fetchChampions: fetchChampionsSpy,
  }),
}))

describe('App', () => {
  it('renders header and fetches champions on mount', () => {
    fetchChampionsSpy.mockReset()

    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
          RouterView: {
            template: '<div class="router-view-stub" />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Champion Stats')
    expect(fetchChampionsSpy).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.router-view-stub').exists()).toBe(true)
  })
})
