import { defineStore } from 'pinia'

type DataItem = {
  id: number
  slug: string
  title: string
  price: number
  description: string
  category: string
  image: string
}

export const useSearchStore = defineStore('search', () => {
  const loading = ref(false)
  const error = ref()
  const resultSearch = ref<DataItem[]>()

  const { getItems } = useDirectusItems()

  const clearSearch = () => {
    resultSearch.value = []
  }

  const getSearchItems = async (query: string) => {
    resultSearch.value = []
    loading.value = true
    error.value = null
    try {
      resultSearch.value = await getItems({
        collection: 'products',
        params: {
          filter: {
            _or: [
              { title: { _icontains: query } },
            ],
          },
          fields: ['*'],
        },
      })
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    resultSearch,
    clearSearch,
    getSearchItems,
  }
})
