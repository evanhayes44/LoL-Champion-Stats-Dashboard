import { describe, beforeEach, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ChampionCard from './ChampionCard.vue'
import { useChampionsStore } from '@/stores/champions'

const pushSpy = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushSpy,
  }),
}))

describe('ChampionCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    pushSpy.mockReset()
    const store = useChampionsStore()
    store.version = '14.3.1'
  })

  it('renders champion identity and tags', () => {
    const wrapper = mount(ChampionCard, {
      props: {
        champion: {
          id: 'Ahri',
          name: 'Ahri',
          title: 'the Nine-Tailed Fox',
          tags: ['Mage', 'Assassin'],
        },
      },
    })

    expect(wrapper.text()).toContain('Ahri')
    expect(wrapper.text()).toContain('the Nine-Tailed Fox')
    expect(wrapper.text()).toContain('Mage')
    expect(wrapper.text()).toContain('Assassin')

    const img = wrapper.get('img')
    expect(img.attributes('src')).toContain('/cdn/14.3.1/img/champion/Ahri.png')
    expect(img.attributes('alt')).toBe('Ahri')
  })

  it('navigates to champion route on click', async () => {
    const wrapper = mount(ChampionCard, {
      props: {
        champion: {
          id: 'Ashe',
          name: 'Ashe',
          title: 'the Frost Archer',
          tags: ['Marksman', 'Support'],
        },
      },
    })

    await wrapper.get('.champion-card').trigger('click')

    expect(pushSpy).toHaveBeenCalledWith({
      name: 'champion',
      params: { id: 'Ashe' },
    })
  })
})
