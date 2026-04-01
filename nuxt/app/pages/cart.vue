<template>
  <div class="cart">
    <div class="container">
      <Heading :title="sumQuantity ? `В корзинe ${sumQuantity} товара` : 'Корзина'" />
      <section class="cart-box">
        <ClientOnly fallback-tag="span" fallback="Загрузка корзины...">
          <div v-if="loading">Loadig...</div>
          <div v-else-if="cartProducts.length === 0 && !loading">
            <p>Корзина пуста. Вернитесь к покупкам<a href="/catalog"><i class="pi pi-cart-arrow-down"></i></a>
            </p>
          </div>
          <div v-else class="table-scroll">
            <table class="cart-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Товар</th>
                  <th>Цена за л/кг</th>
                  <th>Цена за упаковку</th>
                  <th>Количество</th>
                  <th>Подытог</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in cartProducts">
                  <td>
                    <div class="cart-item-remove">
                      <Toast />
                      <ConfirmPopup></ConfirmPopup>
                      <button @click="submitConfirm($event, product.id)" class="button-remove">
                        <i class="pi pi-times"></i>
                      </button>
                    </div>
                  </td>
                  <td>
                    <div class="cart-item-product">
                      <div class="cart-item-image">
                        <Image :src="img(product.image)" :alt="product.title" width="70" preview />
                      </div>
                      <div class="cart-item-content">
                        <h3 class="cart-item-title">{{ product.title }}</h3>
                        <p class="cart-item-description">{{ product.description }}</p>
                        <p class="cart-item-pack">{{ product.pack }} {{ product.pack_unit }}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div class="cart-item-price">
                      <p>{{ Number(product.price).toLocaleString('ru-RU') }} ₽</p>
                    </div>
                  </td>
                  <td>
                    <div class="cart-item-packaging">
                      <p>
                        {{ (Number(product.price) * Number(product.package)).toLocaleString('ru-RU') }} ₽
                      </p>
                    </div>
                  </td>
                  <td>
                    <div class="cart-item-quantity">
                      <button @click.prevent="decrementQty(product.id)" class="button-quantity">
                        <i class="pi pi-minus"></i>
                      </button>
                      <div class="item-quantity">
                        {{ product.quantity }}
                      </div>
                      <button @click.prevent="increaseQty(product.id)" class="button-quantity">
                        <i class="pi pi-plus"></i>
                      </button>
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

          <div v-if="cartProducts.length" class="order">
            <h4>Сумма заказа</h4>
            <div class="order-box">
              <p>Итого</p>
              <p>{{ total.toLocaleString('ru-RU') }} ₽</p>
            </div>
            <div class="order-info">
              <p>Обратите внимание! В данный момент минимальная сумма заказа 3 000 руб.</p>
              <p>
                Все заказы оформленные в выходные дни, обрабатываются с понедельника, не
                переживайте, с Вами выйдут на связь.
              </p>
              <p class="order-info">
                Доступные способы доставки и наличие товара можно будет узнать после оформления
                заказа и звонка нашего менеджера.
              </p>
            </div>
            <div class="checkout">
              <NuxtLink to="/checkout">
                Оформить
              </NuxtLink>
            </div>
          </div>
        </ClientOnly>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart"
import ConfirmPopup from "primevue/confirmpopup"
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import Heading from "~/components/Heading.vue"
import { Column, DataTable, Image } from "primevue"

const { getThumbnail: img } = useDirectusFiles()

const { cartProducts, total, sumQuantity, loading } = storeToRefs(useCartStore())
const { decrementQty, increaseQty, removeItem, loadLocalStorage } = useCartStore()

const confirm = useConfirm()
const toast = useToast()

await loadLocalStorage() // Запуск при монтировании

const submitConfirm = (event: any, id: string) => {
  confirm.require({
    target: event.currentTarget,
    message: "Удалить этот товар?",
    icon: "pi pi-info-circle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "warn",
    },
    accept: () => {
      toast.add({
        severity: "info",
        summary: "Confirmed",
        detail: "Record deleted",
        life: 3000,
      })

      // Если удаление подтвержденно, отправляем id на удаление
      removeItem(id)
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "You have rejected",
        life: 3000,
      })
    },
  })
}


definePageMeta({ layout: "default", name: "cart" })

useSeoMeta({
  title: "Корзина",
  description: "This is my amazing site, let me tell you all about it.",
})
</script>

<style scoped>
@import url("~/assets/css/cart.css");
</style>
