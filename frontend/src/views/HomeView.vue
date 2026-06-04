<script setup>
import { useChampionsStore } from '../stores/champions'
import { storeToRefs } from 'pinia'
import ChampionCard from '@/components/ChampionCard.vue'

const store = useChampionsStore()
const { filteredChampions, isLoading, error, searchQuery, tagFilter } = storeToRefs(store)
</script>

<template>
  <main class="dsf-list-view">
    <div class="filter-header">
      <div class="search-bar">
        <input v-model="searchQuery" type="text" placeholder="Search Champions..." />
      </div>
      <div class="tag-selector">
        <select v-model="tagFilter">
          <option value="">Filter Type...</option>
          <option value="Assassin">Assassin</option>
          <option value="Fighter">Fighter</option>
          <option value="Mage">Mage</option>
          <option value="Marksman">Marksman</option>
          <option value="Support">Support</option>
          <option value="Tank">Tank</option>
        </select>
      </div>
    </div>

    <div v-if="isLoading" class="status-message">
      Loading champions...
    </div>
    <div v-else-if="error" class="status-message-error">
      {{ error }}
    </div>

    <div v-else class="dsf-grid">
      <ChampionCard v-for="dsf in filteredChampions" :key="dsf.id" :dsf="dsf" />
    </div>
  </main>
</template>

<style scoped>
.dsf-list-view {
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

.dsf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.filter-header {
  display: flex;
  align-items: left;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.tag-selector select {
  padding: 0.6rem 1rem;
  background-color: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text);
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  transition: border-color var(--transition);
}

.tag-selector select:focus {
  border-color: var(--color-gold);
}
</style>
