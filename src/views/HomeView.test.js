import { describe, beforeEach, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HomeView from './HomeView.vue'
import { useChampionsStore } from '@/stores/champions'

describe('HomeView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const store = useChampionsStore()
    store.champions = [
      { id: 'Aatrox', name: 'Aatrox', title: 'the Darkin Blade', tags: ['Fighter'] },
      { id: 'Ahri', name: 'Ahri', title: 'the Nine-Tailed Fox', tags: ['Mage'] },
    ]
    store.searchQuery = ''
    store.isLoading = false
    store.error = null
  })

  const global = {
    stubs: {
      ChampionCard: {
        props: ['champion'],
        template: '<div class="champion-card-stub">{{ champion.name }}</div>',
      },
    },
  }

  it('shows loading state', () => {
    const store = useChampionsStore()
    store.isLoading = true

    const wrapper = mount(HomeView, { global })

    expect(wrapper.text()).toContain('Loading champions...')
  })

  it('shows error state', () => {
    const store = useChampionsStore()
    store.error = 'request failed'

    const wrapper = mount(HomeView, { global })

    expect(wrapper.text()).toContain('request failed')
  })

  it('updates search query and renders filtered champions', async () => {
    const wrapper = mount(HomeView, { global })
    const input = wrapper.get('input')

    await input.setValue('ah')

    const cards = wrapper.findAll('.champion-card-stub')
    expect(cards).toHaveLength(1)
    expect(cards[0].text()).toBe('Ahri')
  })
})
