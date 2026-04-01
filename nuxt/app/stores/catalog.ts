import { defineStore } from "pinia"
import { useArrayUnique } from "@vueuse/core"

export const useCatalogStore = defineStore("catalog", () => {
  const loading = ref(false)
  const error = ref()
  const categories = ref()
  const products = ref()
  const filters = ref()

  // 1 версия
  const selectedManufacturer = ref<string[]>([])
  const selectedCulture = ref<string[]>([])
  const selectedHarmful = ref<string[]>([])

  // 2 версия
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

  // Фильтруем товары на основе выбраных фильтров
  const filtered = computed(() => {
    if (!selectedFilter.manufacturer.length && 
        !selectedFilter.culture.length && 
        !selectedFilter.harmful.length) {
      return products.value
    }

    if (selectedFilter) {
      const manufacturerSlugs = selectedFilter.manufacturer.map((m) => m.slug)
      const cultureSlugs = selectedFilter.culture.map((m) => m.slug)
      const harmfulSlugs = selectedFilter.harmful.map((m) => m.slug)

      return products.value.filter((product: any) => {
        const hasManufacturer = 
          !manufacturerSlugs.length ||
          product.manufacturer.includes((m) =>
            manufacturerSlugs.includes(m.manufacturer_id.slug),
          )
        
        const hasCulture = 
          !cultureSlugs.length ||
          product.culture.includes((c) => 
            cultureSlugs.includes(c.culture_id.slug)
          )

        const hasHarmful = 
          !harmfulSlugs.length ||
          product.harmful.includes((h) => 
            harmfulSlugs.includes(h.harmful_id.slug)
          )

        return hasManufacturer && hasCulture && hasHarmful
      })
    }
  })

  // Фильтруем товары
  const filteredProducts = computed(() => {
    if (
      (!selectedManufacturer.value || selectedManufacturer.value.length === 0) &&
      (!selectedCulture.value || selectedCulture.value.length === 0) &&
      (!selectedHarmful.value || selectedHarmful.value.length === 0)
    ) {
      return products.value
    }

    return products.value.filter((product: any) => {
      const hasManufacturer =
        !selectedManufacturer.value.length ||
        product.manufacturer.includes((m: any) =>
          selectedManufacturer.value.includes(m.manufacturer_id.title),
        )

      const hasCulture =
        !selectedCulture.value.length ||
        product.culture.includes((c: any) => selectedCulture.value.includes(c.culture_id.title))

      const hasHarmful =
        !selectedHarmful.value.length ||
        product.harmful.includes((h: any) => selectedHarmful.value.includes(h.harmful_id.title))

      return hasManufacturer && hasCulture && hasHarmful
    })
  })

  // Готовим массив для отображения списка фильтра
  const manufacturer = computed(() => {
    if (filteredProducts.value) {
      // Делаем наш массив плоским, убираем вложенность
      const arr = filteredProducts.value.map((item: any) => item.manufacturer).flat()
      // Уникализируем объекты лежащие в массиве data
      const result = useArrayUnique(
        arr,
        (a, b) => a.manufacturer_id.slug === b.manufacturer_id.slug,
      )
      // Возвращаем наш результат
      return result.value.map((item: any) => item.manufacturer_id)
    } else null
  })

  const culture = computed(() => {
    if (filteredProducts.value) {
      const arr = filteredProducts.value.map((item: any) => item.culture).flat()
      const result = useArrayUnique(arr, (a, b) => a.culture_id.slug === b.culture_id.slug)
      return result.value.map((item: any) => item.culture_id)
    } else null
  })

  const harmful = computed(() => {
    if (filteredProducts.value) {
      const arr = filteredProducts.value.map((item: any) => item.harmful).flat()
      const result = useArrayUnique(arr, (a, b) => a.harmful_id.slug === b.harmful_id.slug)
      return result.value.map((item: any) => item.harmful_id)
    } else null
  })

  // Фильтруем товары c применением new Set
  // const filteredProductsSet = computed(() => {
  //   const manufacturerSet = new Set(selectedFilter.manufacturer)
  //   const cultureSet = new Set(selectedFilter.culture)
  //   const harmfulSet = new Set(selectedFilter.harmful)

  //   if (
  //     manufacturerSet.size === 0 &&
  //     cultureSet.size === 0 &&
  //     harmfulSet.size === 0
  //   ) {
  //     return data.value
  //   }

  //   return data.value.filter((product: any) => {
  //     const hasManufacturer =
  //       manufacturerSet.size === 0 ||
  //       product.manufacturer.some((m: any) => manufacturerSet.has(m.manufacturer_id.slug))

  //     return hasManufacturer
  //   })
  // })

  // [ { "title": "Avgust", "slug": "avgust" } ]

  return {
    setProductsData,
    categories,
    loading,
    error,
    manufacturer,
    culture,
    harmful,
    selectedManufacturer,
    selectedCulture,
    selectedHarmful,
    filteredProducts,
    selectedFilter,
    filtered,
    products,
  }
})
