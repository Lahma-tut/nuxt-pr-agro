<template>
  <div class="product-list">
    <div class="image">
      <Skeleton v-if="isLoading" size="6rem"></Skeleton>
      <Image 
        v-else
        :src="productImage" 
        alt="product.title" 
        width="100"
        height="100"
        preview
        />
    </div>
    <div class="contents">
      <NuxtLink :to="`/catalog/${product.slug}`">
        <h3>
          {{ product.title }}
        </h3>
        <div class="description">
          <p>
            {{ product.description }}
          </p>
          <div class="price">
            <p :class="{ sale: product.discount }">
              {{ Number(product.price).toLocaleString('ru-RU') }} ₽
            </p>
            <p v-if="product.discount">
              {{ Number(product.discount).toLocaleString('ru-RU') }} ₽
            </p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useImage } from '@vueuse/core'
import Skeleton from 'primevue/skeleton'

/* 
defineProps<{
  title?: string
  likes?: number
}>()
*/

const product = defineProps<{
  slug: string
  title: string
  image: string
  description: string
  price: string
  discount: string
}>()

// Обработка картинки товара
const { getThumbnail: img } = useDirectusFiles()
const productImage = img(product.image)
const { isLoading } = useImage({ src: productImage })

</script>

<style scoped>
.product-list {
  display: grid;
  grid-template-columns: 6.25rem auto;
  gap: var(--spacing-m);
  padding: var(--spacing-xs);
  transition: background-color 0.5s ease-out;
  cursor: pointer;
}

.product-list:hover {
  border-radius: 2px;
  background-color: var(--p-neutral-100);
}

/* @media (width <= 640px) {
  .product-list {
    grid-template-columns: 1fr 1fr;
  }
} */

.description {
  display: flex;
  align-items: center;
  gap: var(--spacing-m);
}

.description p {
  flex: 1 1 auto;
}

.price {
  flex: 0 0 auto;
}

.price p {
  color: var(--color-green);
  font-weight: 400;
}

.price p:nth-child(2) {
  color: var(--color-orange);
  font-weight: 400;
}

.sale {
  text-decoration: line-through;
}

@media (width <= 640px) {
  .content-column {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (width <= 425px) {
  .description {
    flex-wrap: wrap;
  }
}

h3 {
  font-size: var(--text-lg);
  margin: 0 0 var(--spacing-xxs) 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}   
</style>
