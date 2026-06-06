<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isMaximized = ref(false)

function minimize() { window.electronAPI.windowMinimize() }
function maximize() { window.electronAPI.windowMaximize(); updateMaximized() }
function close() { window.electronAPI.windowClose() }

async function updateMaximized() {
  isMaximized.value = await window.electronAPI.windowIsMaximized()
}

function onResize() {
  updateMaximized()
}

onMounted(() => {
  updateMaximized()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div class="title-bar">
    <div class="title-bar-drag">
      <span class="title-bar-text">LoL Champion Dashboard</span>
    </div>
    <div class="title-bar-controls">
      <button class="tb-btn tb-minimize" @click="minimize" title="Minimize">
        <svg width="10" height="1" viewBox="0 0 10 1"><rect width="10" height="1" fill="currentColor"/></svg>
      </button>
      <button class="tb-btn tb-maximize" @click="maximize" :title="isMaximized ? 'Restore' : 'Maximize'">
        <svg v-if="!isMaximized" width="10" height="10" viewBox="0 0 10 10"><rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor"/></svg>
        <svg v-else width="10" height="10" viewBox="0 0 10 10">
          <rect x="2" y="0" width="8" height="8" fill="none" stroke="currentColor"/>
          <rect x="0" y="2" width="8" height="8" fill="var(--color-bg-soft)" stroke="currentColor"/>
        </svg>
      </button>
      <button class="tb-btn tb-close" @click="close" title="Close">
        <svg width="10" height="10" viewBox="0 0 10 10">
          <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" stroke-width="1.2"/>
          <line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" stroke-width="1.2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  background-color: var(--color-bg-soft);
  border-bottom: 1px solid var(--color-border);
  /* Makes the bar draggable to move the window */
  -webkit-app-region: drag;
  flex-shrink: 0;
  user-select: none;
}

.title-bar-drag {
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  flex: 1;
  min-width: 0;
}

.title-bar-text {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title-bar-controls {
  display: flex;
  -webkit-app-region: no-drag;
}

.tb-btn {
  width: 46px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  transition: background-color var(--transition), color var(--transition);
  border-radius: 0;
  outline: none;
}

.tb-btn:hover {
  background-color: var(--color-bg-card);
  color: var(--color-text);
}

.tb-close:hover {
  background-color: #c42b1c;
  color: #fff;
}
</style>
