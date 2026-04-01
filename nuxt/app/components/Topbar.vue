<template>
  <div class="topbar">
    <div class="container">
      <ul v-if="data" class="topbar__items">
        <li 
          v-for="(item, i) in data" 
          :key="i" 
          class="topbar__item"
          >
          <i class="pi" :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </li>
      </ul> 
    </div>
  </div>
</template>

<script setup lang="ts">
const data = ref([
  { name: 'Московская обл., г. Лыткарино', icon: 'pi-map-marker' },
  { name: 'Пн-Пт 08:00 до 18:00 / Сб-Вс выходной', icon: 'pi-stopwatch' },
  { name: 'Вконтакте', icon: 'pi-objects-column' },
  { name: 'Яндекс.Отзывы', icon: 'pi-star' }
])
</script>

<style scoped>
@import url("~/assets/css/topbar.css");
</style>