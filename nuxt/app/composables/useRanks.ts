export const useRanks = () => {
  const { getItems } = useDirectusItems()

  return useAsyncData('ranks', () =>
    getItems({
      collection: 'ranks',
      params: { fields: ['*', 'categories.categories_id.*'] },
    })
  )
}
