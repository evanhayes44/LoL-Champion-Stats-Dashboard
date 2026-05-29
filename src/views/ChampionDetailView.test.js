import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ChampionDetailView from './ChampionDetailView.vue'
import { useChampionsStore } from '@/stores/champions'

const backSpy = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: 'Ashe' },
  }),
  useRouter: () => ({
    back: backSpy,
  }),
}))

describe('ChampionDetailView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const store = useChampionsStore()
    store.version = '14.4.1'
    backSpy.mockReset()
    vi.restoreAllMocks()
  })

  it('shows loading state before fetch resolves', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))

    const wrapper = mount(ChampionDetailView)

    expect(wrapper.text()).toContain('Loading...')
  })

  it('renders champion details and formatted ability description', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({
        data: {
          Ashe: {
            id: 'Ashe',
            name: 'Ashe',
            title: 'the Frost Archer',
            lore: 'A legendary Freljordian archer.',
            stats: { hp: 640, attackdamage: 59 },
            passive: {
              name: 'Frost Shot',
              description: '<magicDamage>Magic</magicDamage> and <physicalDamage>Physical</physicalDamage>',
            },
            spells: [
              {
                id: 'Volley',
                name: 'Volley',
                description: '<trueDamage>True</trueDamage> and <status>Slow</status>',
              },
            ],
          },
        },
      }),
    })

    const wrapper = mount(ChampionDetailView)
    await flushPromises()

    expect(wrapper.text()).toContain('Ashe')
    expect(wrapper.text()).toContain('the Frost Archer')
    expect(wrapper.text()).toContain('A legendary Freljordian archer.')
    expect(wrapper.text()).toContain('HP')
    expect(wrapper.text()).toContain('Attack Damage (AD)')
    expect(wrapper.find('.magic-damage').exists()).toBe(true)
    expect(wrapper.find('.physical-damage').exists()).toBe(true)
    expect(wrapper.find('.true-damage').exists()).toBe(true)
    expect(wrapper.find('.status-effect').exists()).toBe(true)

    await wrapper.get('.back-button').trigger('click')
    expect(backSpy).toHaveBeenCalled()
  })

  it('shows error message when fetch fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('detail request failed'))

    const wrapper = mount(ChampionDetailView)
    await flushPromises()

    expect(wrapper.text()).toContain('detail request failed')
  })
})
