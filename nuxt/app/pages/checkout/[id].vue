<template>
  <div class="order">
    <div class="container">
      <Heading :title="order && 'Спасибо за заказ'" />
      <div class="wrapper">
        <div v-if="order" class="order-card">
          <h3>Ваш заказ № {{ order.id }}</h3>
          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Цена за л/кг</th>
                  <th>Упаковка</th>
                  <th>Цена</th>
                  <th>Количество</th>
                  <th>Подытог</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <td class="total" colspan="6">
                    Итого: {{ Number(order?.total).toLocaleString('ru-RU') }} ₽
                  </td>
                </tr>
              </tfoot>
              <tbody>
                <tr v-for="product in order?.products" :key="product.id">
                  <td>
                    <div class="cart-item-product">
                      <div class="cart-item-image">
                        <Image
                          :src="img(product.products_id.image)"
                          :alt="product.title"
                          width="70"
                          preview
                        />
                      </div>
                      <div class="cart-item-content">
                        <h3 class="cart-item-title">{{ product.products_id.title }}</h3>
                        <p class="cart-item-description">
                          {{ product.products_id.description }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="cart-item-price">
                      <p>
                        {{ Number(product.price).toLocaleString('ru-RU') }} ₽
                      </p>
                    </div>
                  </td>
                  <td>
                    <div class="cart-item-packaging">
                      {{ product.package }} {{ product.package_unit }}
                    </div>
                  </td>
                  <td>
                    <p>
                      {{
                        (
                          Number(product.price) * Number(product.package)
                        ).toLocaleString('ru-RU')
                      }}
                      ₽
                    </p>
                  </td>
                  <td>
                    <div class="cart-item-quantity">
                      {{ product.quantity }}
                    </div>
                  </td>
                  <td>
                    <div class="cart-item-summary">
                      <p>
                        {{
                          (
                            Number(product.price) *
                            Number(product.package) *
                            product.quantity
                          ).toLocaleString('ru-RU')
                        }}
                        ₽
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="order-card-user">
            <h3>Ваш данные</h3>
            <div class="user-wrapper">
              <div>
                <div>
                  <p>
                    Your order № {{ order.id }} has shipped and will
                    be with you soon.
                  </p>
                </div>
                <div class="user">
                  <p><span>ФИО: </span> {{ order.name }}</p>
                  <p><span>Почта: </span> {{ order.email }}</p>
                  <p><span>Телефон: </span> {{ order.phone }}</p>
                </div>
              </div>

              <div>
                <div class="transport">
                  <p>{{ order.transport.name }}</p>
                </div>
                <div class="transport-item">
                  <p>
                    <span>Адрес склада: </span>{{ order.transport.address }}
                  </p>
                  <p><span>Почта: </span>{{ order.transport.email }}</p>
                  <p><span>Телефон: </span>{{ order.transport.phone }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Message v-else-if="!loading && !order" severity="success">Заказ не найден</Message>
        <Message v-else severity="success">Загрузка...</Message>
      </div>
    </div>
  </div>
</template>

<script setup>
import Heading from '~/components/Heading.vue'

// Подлючаем директус
const { getItems } = useDirectusItems()
const { getThumbnail: img } = useDirectusFiles()

const order = ref(null)
const loading = ref(true)

// Получаем order_id из URL параметров (более надежный способ)
const route = useRoute()

onMounted(async () => {
  try {
    const order_id = route.params.id

    if (!order_id) {
      console.log('Нет ID заказа')
      loading.value = false
      return
    }

    const items = await getItems({
      collection: 'orders',
      params: {
        filter: { client_order_id: { _eq: order_id } },
        fields: ['*', 'products.*', 'products.products_id.title', 'products.products_id.image', 'products.products_id.description'],
      },
    })

    console.log('items:', items)

    if (items && items.length > 0) {
      order.value = items[0]
      console.log('Заказ найден:', order.value)
    }
  } catch {
    console.log('Заказ не найден')
  } finally {
    loading.value = false
  }
})

useSeoMeta({
  title: 'Order',
  description: 'This is my amazing site, let me tell you all about it.',
})
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  padding: var(--spacing-xl);
}

h3 {
  margin: 0;
}

.order-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.order-card-user {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
}

.order-card-products {
  flex: 1;
}

.cart-item-product {
  display: flex;
  align-items: center;
  gap: var(--spacing-s);
}

.cart-item-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxxs);
}

.cart-item-image {
  flex: 1 0 auto;
}

.cart-item-title {
  font-size: 16px;
}

.total {
  text-align: right;
  font-size: var(--text-m);
  font-weight: 500;
  color: var(--p-neutral-600);
}

.transport span,
.user span {
  font-weight: 500;
}

.transport-name p {
  font-weight: 500;
}

.user-wrapper {
  display: grid;
  grid: 1fr / 1fr 1fr;
  gap: var(--spacing-lg);
}
</style>
