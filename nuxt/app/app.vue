<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

onMounted(() => cartStore.loadLocalStorage()) // Загрузка корзины из localStorage

watch(cartStore.cartProducts, () => cartStore.saveLocalStorage(), { deep: true }) // watch для авто-сохранения

</script>
