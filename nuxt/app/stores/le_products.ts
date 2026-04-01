import { defineStore } from 'pinia'
import { useArrayUnique } from '@vueuse/core'
import type { TAttributeResponse } from '~/type'
// import type { TCartProducts } from '~/type'

interface TCartProducts {
  id: number | string
  slug: string
  title: string
  image: string
  description: string
  price: string
  discount: string
  culture: TAttributeResponse[],
  harmful: TAttributeResponse[],
  manufacturer: TAttributeResponse[]
}

export const useProductsStore1 = defineStore('products', () => {
  // Состояния
  const products = ref<TCartProducts [] | null>(null)
  const categories = ref(null)

  // Состояние фильтра
  const selectedFilter = reactive({
    manufacturer: [],
    culture: [],
    harmful: [],
  })

  function setProductsData(categoriesData: any, productsData: any) {
    categories.value = categoriesData || []
    products.value = productsData || []
  }

  const filteredProducts = computed(() => {
    // SSR защита
    if (!products.value?.length) return []

    if (
      !selectedFilter.manufacturer.length &&
      !selectedFilter.culture.length &&
      !selectedFilter.harmful.length
    ) {
      return products.value
    }

    const manuSlugs = selectedFilter.manufacturer.map((m: any) => m.slug)
    const cultSlugs = selectedFilter.culture.map((m: any) => m.slug)
    const harmSlugs = selectedFilter.harmful.map((m: any) => m.slug)

    // Проверяем
    if (!manuSlugs.length && !cultSlugs.length && !harmSlugs.length) return products.value

    return products.value.filter((product: any) => {
      const match = (key: string, slugs: string[]) =>!slugs.length || product[key]?.some((item: any) => slugs.includes(item[`${key}_id`]?.slug))
      
      return match('manufacturer', manuSlugs) && match('culture', cultSlugs) && match('harmful', harmSlugs)
      })
    })
  })

  // Вспомогательная функция (Чистый JS без useArrayUnique для SSR стабильности)
  const getOptions = (key: string) => {
    if (!products.value?.length) return []

    const rewItems = products.value
      .flatMap(p => p[key] || [])
      .map(i => i[`${key}_id`])
      .filter(Boolean)
    
    const seen = new Set()

    return rawItems.filter(item => {
      const isDublicate = seen.has(item.slug)
      seen.add(item.slug)
      return !isDublicate
    })

  }

  // Опции для компонента Filter (строятся от ВСЕХ товаров)
  const manufacturer = computed(() => getOptions('manufacturer'))
  const culture = computed(() => getOptions('culture'))
  const harmful = computed(() => getOptions('harmful'))

  // Сброс
  const reset = () => {
    selectedFilter.manufacturer = []
    selectedFilter.culture = []
    selectedFilter.harmful = []
  }

  return {
    filteredProducts, selectedFilter, setProductsData,
    manufacturer, culture, harmful, categories, products, reset
  }
})
