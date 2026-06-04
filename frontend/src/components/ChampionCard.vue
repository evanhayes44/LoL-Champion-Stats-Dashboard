<script setup>
import { useChampionsStore } from '@/stores/champions';
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToChampion() {
    router.push({ name: 'champion', params: { id: props.dsf.id }})
}

const props = defineProps({
    dsf: Object
})

const store = useChampionsStore()
const { version } = storeToRefs(store)
</script>

<template>
    <div class="dsf-card" @click="goToChampion" style="cursor: pointer">
        <img
            :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${props.dsf.id}.png`"
            :alt="props.dsf.name"
        />
        <div class="dsf-info">
            <span class="dsf-name">{{ props.dsf.name }}</span>
            <span class="dsf-title">{{ props.dsf.title }}</span>
            <div class="dsf-tags">
                <span v-for="tag in props.dsf.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dsf-card {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform var(--transition), border-color var(--transition);
}

.dsf-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-gold-dark);
}

.dsf-card img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.dsf-info {
  padding: 0.6rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dsf-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
}

.dsf-title {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-style: italic;
}

.dsf-tags {
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

