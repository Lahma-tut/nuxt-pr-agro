<template>
  <div class="attributes">
    <h6>
      {{ title }}
    </h6>
    <ul class="attribut">
      <li
        v-for="(item, index) in attribute"
        :key="index"
        class="item"
      >
        <NuxtLink
          :to="`/catalog/attribute/${category}/${item.slug}`"
          class="link"
        >
          {{ item.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { TAttribute } from '~/type';

defineProps<{
  title: string
  category: string
  attribute: TAttribute[]
}>()
</script>

<style scoped>
@import url("~/assets/css/product.css");

.item:not(:last-child):after {
  content: ',';
  margin-left: 1px;
}
</style>
