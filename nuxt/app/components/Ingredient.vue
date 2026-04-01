<template>
  <div class="ingredient">
    <h6>{{ title }}</h6>
    <div class="ingredient-wrapper">
      <ul class="ingredient-unit">
        <li v-for="item in ingredients" :key="item.id" class="ingredients-item">
          <div class="ingredients-item-box">
            <p v-if="item.quantity">{{ item.quantity }}</p>
            <p v-if="item.unit">{{ item.unit.title}}</p>
          </div>

          <div class="ingredient-title">
            <NuxtLink
              :to="`/catalog/attribute/${category}/${item.ingredient_id.slug}`"
              class="link"
            >
              {{ item.ingredient_id?.title }}
            </NuxtLink>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TAttribute } from '~/type'

defineProps<{
  title: string
  category?: string
  ingredients: any
}>()
</script>

<style scoped>
@import url('~/assets/css/product.css');
</style>
