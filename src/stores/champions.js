import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'

export const useChampionsStore = defineStore('champions', () => {
    const champions = ref([])
    const searchQuery = ref('')
    const tagFilter = ref('')

    const isLoading = ref(false)
    const error = ref(null)
    const version = ref('')

    const filteredChampions = computed(() => {
        return champions.value.filter(c => {
            const matchesSearch = !searchQuery.value ||
                c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
            const matchesTag = !tagFilter.value ||
                c.tags.includes(tagFilter.value)
            return matchesSearch && matchesTag
        })
    })

    async function fetchChampions() {
        isLoading.value = true
        error.value = null

        try {
            const cached = await window.electronAPI.getCache()
            if (cached) {
                champions.value = cached.champions
                version.value = cached.version
                return
            }

            const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
            const versions = await versionRes.json()
            version.value = versions[0] // latest version

            const champRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version.value}/data/en_US/champion.json`)
            const champData = await champRes.json()
            champions.value = Object.values(champData.data)

            await window.electronAPI.setCache({
                version: version.value,
                champions: toRaw(champions.value)
            })
        }
        catch (err) {
            error.value = err.message
        }
        finally {
            isLoading.value = false
        }
    }

    return {
        champions,
        searchQuery,
        tagFilter,
        isLoading,
        error,
        version,
        filteredChampions,
        fetchChampions
    }
})

