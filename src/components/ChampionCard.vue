<script setup>
import { useChampionsStore } from '@/stores/champions';
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToChampion() {
    router.push({ name: 'champion', params: { id: props.champion.id }})
}

const props = defineProps({
    champion: Object
})

const store = useChampionsStore()
const { version } = storeToRefs(store)
</script>

<template>
    <div class="champion-card" @click="goToChampion" style="cursor: pointer">
        <img
            :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${props.champion.id}.png`"
            :alt="props.champion.name"
        />
        <div class="champion-info">
            <span class="champion-name">{{ props.champion.name }}</span>
            <span class="champion-title">{{ props.champion.title }}</span>
            <div class="champion-tags">
                <span v-for="tag in props.champion.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.champion-card {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform var(--transition), border-color var(--transition);
}

.champion-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-gold-dark);
}

.champion-card img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.champion-info {
  padding: 0.6rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.champion-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
}

.champion-title {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-style: italic;
}

.champion-tags {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

.tag {
  font-size: 0.65rem;
  padding: 0.15rem 0.5rem;
  background-color: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  color: var(--color-gold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>