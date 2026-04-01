<template>
  <div class="product-image">
    <Skeleton 
      v-if="isLoading" 
      width="100%" 
      :height
      >
    </Skeleton>
    <Image
      v-else
      :src="myImage"
      :alt="alt || 'Продукт'"
      :width
      preview
      />
  </div>
</template>

<script setup lang="ts">
import { useImage } from '@vueuse/core'
import Skeleton from 'primevue/skeleton'

const props = defineProps<{
  img?: string
  alt?: string
  width?: string
  height?: string
}>()

// Обработка картинки товара
const { getThumbnail: img } = useDirectusFiles()
const myImage = img(props?.img || 'Изображение')
const { isLoading } = useImage({ src: myImage })
</script>

<style scoped>
</style>
