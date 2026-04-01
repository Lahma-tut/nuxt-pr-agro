import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { useToast } from "primevue/usetoast"
import type { TCartProductQuantity, TDirectusProduct } from "~/type"

export const useCartStore = defineStore('cart', () => {
  const cartProducts = ref<TCartProductQuantity[]>([])
  const loading = ref(false)
  const costPrice = ref()

  const toast = useToast()

  const show = (title: string) => {
    toast.add({
      severity: "success",
      summary: "Корзина",
      detail: `${ title } добавлен!`,
      life: 3000,
    })
  }

  const addCart = (product: TDirectusProduct, count: number) => {

    // Если еть скидка то присваиваем скидку переменной
    const finalPrice = product.discount ? Number(product.discount) : Number(product.price)

    const data: TCartProductQuantity = {
      id: product.id,
      title: product.title,
      description: product.description,
      image: product.image,
      price: finalPrice,
      package: product.package.title,
      package_unit: product.package_unit.title,
      quantity: count,
    }

    const item = cartProducts.value?.find(p => p.id === data.id)

    if (!item) {
      cartProducts.value.push(data)
    } else {
      item.quantity += count
    }
    show(product.title)
    saveLocalStorage()
  }

  const sumQuantity = computed(() => cartProducts.value.reduce((acc, current) => acc + current.quantity, 0))

  const total = computed(() => {
    return cartProducts.value.reduce((acc, current) => 
      acc + current.quantity * Number(current.price) * Number(current.package), 0)
  })

 const summaryPack = computed(() => {
  return cartProducts.value.reduce((acc, current) => acc + current.quantity * Number(current.price), 0)
 })

  // Оптимизированный вариант
  const increaseQty = (id: string) => {
    cartProducts.value = cartProducts.value?.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    )
    saveLocalStorage()
  }

  const decrementQty = (id: string) => {
    cartProducts.value = cartProducts.value
      .map(item => item.id === id ? {...item, quantity: item.quantity - 1} : item)
      .filter(item => item.quantity > 0)
    saveLocalStorage()
  }

  const removeItem = (id: string) => {
    cartProducts.value = cartProducts.value.filter(item => item.id !== id)
    saveLocalStorage()
  }

  //  Вариант
  // const removeItem = (id: number) => {
  //   cartProducts.value.splice(
  //     cartProducts.value.findIndex((a: any) => a.id === id),
  //     1,
  //   )
  //   localStorage.removeItem("cart")
  //   saveLocalStorage()
  // }

  //  Вариант
  //  const removeItem = (id: number) => {
  //   const index = items.value.findIndex(item => item.id === id)
  //   if (index > -1) {
  //     items.value.splice(index, 1)
  //   }
  //   saveLocalStorage()
  // }

  const resetCart = () => {
    cartProducts.value = []
    localStorage.clear()
  }

  const saveLocalStorage = () => {
    localStorage.setItem("cart", JSON.stringify(cartProducts.value))
  }

  const loadLocalStorage = async () => {
    if (!import.meta.client) return // SSR-safe
    loading.value = true
    try {
      const data = localStorage.getItem("cart")
      cartProducts.value = data ? JSON.parse(data) : []
    } catch (error) {
      cartProducts.value = []
      console.log('cartStore', error)
    } finally {
      loading.value = false
    }
  }

  // Подключаем Directus
  // const { createcartProducts } = useDirectuscartProducts()

  // const createOrderUser = async (cartProducts) => {
  //   try {
  //     // const cartProducts = [{ name: '222222', status: "published", }]

  //     await createcartProducts({ collection: "order", cartProducts })
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }


  // const createOrderUser = async () => {
  //   try {
  //     const cartProducts = [
  //       {
  //         name: "testitem",
  //       }
  //     ];
  //     await createcartProducts({ collection: "order", cartProducts });
  // } catch (e) {}


  return {
    loading,
    cartProducts,
    addCart,
    sumQuantity,
    total,
    costPrice,
    summaryPack,
    increaseQty,
    decrementQty,
    saveLocalStorage,
    loadLocalStorage,
    removeItem,
    resetCart,
  }
})
