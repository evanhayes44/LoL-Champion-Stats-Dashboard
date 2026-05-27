<script setup>
import { useChampionsStore } from '../stores/champions'
import { storeToRefs } from 'pinia'
import ChampionCard from '@/components/ChampionCard.vue'

const store = useChampionsStore()
const { filteredChampions, isLoading, error, searchQuery } = storeToRefs(store)
</script>

<template>
  <main class="champion-list-view">
    <div class="search-bar">
      <input v-model="searchQuery" type="text" placeholder="Search champions..." />
    </div>

    <div v-if="isLoading" class="status-message">
      Loading champions...
    </div>
    <div v-else-if="error" class="status-message-error">
      {{ error }}
    </div>

    <div v-else class="champion-grid">
      <ChampionCard
        v-for="champion in filteredChampions"
        :key="champion.id"
        :champion="champion"
      />
    </div>
  </main>
</template>

<style scoped>
.champion-list-view {
  padding: 2rem;
  flex: 1;
}

.search-bar {
  margin-bottom: 2rem;
}

.search-bar input {
  width: 100%;
  max-width: 400px;
  padding: 0.6rem 1rem;
  background-color: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text);
  font-size: 1rem;
  outline: none;
  transition: border-color var(--transition);
}

.search-bar input:focus {
  border-color: var(--color-gold);
}

.champion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}
</style>
