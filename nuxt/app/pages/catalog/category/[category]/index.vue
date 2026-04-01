<template>
  <div class="category">
    <div class="container">
      <article>
        <Heading
          breadcrumbs="Каталог"
          link="/catalog"
          :title="rank?.title"
          :quantity="products?.length"
        />
        <div class="category-wrapper">
          <aside>
            <div class="mobile">
              <Button
                @click="open = !open"
                label="Фильтер"
                severity="warn"
                variant="outlined"
                :icon="open ? 'pi pi-angle-down' : 'pi pi-angle-right'"
                iconPos="right"
              />
              <div v-if="open">
                <Filter
                  v-model="selectedFilter"
                  :manufacturer="manufacturer"
                  :culture="culture"
                  :harmful="harmful"
                />
              </div>
            </div>

            <div class="desktop">
              <Filter
                v-model="selectedFilter"
                :manufacturer="manufacturer"
                :culture="culture"
                :harmful="harmful"
              />
            </div>
          </aside>
          <section>
            <Transition mode="out-in">
              <Message v-if="pending" severity="success"> Загрузка... </Message>
              <Message v-else-if="error" severity="error">{{
                error.message
              }}</Message>
              <Message v-else-if="!pending && !products?.length" severity="info"
                >Товары не найдены!</Message
              >
              <div v-else-if="products?.length" class="products-list">
                <ProductList
                  v-for="product in products"
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
import type { TAttributeResponse, TDirectusProduct } from '~/type'

const { getItems } = useDirectusItems()
const router = useRouter()
const route = useRoute()
const { category: slug } = useRoute().params

const open = ref(false)

// Fetch
const { data: rankData } = await useAsyncData<TAttributeResponse[]>(
  `ranks-${slug}`,
  () =>
    getItems({
      collection: 'ranks',
      params: {
        filter: { slug: { _eq: slug } },
        fields: ['slug', 'title', 'description'],
      },
    }),
)

const rank = computed(() => rankData.value?.[0])

// Fetch products this category
const {
  data: allProducts,
  pending,
  status,
  error,
} = await useAsyncData<TDirectusProduct[]>(`products-${slug}`, () =>
  getItems({
    collection: 'products',
    params: {
      filter: { ranks: { ranks_id: { slug: { _eq: slug } } } },
      fields: [
        'id',
        'slug',
        'title',
        'image',
        'description',
        'price',
        'discount',
        'categories.categories_id.title',
        'categories.categories_id.slug',
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

const products = computed(() => {
  if (!allProducts.value) return []

  let filtered = allProducts.value

  // ?manufacturer=adama → фильтруем
  if (selectedFilter.value.manufacturer?.length) {
    filtered = filtered.filter((product) =>
      product.manufacturer?.some((m: any) =>
        selectedFilter.value.manufacturer.includes(m.manufacturer_id.slug),
      ),
    )
  }

  if (selectedFilter.value.culture?.length) {
    filtered = filtered.filter((product) =>
      product.culture?.some((c: any) =>
        selectedFilter.value.culture.includes(c.culture_id.slug),
      ),
    )
  }

  if (selectedFilter.value.harmful?.length) {
    filtered = filtered.filter((product) =>
      product.harmful?.some((h: any) =>
        selectedFilter.value.harmful.includes(h.harmful_id.slug),
      ),
    )
  }

  return filtered
})

// Fetch all filters this category
const { data: allFilter } = await useAsyncData<TDirectusProduct[]>(
  `all-filter-${slug}`,
  () => {
    return getItems({
      collection: 'products',
      params: {
        filter: { ranks: { ranks_id: { slug: { _eq: slug } } } },
        fields: [
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
)

const manufacturer = computed(() => {
  if (!allFilter.value) return []

  const map = new Map()

  allFilter.value.forEach((item) => {
    item.manufacturer?.forEach((m: any) => {
      map.set(m.manufacturer_id.slug, m.manufacturer_id)
    })
  })

  return Array.from(map.values())
})

const culture = computed(() => {
  if (!allFilter.value) return []

  const map = new Map()

  allFilter.value.forEach((item) => {
    item.culture?.forEach((с: any) => {
      map.set(с.culture_id.slug, с.culture_id)
    })
  })

  return Array.from(map.values())
})

const harmful = computed(() => {
  if (!allFilter.value) return []

  const map = new Map()

  allFilter.value.forEach((item) => {
    item.harmful?.forEach((h: any) => {
      map.set(h.harmful_id.slug, h.harmful_id)
    })
  })

  return Array.from(map.values())
})

// Helper to parse query param
function parseQueryParam(param: string | string[] | undefined): string[] {
  if (!param) return []
  return Array.isArray(param) ? param : [param]
}

// Filters client products
const selectedFilter = ref({
  manufacturer: parseQueryParam(route.query.manufacturer),
  culture: parseQueryParam(route.query.culture),
  harmful: parseQueryParam(route.query.harmful),
})

const resetFilters = () => {
  selectedFilter.value = {
    manufacturer: [],
    culture: [],
    harmful: [],
  }
}

// По желанию: вычисляемое свойство для показа кнопки только если фильтры выбраны
const hasActiveFilters = computed(
  () =>
    selectedFilter.value.manufacturer.length > 0 ||
    selectedFilter.value.culture.length > 0 ||
    selectedFilter.value.harmful.length > 0,
)

// Debounced update to URL when filters change
watchDebounced(
  selectedFilter,
  (newVal) => {
    const query = {
      manufacturer: newVal.manufacturer.length
        ? newVal.manufacturer
        : undefined,
      culture: newVal.culture.length ? newVal.culture : undefined,
      harmful: newVal.harmful.length ? newVal.harmful : undefined,
    }
    router.replace({ query })
  },
  { deep: true, debounce: 100 },
)

// Sync back when URL changes (browser back/forward)
watch(
  () => route.query,
  (newQuery) => {
    selectedFilter.value = {
      manufacturer: parseQueryParam(newQuery.manufacturer),
      culture: parseQueryParam(newQuery.culture),
      harmful: parseQueryParam(newQuery.harmful),
    }
  },
  { deep: true },
)

useSeoMeta({
  title: `${rank.value?.title} - Премьер-Агро`,
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
</style>
