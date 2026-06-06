<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useChampionsStore } from './stores/champions'
import { onMounted } from 'vue'
import TitleBar from './components/TitleBar.vue'

const championsStore = useChampionsStore()

onMounted(() => {
  championsStore.fetchChampions()
})
</script>

<template>
  <div class="app-shell">
    <TitleBar />
    <header class="app-header">
      <RouterLink to="/" class="app-logo">
        <span class="logo-text">Champions</span>
      </RouterLink>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  height: 56px;
  background-color: var(--color-bg-soft);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-gold);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
</style>
