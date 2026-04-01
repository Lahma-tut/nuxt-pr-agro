import { defineStore } from 'pinia'
import type { TAttribute, TProducts } from '~/type'
import { useArrayUnique } from '@vueuse/core'

export const useProductsStore2 = defineStore('products', () => {
	const products = ref<TProducts [] | null>(null)
  const categories = ref<TAttribute [] | null>(null)

	const selectedFilter = reactive({
    manufacturer: [],
    culture: [],
    harmful: [],
  })

	// Получаем данный страницы и заполняем наш стор
	const setProductsData = (categoriesData: any, productsData: any) => {
    categories.value = categoriesData || []
    products.value = productsData || []
  }

	// Возвращаем название и описание из массива
	const category = computed(() => categories?.value?.[0])

	const filteredProducts = computed(() => {
		// SSR проверка-защита
    if (!products.value?.length) return []

    const manuSlugs = selectedFilter.manufacturer.map((m: any) => m.slug)
    const cultSlugs = selectedFilter.culture.map((m: any) => m.slug)
    const harmSlugs = selectedFilter.harmful.map((m: any) => m.slug)

    // Проверяем есть ли slug[] у фильтров
    if (!manuSlugs.length && !cultSlugs.length && !harmSlugs.length) {
			return products.value
		}
			
		return products.value.filter((product: any) => {
			const match = (key: string, slugs: string[]) => {
				return !slugs.length || product[key]?.some((item) => slugs.includes(item[`${key}_id`]?.slug))
			}

			return match('manufacturer', manuSlugs) &&
						 match('culture', cultSlugs) &&
						 match('harmful', harmSlugs)
		})
	})

	// Вспомогательная функция
  // const getOptions = (key: string) => {
  //   if (!products.value?.length) return []

  //   const rawItems = products.value
  //     .flatMap(p => p[key] || [])
  //     .map(i => i[`${key}_id`])
  //     .filter(Boolean)
    
  //   const seen = new Set()

  //   return rawItems.filter(item => {
  //     const isDuplicate = seen.has(item.slug)
  //     seen.add(item.slug)
  //     return !isDuplicate
  //   })
  // }

	// Опции для компонента Filter (строятся от ВСЕХ товаров)
  const manufacturer = computed(() => {
		if (!filteredProducts.value.length) return []
		const arr = filteredProducts.value.map((item: any) => item.manufacturer).flat()

		return useArrayUnique(arr, (a: any, b: any) => 
			a.manufacturer_id.slug === b.manufacturer_id.slug).value.map((item: any) => item.manufacturer_id)
	})

	const culture = computed(() => {
		if (!filteredProducts.value.length) return []
		const arr = filteredProducts.value.map((item: any) => item.culture).flat()

		return useArrayUnique(arr, (a: any, b: any) => 
			a.culture_id.slug === b.culture_id.slug).value.map((item: any) => item.culture_id)
	})

	const harmful = computed(() => {
		if (!filteredProducts.value.length) return []
		const arr = filteredProducts.value.map((item: any) => item.harmful).flat()

		return useArrayUnique(arr, (a: any, b: any) => 
			a.harmful_id.slug === b.harmful_id.slug).value.map((item: any) => item.harmful_id)
	})

  return {
    setProductsData, filteredProducts, selectedFilter,
		category, manufacturer, culture, harmful
  }
})
