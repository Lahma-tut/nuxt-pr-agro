<template>
  <div class="sidebar">
    <section>
      <h5>Похожие</h5>
      <ul class="filter-items">
        <li v-for="item of similar">
          {{ item }}
        </li>
      </ul>
    </section>
    
    <section>
      <h5>Акция</h5>
      <ul class="filter-items">
        <li v-for="item of sale">
          {{ item }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Checkbox } from "primevue"

defineProps<{
  similar?: string[]
  sale?: string[]
}>()

</script>

<style scoped>
.sidebar {
  display: grid;
  gap: var(--spacing-s);
}

.sidebar section {
  display: grid;
  gap: var(--spacing-s);
}

  h5 {
  font-size: var(--text-m);
  font-weight: 500;
  color: var(--color-orange);
  text-transform: uppercase;
}

.filter-items li {
  display: flex;
  align-items: center;
  gap: 10px;
  list-style: none;
  font-size: var(--text-m);
  color: var(--p-neutral-600);
  font-weight: 300;
  line-height: 1.5;
  letter-spacing: normal;
  margin-bottom: 5px;
}

.choose {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s);
}

.choose ul {
  display: flex;
  gap: var(--spacing-xxs);
}

.choose li {
  padding: 2px var(--spacing-xxs);
  border: 1px solid var(--p-neutral-200);
  border-radius: 5px;
  list-style: none;
  font-weight: 300;
  color: var(--p-neutral-500);
  font-size: var(--text-sm);
  cursor: pointer;
}

.choose li:hover {
  background-color: var(--p-neutral-100);
}

/* .choose-enter-active,
.choose-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.choose-enter-from,
.choose-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.choose-enter-to,
.choose-leave-from {
  opacity: 1;
  transform: translateY(0);
} */

/* .choose-enter-active,
.choose-leave-active {
  overflow: hidden;
  transition: all 0.3s ease;
  max-height: 0;
}
.choose-enter-from {
  opacity: 0;
  max-height: 0;
}
.choose-leave-to {
  opacity: 0;
  max-height: 0;
}
.choose-enter-to,
.choose-leave-from {
  opacity: 1;
  max-height: 200px;
} */

.filter-enter-active,
.filter-leave-active,
.filter-move {
  transition: all 0.3s ease;
}

.filter-enter-from,
.filter-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* КРИТИЧНО: убирает из потока при удалении */
.filter-leave-active {
  position: absolute;
  width: 100%;
}
</style>
