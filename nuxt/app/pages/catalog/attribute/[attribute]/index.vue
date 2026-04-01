<template>
  <div class="category">
    <div class="container">
      <article>
        <Heading
          breadcrumbs="Каталог"
          link="/catalog"
          :title="rankItem?.title"
          :quantity="products?.length ?? 0"
        />
        <ul v-if="products?.length">
          <li v-for="item in products">
            {{ item.title }}
          </li>
        </ul>
        <div v-else>Нет товаров</div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TAttributeResponse, TProduct } from '~/type'

const { getItems } = useDirectusItems()
const { category: slug } = useRoute().params

const rankItem = computed(() => rank.value?.[0] || null)

const { data: rank } = await useAsyncData<TAttributeResponse[]>(`ranks-${ slug }`, () =>
  getItems({
    collection: 'ranks',
    params: {
      filter: { slug: { _eq: slug } },
      fields: ['slug', 'title'],
    },
  }),
)

// получение товаров
const { data: products, pending, status, error } = await useAsyncData<TProduct[]>(`products-${ slug }`, () =>
    getItems({
      collection: 'products',
      params: {
        filter: { ranks: { ranks_id: { slug: { _eq: slug } } } },
        fields: ['*'],
      },
    }),
)

useSeoMeta({
  title: `${ rankItem.value?.title } - Премьер-Агро`,
})
</script>

<style scoped>

</style>