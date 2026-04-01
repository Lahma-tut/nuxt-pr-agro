<template>
  <div class="category">
    <div class="container">
      <article>
        <Heading
          breadcrumbs="Каталог"
          link="/catalog"
          :title="category?.title"
          :quantity="products?.length ?? 0"
        />
        <div class="category-wrapper">
          <aside>
            <div class="mobile">
              <Button
                @click="open = !open"
                label="Фильтр"
                severity="warn"
                variant="outlined"
                :icon="open ? 'pi pi-angle-down' : 'pi pi-angle-right'"
                iconPos="right"
              />
            </div>

            <div class="desktop">
              <div class="filter">
                <div
                  v-if="manufacturer?.length"
                  key="manufacturer"
                  class="filter-item"
                >
                  <h5>Производитель</h5>
                  <ul class="filter-items">
                    <li v-for="item of manufacturer" :key="item.slug">
                      <Checkbox
                        v-model="selectedFilter.manufacturer"
                        name="manufacturer"
                        :inputId="item.slug"
                        :value="item"
                      />
                      <label :for="item.slug">{{ item.title }}</label>
                    </li>
                  </ul>
                </div>
                <div v-if="culture?.length" key="culture" class="filter-item">
                  <h5>Культура</h5>
                  <ul class="filter-items">
                    <li v-for="item of culture" :key="item.slug">
                      <Checkbox
                        v-model="selectedFilter.culture"
                        name="culture"
                        :inputId="item.slug"
                        :value="item"
                      />
                      <label :for="item.slug">{{ item.title }}</label>
                    </li>
                  </ul>
                </div>
                <div v-if="harmful?.length" key="harmful" class="filter-item">
                  <h5>Вредитель</h5>
                  <ul class="filter-items">
                    <li v-for="item of harmful" :key="item.slug">
                      <Checkbox
                        v-model="selectedFilter.harmful"
                        name="harmful"
                        :inputId="item.slug"
                        :value="item"
                      />
                      <label :for="item.slug">{{ item.title }}</label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
          <section>
            <div
              v-if="category?.description"
              v-html="category?.description"
              class="category-content"
            ></div>
            <Transition mode="out-in">
              <Message v-if="pending" severity="success"> Загрузка... </Message>
              <Message v-else-if="error" severity="error">{{
                error.message
              }}</Message>
              <Message
                v-else-if="!pending && !error && !products?.length"
                severity="info"
              >
                Товары не найдены!
              </Message>

              <div
                v-else-if="!pending && productsData?.length"
                class="products-list"
              >
                <ProductList
                  v-for="product in productsData"
                  :key="product.id"
                  :slug="product.slug"
                  :image="product.image"
                  :title="product.title"
                  :description="product.description"
                  :price="product.price"
                  :discount="product.discount"
                />
              </div>
            </Transition>
          </section>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TDirectusProduct, TAttribute } from '~/type'
const { getItems } = useDirectusItems()
const route = useRoute()
const slugParam = Array.isArray(route.params.slug)
  ? route.params.slug[0]
  : route.params.slug

interface Filters {
  manufacturer: string[]
  culture: string[]
  harmful: string[]
}

const selectedFilter = reactive<Filters>({
  manufacturer: [],
  culture: [],
  harmful: [],
})

const open = ref(false)

// useUrlSearchParams url gerbitsidy?culture=tlya&manufacturer=avgust
const params = useUrlSearchParams('history')

// Получаем категории по slugParam
const { data: categoryData } = await useAsyncData<TAttribute[]>(
  `categories-${slugParam}`,
  () =>
    getItems({
      collection: 'categories',
      params: {
        filter: { slug: { _eq: slugParam } },
        fields: ['slug', 'title', 'description'],
      },
    }),
)

const category = computed(() => categoryData.value?.[0])

// Получаем категории по slugParam
const { data: filtersData } = await useAsyncData<TAttribute[]>(
  `filters-${slugParam}`,
  () =>
    getItems({
      collection: 'products',
      params: {
       filter: { slug: { _eq: slugParam } },
        fields: [
          'culture.culture_id.title',
          'culture.culture_id.slug',
          'harmful.harmful_id.title',
          'harmful.harmful_id.slug',
          'manufacturer.manufacturer_id.title',
          'manufacturer.manufacturer_id.slug',
        ],
      },
    }),
)

// Функция для безопасного преобразования в массив строк
const toSlugArray = (value: unknown): string[] => {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String)
  }
  return [String(value)]
}

// Создаем ключ для продуктов на основе параметров
const productsKey = computed(() => {
  const manufacturerSlugs = toSlugArray(params.manufacturer).sort().join(',')
  const cultureSlugs = toSlugArray(params.culture).sort().join(',')
  const harmfulSlugs = toSlugArray(params.harmful).sort().join(',')

  return `products-${slugParam}-m:${manufacturerSlugs}-c:${cultureSlugs}-h:${harmfulSlugs}`
})

const {
  data: productsData,
  pending,
  error,
} = await useAsyncData<TDirectusProduct[]>(
  productsKey,
  () => {
    const filters: any[] = [
      { categories: { categories_id: { slug: { _eq: slugParam } } } },
    ]

    const manufacturerSlugs = toSlugArray(params.manufacturer)
    const cultureSlugs = toSlugArray(params.culture)
    const harmfulSlugs = toSlugArray(params.harmful)

    if (manufacturerSlugs.length) {
      filters.push({
        manufacturer: {
          _some: { manufacturer_id: { slug: { _in: manufacturerSlugs } } },
        },
      })
    }

    if (cultureSlugs.length) {
      filters.push({
        culture: { _some: { culture_id: { slug: { _in: cultureSlugs } } } },
      })
    }

    if (harmfulSlugs.length) {
      filters.push({
        harmful: { _some: { harmful_id: { slug: { _in: harmfulSlugs } } } },
      })
    }

    return getItems({
      collection: 'products',
      params: {
        filter: { _and: filters },
        fields: [
          'id',
          'slug',
          'title',
          'image',
          'description',
          'price',
          'discount',
          'culture.culture_id.title',
          'culture.culture_id.slug',
          'harmful.harmful_id.title',
          'harmful.harmful_id.slug',
          'manufacturer.manufacturer_id.title',
          'manufacturer.manufacturer_id.slug',
        ],
      },
    })
  },
  {
    watch: [productsKey],
    immediate: true,
  },
)

const products = computed(() => productsData.value)

// Готовим массив для отображения списка фильтра
const manufacturer = computed(() => {
  if (!productsData.value) return null

  const arr = productsData.value
    .map((item: any) => item.manufacturer)
    .flat()
    .filter(Boolean)
  const result = useArrayUnique(
    arr,
    (a, b) => a?.manufacturer_id?.slug === b?.manufacturer_id?.slug,
  )

  return result.value.map((item: any) => item.manufacturer_id).filter(Boolean)
})

const culture = computed(() => {
  if (!productsData.value) return null

  const arr = productsData.value
    .map((item: any) => item.culture)
    .flat()
    .filter(Boolean)

  const result = useArrayUnique(
    arr,
    (a, b) => a?.culture_id?.slug === b?.culture_id?.slug,
  )

  return result.value.map((item: any) => item?.culture_id).filter(Boolean)
})

const harmful = computed(() => {
  if (!productsData.value) return null

  const arr = productsData.value
    .map((item: any) => item.harmful)
    .flat()
    .filter(Boolean)

  const result = useArrayUnique(
    arr,
    (a, b) => a?.harmful_id?.slug === b?.harmful_id?.slug,
  )

  return result.value.map((item: any) => item?.harmful_id).filter(Boolean)
})

// Функция для инициализации фильтра из URL
const initFilterFromUrl = () => {
  if (!productsData.value) return

  // Очищаем текущие фильтры
  selectedFilter.manufacturer = []
  selectedFilter.culture = []
  selectedFilter.harmful = []

  // Инициализируем фильтры из URL
  if (params.manufacturer) {
    const slugs = toSlugArray(params.manufacturer)
    if (manufacturer.value) {
      selectedFilter.manufacturer = manufacturer.value.filter((item) =>
        slugs.includes(item.slug),
      )
    }
  }

  if (params.culture) {
    const slugs = toSlugArray(params.culture)
    if (culture.value) {
      selectedFilter.culture = culture.value.filter((item) =>
        slugs.includes(item.slug),
      )
    }
  }

  if (params.harmful) {
    const slugs = toSlugArray(params.harmful)
    if (harmful.value) {
      selectedFilter.harmful = harmful.value.filter((item) =>
        slugs.includes(item.slug),
      )
    }
  }
}

// Инициализируем фильтры после загрузки данных
watch(
  productsData,
  () => {
    initFilterFromUrl()
  },
  { immediate: true },
)

// Синхронизация выбранных фильтров с URL
watch(
  selectedFilter,
  (newFilter) => {
    params.manufacturer = newFilter.manufacturer.length
      ? (newFilter.manufacturer.map((m) => m.slug) as any)
      : undefined

    params.culture = newFilter.culture.length
      ? (newFilter.culture.map((c) => c.slug) as any)
      : undefined

    params.harmful = newFilter.harmful.length
      ? (newFilter.harmful.map((h) => h.slug) as any)
      : undefined
  },
  { deep: true },
)

useSeoMeta({
  title: () =>
    category.value?.title
      ? `${category.value.title} — Премьер-Агро`
      : 'Категория — Премьер-Агро',
})
</script>

<style scoped>
.category-wrapper {
  display: grid;
  gap: var(--spacing-m);
}

.mobile button {
  width: 100%;
}

.mobile-filter {
  padding: var(--spacing-m);
  border: 1px solid var(--p-neutral-200);
  border-radius: 8px;
  background: var(--p-surface-0);
}

.category-content {
  margin-bottom: var(--spacing-lg);
}

@media (width <= 768px) {
  .desktop {
    display: none;
  }

  .mobile {
    display: block;
    display: grid;
    gap: var(--spacing-m);
  }
}

@media (width >= 768px) {
  .category-wrapper {
    grid-template-columns: 254px 1fr;
  }

  .desktop {
    display: block;
  }

  .mobile {
    display: none;
  }
}

/* Filter*/

.filter {
  display: grid;
  gap: var(--spacing-s);
}

.filter-item {
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
</style>
