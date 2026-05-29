<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useChampionsStore } from '../stores/champions'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const store = useChampionsStore()
const { version } = storeToRefs(store)

const champion = ref(null)
const isLoading = ref(true)
const error = ref(null)

const statLabels = {
  hp: 'HP',
  hpperlevel: 'HP Per Level',
  mp: 'Mana',
  mpperlevel: 'Mana Per Level',
  movespeed: 'Move Speed',
  armor: 'Armor',
  armorperlevel: 'Armor Per Level',
  spellblock: 'Magic Resist',
  spellblockperlevel: 'Magic Resist Per Level',
  attackrange: 'Attack Range',
  hpregen: 'HP Regen',
  hpregenperlevel: 'HP Regen Per Level',
  mpregen: 'Mana Regen',
  mpregenperlevel: 'Mana Regen Per Level',
  crit: 'Crit Chance',
  critperlevel: 'Crit Per Level',
  attackdamage: 'Attack Damage (AD)',
  attackdamageperlevel: 'AD Per Level',
  attackspeedperlevel: 'AS Per Level',
  attackspeed: 'Attack Speed (AS)',
}

function formatStatKey(key) {
  return statLabels[key] ?? key
}

function formatDescription(text) {
  if (!text) return ''
  return text
    .replace(/<magicDamage>(.*?)<\/magicDamage>/g, '<span class="magic-damage">$1</span>')
    .replace(/<physicalDamage>(.*?)<\/physicalDamage>/g, '<span class="physical-damage">$1</span>')
    .replace(/<trueDamage>(.*?)<\/trueDamage>/g, '<span class="true-damage">$1</span>')
    .replace(/<status>(.*?)<\/status>/g, '<span class="status-effect">$1</span>')
    .replace(/<scaleAP>(.*?)<\/scaleAP>/g, '<span class="magic-damage">$1</span>')
    .replace(/<scaleAD>(.*?)<\/scaleAD>/g, '<span class="physical-damage">$1</span>')
}

function formatCost(spell) {
  const cost = (spell.costBurn ?? '').trim()
  let type = (spell.costType ?? '').trim()

  if (type.includes('abilityresourcename')) {
    type = champion.value.partype
  }

  if (!cost || cost === '0' || type === 'No Cost') return 'No Cost'
  return type ? `${cost} ${type}` : cost
}

onMounted(async () => {
  try {
    const res = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version.value}/data/en_US/champion/${route.params.id}.json`
    )
    const data = await res.json()
    champion.value = Object.values(data.data)[0]
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="champion-detail-view">
    <button class="back-button" @click="router.back()">← Back</button>
    <div v-if="isLoading" class="status-message">Loading...</div>
    <div v-else-if="error" class="status-message error">{{ error }}</div>

    <div v-else class="champion-detail">
      <div class="champion-header">
        <img :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.id}.png`"
          :alt="champion.name" />
        <div>
          <h1>{{ champion.name }}</h1>
          <p class="champion-title">{{ champion.title }}</p>
        </div>
      </div>

      <section class="champion-lore">
        <h2>Lore</h2>
        <p>{{ champion.lore }}</p>
      </section>

      <section class="champion-stats">
        <h2>Base Stats</h2>
        <ul>
          <li v-for="(value, key) in champion.stats" :key="key">
            <span>{{ formatStatKey(key) }}</span>
            <span>{{ value }}</span>
          </li>
        </ul>
      </section>

      <section class="champion-abilities">
        <h2>Abilities</h2>

        <div class="ability">
          <div class="ability-header">
            <img :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${champion.passive.image.full}`"
              :alt="champion.passive.name" class="ability-icon" />
            <div class="ability-title">
              <span class="ability-slot">Passive</span>
              <strong>{{ champion.passive.name }}</strong>
            </div>
          </div>
          <p v-html="formatDescription(champion.passive.description)"></p>
        </div>

        <div v-for="(spell, index) in champion.spells" :key="spell.id" class="ability">
          <div class="ability-header">
            <img :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}`"
              :alt="spell.name" class="ability-icon" />
            <div class="ability-title">
              <span class="ability-slot">{{ ['Q', 'W', 'E', 'R'][index] }}</span>
              <strong>{{ spell.name }}</strong>
            </div>
          </div>
          <div class="ability-stats">
            <span>Cooldown: {{ spell.cooldownBurn }}s</span>
            <span>Cost: {{ formatCost(spell) }}</span>
            <span>Range: {{ spell.rangeBurn }}</span>
          </div>
          <p v-html="formatDescription(spell.description)"></p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.champion-detail-view {
  padding: 2rem;
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.back-button {
  margin-bottom: 1.5rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  transition: color var(--transition);
}

.back-button:hover {
  color: var(--color-gold);
}

.champion-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.champion-header img {
  width: 120px;
  height: 120px;
  border-radius: var(--radius);
  border: 2px solid var(--color-gold-dark);
  object-fit: cover;
}

.champion-header h1 {
  font-size: 2.5rem;
  color: var(--color-gold-light);
  line-height: 1;
  margin-bottom: 0.4rem;
}

.champion-header .champion-title {
  color: var(--color-text-muted);
  font-style: italic;
  font-size: 1rem;
}

section {
  margin-bottom: 2.5rem;
}

section h2 {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-gold);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.champion-lore p {
  color: var(--color-text-muted);
  line-height: 1.7;
}

.champion-stats ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.4rem;
}

.champion-stats li {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0.75rem;
  background-color: var(--color-bg-card);
  border-radius: var(--radius);
  font-size: 0.875rem;
}

.champion-stats li span:first-child {
  color: var(--color-text-muted);
  text-transform: capitalize;
}

.champion-stats li span:last-child {
  color: var(--color-text);
  font-weight: 600;
}

.ability {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.ability strong {
  display: block;
  color: var(--color-gold-light);
  margin-bottom: 0.5rem;
}

.ability p {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
}

:deep(.magic-damage) {
  color: #4fc3f7;
}

:deep(.physical-damage) {
  color: #ff8a65;
}

:deep(.true-damage) {
  color: #e0e0e0;
}

:deep(.status-effect) {
  color: #ce93d8;
}

.ability-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.ability-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.ability-title {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.ability-slot {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-gold);
  font-weight: 700;
}

.ability-stats {
  display: flex;
  gap: 1.25rem;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
</style>