import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useChampionsStore } from './champions'

describe('useChampionsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    window.electronAPI = {
      getCache: vi.fn().mockResolvedValue(null),
      setCache: vi.fn().mockResolvedValue(undefined),
    }
  })

  it('filters champions by search query (case-insensitive)', () => {
    const store = useChampionsStore()
    store.champions = [
      { id: 'Aatrox', name: 'Aatrox' },
      { id: 'Ahri', name: 'Ahri' },
      { id: 'Lux', name: 'Lux' },
    ]

    store.searchQuery = 'aH'

    expect(store.filteredChampions).toEqual([{ id: 'Ahri', name: 'Ahri' }])
  })

  it('uses cache when available and skips network fetch', async () => {
    const store = useChampionsStore()
    const cached = {
      version: '14.1.1',
      champions: [{ id: 'Garen', name: 'Garen' }],
    }
    window.electronAPI.getCache.mockResolvedValue(cached)
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    await store.fetchChampions()

    expect(store.version).toBe('14.1.1')
    expect(store.champions).toEqual(cached.champions)
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(window.electronAPI.setCache).not.toHaveBeenCalled()
    expect(store.isLoading).toBe(false)
  })

  it('fetches latest version and champion list then caches result', async () => {
    const store = useChampionsStore()
    const mockFetch = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ json: async () => ['14.2.1'] })
      .mockResolvedValueOnce({
        json: async () => ({
          data: {
            Ashe: { id: 'Ashe', name: 'Ashe' },
            Lux: { id: 'Lux', name: 'Lux' },
          },
        }),
      })

    await store.fetchChampions()

    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      'https://ddragon.leagueoflegends.com/api/versions.json'
    )
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      'https://ddragon.leagueoflegends.com/cdn/14.2.1/data/en_US/champion.json'
    )
    expect(store.version).toBe('14.2.1')
    expect(store.champions).toHaveLength(2)
    expect(window.electronAPI.setCache).toHaveBeenCalledWith({
      version: '14.2.1',
      champions: [
        { id: 'Ashe', name: 'Ashe' },
        { id: 'Lux', name: 'Lux' },
      ],
    })
    expect(store.error).toBe(null)
    expect(store.isLoading).toBe(false)
  })

  it('sets error when fetch fails and always stops loading', async () => {
    const store = useChampionsStore()
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'))

    await store.fetchChampions()

    expect(store.error).toBe('network down')
    expect(store.isLoading).toBe(false)
  })
})
