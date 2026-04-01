<template>
  <div class="category">
    <div class="container">
      <article>
        <Heading
          breadcrumbs="Каталог"
          link="/catalog"
          :title="category?.title"
          :quantity="productsData?.length ?? 0"
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
              <!-- Кнопка сброса
              <div v-if="hasActiveFilters" class="reset-wrapper">
                <Button
                  label="Сбросить все" 
                  icon="pi pi-times"
                  link
                  size="small" 
                  @click="resetFilters" 
                />
              </div>
              -->
              <!-- <ClientOnly
                fallback-tag="span"
                fallback="Loading comments..."
              >
                <Filter
                  v-model="selectedFilter"
                  :manufacturer="manufacturer"
                  :culture="culture"
                  :harmful="harmful"
                />
              </ClientOnly> -->
              <Filter
                  v-model="selectedFilter"
                  :manufacturer="manufacturer"
                  :culture="culture"
                  :harmful="harmful"
                />
            </div>
          </aside>
          <section>
            <div
              v-if="category?.description"
              v-html="category?.description"
              class="category-content"
            ></div>
            <Transition>
              <Message v-if="pending" severity="success">Загрузка...</Message>
              <Message v-else-if="error" severity="error">{{ error.message }}</Message>
              <Message v-else-if="!pending && !error && !productsData?.length" severity="info">Товары не найдены!</Message>
              
              <div v-else-if="!pending && productsData?.length" class="products-list">
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
import { debounceFilter, throttleFilter } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import type { TDirectusProduct, TAttribute } from '~/type'
const { getItems } = useDirectusItems()
const nuxtApp = useNuxtApp()

const route = useRoute()
const slugParam = Array.isArray(route.params.slug)
  ? route.params.slug[0]
  : route.params.slug


/*-------------------------------------------------------------
  Создаем "связные" переменные с URL
  transform гарантирует, что мы всегда работаем с массивом строк
-------------------------------------------------------------*/

const queryManufacturer = useRouteQuery<string[]>('manufacturer', [], { transform: (v) => [v].flat().filter(Boolean) as string[] })
const queryCulture = useRouteQuery<string[]>('culture', [], { transform: (v) => [v].flat().filter(Boolean) as string[] })
const queryHarmful = useRouteQuery<string[]>('harmful', [], { transform: (v) => [v].flat().filter(Boolean) as string[] })

// Буферный объект для UI (V-Model чекбоксов)
const selectedFilter = ref({
  manufacturer: [...queryManufacturer.value],
  culture: [...queryCulture.value],
  harmful: [...queryHarmful.value]
})

const open = ref(false)

const resetFilters = () => {
  selectedFilter.value = {
    manufacturer: [],
    culture: [],
    harmful: []
  }
}

// По желанию: вычисляемое свойство для показа кнопки только если фильтры выбраны
const hasActiveFilters = computed(() => 
  selectedFilter.value.manufacturer.length > 0 || 
  selectedFilter.value.culture.length > 0 || 
  selectedFilter.value.harmful.length > 0
)

/*-------------------------------------------------------------
  Watch filters
-------------------------------------------------------------*/

// Синхронизация: UI -> URL (с задержкой 500мс)
watchDebounced(
  selectedFilter,
  (newVal) => {
    queryManufacturer.value = newVal.manufacturer.length ? newVal.manufacturer : []
    queryCulture.value = newVal.culture.length ? newVal.culture : []
    queryHarmful.value = newVal.harmful.length ? newVal.harmful : []
  },
  { deep: true, debounce: 500 }
)

// Синхронизация: URL -> UI (мгновенно, для кнопок "Назад/Вперед")
watch([queryManufacturer, queryCulture, queryHarmful], ([m, c, h]) => {
  selectedFilter.value.manufacturer = m
  selectedFilter.value.culture = c
  selectedFilter.value.harmful = h
}, { deep: true })

/*-------------------------------------------------------------
  Fetch categories. Для отображения slug & title page
-------------------------------------------------------------*/

const { data: categoryData } = await useAsyncData<TAttribute[]>(`categories-${slugParam}`, () =>
    getItems({
      collection: 'categories',
      params: {
        filter: { slug: { _eq: slugParam } },
        fields: ['slug', 'title', 'description'],
      },
    }),
)

const category = computed(() => categoryData.value?.[0])

/*-------------------------------------------------------------
  Fetch products
  При вервой загрузке, приходят все товары из categories
  Выбор фильтра, происходит запрос, данные обновляются
-------------------------------------------------------------*/

// Use URL params as the single source of truth for the key
const productsKey = computed(() => 
  `products-${slugParam}-${queryManufacturer.value.join()}-${queryCulture.value.join()}-${queryHarmful.value.join()}`
)

// Fetch products
const { data: productsData, pending, error } = await useAsyncData<TDirectusProduct[]>(productsKey, () => {
    const filters: any[] = [{ categories: { categories_id: { slug: { _eq: slugParam } } } }]

    if (queryManufacturer.value?.length) {
      filters.push({
        manufacturer: {
          _some: { manufacturer_id: { slug: { _in: queryManufacturer.value } } },
        },
      })
    }
    if (queryCulture.value?.length) {
      filters.push({
        culture: { _some: { culture_id: { slug: { _in: queryCulture.value } } } },
      })
    }
    if (queryHarmful.value?.length) {
      filters.push({
        harmful: { _some: { harmful_id: { slug: { _in: queryHarmful.value } } } },
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
    lazy: true,
    default: () => [] // Устанавливаем дефолтное значение
  },
)

/*-------------------------------------------------------------
  Fetch all filters this category
-------------------------------------------------------------*/

const { data: allFilter } = await useAsyncData<TDirectusProduct[]>(`all-filter-${slugParam}`, () => {
    return getItems({
      collection: 'products',
      params: {
        filter: { categories: { categories_id: { slug: { _eq: slugParam } } } },
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
  }
)

const manufacturer = computed(() => {
  if (!allFilter.value) return []
  const arr = allFilter.value.map((item: any) => item.manufacturer).flat()
  return useArrayUnique(arr, (a: any, b: any) =>
    a.manufacturer_id.slug === b.manufacturer_id.slug).value.map((item: any) => 
    item.manufacturer_id)
})

const culture = computed(() => {
  if (!allFilter.value) return []
  const arr = allFilter.value.map((item: any) => item.culture).flat()
  return useArrayUnique(arr, (a: any, b: any) =>
    a.culture_id.slug === b.culture_id.slug).value.map((item: any) => 
    item.culture_id)
})

const harmful = computed(() => {
  if (!allFilter.value) return []
  const arr = allFilter.value.map((item: any) => item.harmful).flat()
  return useArrayUnique(arr, (a: any, b: any) =>
    a.harmful_id.slug === b.harmful_id.slug).value.map((item: any) => 
    item.harmful_id)
})

useSeoMeta({
  title: `${ category.value?.title } - Премьер-Агро`,
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
