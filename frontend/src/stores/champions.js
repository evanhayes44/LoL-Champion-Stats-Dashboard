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
                (c.tags ?? []).includes(tagFilter.value)
            return matchesSearch && matchesTag
        })
    })

    async function fetchChampions() {
        isLoading.value = true
        error.value = null

        try {
            const versionRes = await fetch('/api/ddragon/api/versions.json')
            if (!versionRes.ok) {
                throw new Error(`Failed to fetch versions (${versionRes.status})`)
            }
            const versions = await versionRes.json()
            const latestVersion = versions[0]
            version.value = latestVersion

            const cached = await window.electronAPI.getCache()
            if (
                cached?.version === latestVersion &&
                Array.isArray(cached.champions) &&
                cached.champions.length
            ) {
                champions.value = cached.champions
                return
            }

            const champRes = await fetch(`/api/ddragon/cdn/${latestVersion}/data/en_US/champion.json`)
            if (!champRes.ok) {
                throw new Error(`Failed to fetch champions (${champRes.status})`)
            }
            const champData = await champRes.json()
            champions.value = Object.values(champData.data)

            await window.electronAPI.setCache({
                version: latestVersion,
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
