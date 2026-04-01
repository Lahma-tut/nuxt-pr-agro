<template>
  <div class="catalog">
    <span v-if="pending">loading...</span>
    <span v-if="error">{{ error }}</span>
    <div v-if="status === 'pending'">
      Loading...
    </div>
    <div v-else-if="status === 'error'">
      Error loading posts
    </div>
    <div 
      v-for="rank in rankItems" 
      :key="rank.id" 
      class="catalog-items"
      >
      <div class="catalog-header">
        <div class="catalog-header__image">
          <img :src="img(rank.image)" alt="rank.title" loading="lazy" />
        </div>
        <div class="catalog-header__name">
          <h3>
            {{ rank.title }}
          </h3>
          <NuxtLink :to="`/catalog/${ rank.slug }`" class="link">
            Смотреть все
            <span class="icon"><i class="pi pi-arrow-right"></i></span>
          </NuxtLink>
        </div>
      </div>
      <div class="catalog-categories">
        <ul v-if="rank.categories.length">
          <li 
            v-for="item in rank.categories" 
            :key="item.id"
            >
            <NuxtLink
              :to="`/catalog/${rank.slug}/${item.categories_id.slug}`"
              class="categories-link"
            >
              {{ item.categories_id.title }}
            </NuxtLink>
          </li>
        </ul>
        <pre>{{ status }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getItems } = useDirectusItems()
const { getThumbnail: img } = useDirectusFiles()

interface TRank {
  id: number,
  title: string,
  slug: string,
  description: string
  image: string
  categories: any[]
}

const loading = computed(() => pending.value) 

const {
  data: rankItems,
  status,
  pending,
  error,
} = await useAsyncData<TRank[]>('ranks', () =>
  getItems({
    collection: 'ranks',
    params: { fields: ['*', 'categories.categories_id.*'] },
  }),
)
</script>

<style scoped>
.catalog {
  display: grid;
  gap: var(--spacing-xl);
}

@media (width >= 520px) {
  .catalog {
    grid-template-columns: 1fr 1fr;
  }
}

@media (width >= 1100px) {
  .catalog {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.catalog-header {
  position: relative;
  margin-bottom: var(--spacing-lg);
}

.catalog-header__image {
  height: 100%;
  height: 176px;
  display: flex;
}

.catalog-header__image img {
  width: 100%;
  filter: brightness(76%);
  border-radius: 2px;
  object-fit: cover;
}

.catalog-header__name {
  width: 100%;
  height: 100%;
  padding: var(--spacing-3xl) var(--spacing-xl) var(--spacing-xl);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

h3 {
  font-size: var(--text-m);
  font-weight: 500;
  letter-spacing: 1px;
  color: white;
  text-transform: uppercase;
  margin: 0;
}

ul,
ul li {
  list-style: none;
}

.link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--p-neutral-50);
  text-transform: uppercase;
  transition: color 0.3s ease-out;
  cursor: pointer;
}

.link:hover {
  color: var(--color-orange);
}

.icon i {
  font-size: var(--spacing-sm);
}

/* categories */
.catalog-categories ul {
  margin-left: var(--spacing-xl);
}

.catalog-categories li {
  margin-bottom: var(--spacing-xxxs);
}

.categories-link {
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  text-decoration-color: var(--p-neutral-300);
  transition: color 0.3s ease-out;
  -webkit-text-decoration-thickness: 1px;
  -webkit-text-decoration-color: #c9c9c9;
}

.categories-link:hover {
  color: var(--color-orange);
}
</style>
