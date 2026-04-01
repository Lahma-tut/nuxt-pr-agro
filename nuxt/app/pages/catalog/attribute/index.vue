<template>
  <div class="container">
    <h3>{{ route.fullPath }}</h3>
  </div>
</template>

<script setup>
const route = useRoute()
</script>
