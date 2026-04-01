<template>
  <div class="checkout">
    <div class="container">
      <Heading title="Оформление заказа" />
      <div class="wrapper">
        <section class="form">
          <h5>ФИО</h5>
          <div class="form-user">
            <label for="name">Фамилия Имя Отчество*</label>
            <InputText
              v-model.trim="formData.name"
              type="text"
              id="name"
              size="large"
              :invalid="v.name.$invalid"
            />

            <label for="email">Почта*</label>
            <InputText
              v-model="formData.email"
              type="text"
              id="email"
              size="large"
              :invalid="v.email.$invalid"
            />

            <label for="phone">Телефон*</label>
            <InputMask
              v-model="formData.phone"
              mask="+7 (999) 999-99-99"
              placeholder="+7"
              id="phone"
              size="large"
              :invalid="v.phone.$invalid"
            />

            <div class="fiscal">
              <label>Юридическое лицо</label>
              <p>Для выставления счета на оплату загрузите реквизиты!</p>
              <div class="fiscal-file">
                <div class="file-upload">
                  <div @click="open()" class="btn-upload">
                    <span><i class="pi pi-upload"></i></span>
                    Выберите файл
                  </div>
                  <template v-if="files">
                    <li v-for="file of files" :key="file.name" class="files">
                      Вы загрузили:
                      <span class="item-file">{{ file.name }}</span>
                    </li>
                  </template>
                  <span v-if="files" @click="reset()" class="btn-reset">
                    Сбросить
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="radio">
            <RadioButton
              v-model="formData.radio"
              inputId="pickup"
              value="pickup"
            />
            <label for="pickup">Самовывоз</label>
          </div>
          <div class="pickup-description">
            <p>{{ description }}</p>
            <button @click="copy(description)" class="btn-copy">
              <span v-if="!copied">Скопировать <i class="pi pi-copy"></i></span>
              <span v-else>Cкопировано <i class="pi pi-thumbs-up"></i></span>
            </button>
          </div>

          <div class="radio">
            <RadioButton
              v-model="formData.radio"
              inputId="delivery"
              value="delivery"
            />
            <label for="delivery">Доставка транспортной компанией</label>
          </div>

          <div v-if="formData.radio === 'delivery'" class="delivery">
            <div class="delivery-description">
              <p>
                Ознакомиться с наличием терминалов в городе, сроками, стоимостью
                доставки можно нас странице -
                <a href="/delivery" target="_blank"
                  >Доставка <i class="pi pi-external-link"></i
                ></a>
              </p>
            </div>

            <div class="delivery-wrapper">
              <label>Выберите транспортную компанию</label>
              <Select
                placeholder="Выбрать"
                v-model="formData.transport.company"
                :options="company"
                optionLabel="name"
                class="select-company"
                :invalid="v.transport.company.$invalid"
              />

              <label for="terminal">До терминала в городе</label>
              <InputText
                placeholder="Город"
                v-model="formData.transport.terminal"
                id="terminal"
                type="text"
                :invalid="v.transport.terminal.$invalid"
              />

              <label for="adress">До адреса терминала в городе</label>
              <InputText
                placeholder="Номер дома и название улицы"
                v-model="formData.transport.adress"
                id="adress"
                type="text"
              />

              <label for="passport">Паспорт</label>
              <p>{{ passportText }}</p>
              <InputMask
                v-model="formData.transport.passport"
                id="passport"
                type="text"
                placeholder="Номер Серия"
                mask="9999-999999"
                fluid
                :invalid="v.transport.passport.$invalid"
              />

              <label for="terminal">ФИО</label>
              <InputText
                v-model="formData.transport.user"
                id="passportFio"
                type="text"
                placeholder="Фамилия Имя Отчество"
                :invalid="v.transport.user.$invalid"
              />
            </div>
          </div>
        </section>

        <section class="order">
          <div class="order-row">
            <div class="order-wrapper">
              <h4>Ваш заказ</h4>
              <ul v-if="cartProducts.length" class="order-items">
                <li v-for="product in cartProducts" class="order-item">
                  <div class="order-item-title">
                    <p>{{ product.title }}</p>
                  </div>
                  <div class="order-item-content">
                    <p>x {{ product.quantity }}</p>
                    <p>
                      {{
                        (
                          Number(product.price) *
                          Number(product.package) *
                          product.quantity
                        ).toLocaleString('ru')
                      }}
                      ₽
                    </p>
                  </div>
                </li>
              </ul>
              <div class="order-total">
                <span>Итого</span>
                <span>{{ total.toLocaleString('ru-RU') }} ₽</span>
              </div>
            </div>

            <div class="checkout">
              <h4>Ваши данные</h4>
              <div class="checkout-block">
                <div class="checkout-user">
                  <div>
                    ФИО: <span class="user-info">{{ formData.name }}</span>
                  </div>
                  <div>
                    Почта: <span class="user-info">{{ formData.email }}</span>
                  </div>
                  <div>
                    Телефон: <span class="user-info">{{ formData.phone }}</span>
                  </div>
                  <div>
                    <span class="user-ratio">{{ radioChoice }}</span>
                  </div>
                </div>
                <div
                  v-if="formData.radio === 'delivery'"
                  class="checkout-transport"
                >
                  <div>
                    Tранспортная компания:
                    <span class="user-info">{{
                      formData.transport.company?.name
                    }}</span>
                  </div>
                  <div>
                    До терминала в городе:
                    <span class="user-info">{{
                      formData.transport.terminal
                    }}</span>
                  </div>
                  <div>
                    До адреса терминала в городе:
                    <span class="user-info">{{
                      formData.transport.terminal
                    }}</span>
                  </div>
                  <div>
                    Паспорт:
                    <span class="user-info">{{
                      formData.transport.passport
                    }}</span>
                  </div>
                  <div>
                    ФИО:
                    <span class="user-info">{{ formData.transport.user }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="checked">
              <Checkbox
                v-model="formData.checked"
                inputId="checked"
                binary
                :invalid="v?.checked.$invalid"
              />
              <label for="checked" class="checked-label"
                >Lorem ipsum dolor sit amet consectetur adipisicing elit
                fuga!</label
              >
            </div>
            <button
              @click.prevent="formSubmit"
              class="button-checkout"
              :disabled="v.$invalid || loading"
            >
              {{ loading ? 'Отправляю...' : loadingSteps }}
              <!-- {{ loading ? 'Отправляю...' : 'Отправить' }} -->
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RadioButton from 'primevue/radiobutton'
import { useCartStore } from '~/stores/cart'
import { useFileDialog } from '@vueuse/core'
import { useVuelidate } from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'
import Heading from '~/components/Heading.vue'

const { createItems } = useDirectusItems()

const cart = useCartStore()
const { cartProducts, total, sumQuantity, summaryPack } = storeToRefs(cart)

const formData = ref({
  name: '',
  email: '',
  phone: '',
  checked: false,
  radio: 'pickup',
  // Поля доставки (опционально)
  transport: {
    company: null as any,
    terminal: '',
    adress: '',
    passport: '',
    user: '',
  },
})

const radioChoice = computed(() => {
  return formData.value.radio === 'pickup'
    ? 'Самовывоз'
    : 'Доставка транспортной компанией'
})

const formValidation = computed(() => {
  const isDelivery = formData.value.radio === 'delivery'
  return {
    name: { required, minLength: minLength(2) },
    email: { required, minLength: minLength(8) },
    phone: { required, minLength: minLength(10) },
    checked: { checked: (value: boolean) => value === true, required },
    transport: isDelivery
      ? {
          company: { required: (val: any) => val !== null },
          terminal: { required, minLength: minLength(2) },
          adress: { required, minLength: minLength(5) },
          passport: { required },
          user: { required, minLength: minLength(2) },
        }
      : {},
  }
})

const v = useVuelidate(formValidation, formData, { $lazy: true })

const formSubmit = async () => {
  v?.value.$touch()
  if (v?.value.$invalid) return

  await createOrderUser()
}

const loading = ref(false)
const error = ref()

const loadingSteps = computed(() => {
  return formData.value.checked && !v?.value.$invalid
    ? 'Отправить'
    : 'Заполните форму'
})

// const timeout = setTimeout(() => loading.value = false, 2000)

const pickupItem = {
  name: 'Самовывоз',
  address:
    'Московская обл., г. Лыткарино, территория промзоны Тураево стр. 36. Понедельник-Пятница с 08:00 до 18:00',
  email: 'agro@pr-agro.ru',
  phone: '8 (495) 198-07-97',
}

/*---Создаем заказ---*/
const createOrderUser = async () => {
  loading.value = true
  error.value = null

  try {
    // Генерируем уникальный order_id на клиенте
    const clientOrderId = `${Date.now()}`

    // Подготавливаем товары (M2M)
    const orderItems = cartProducts.value.map((p) => ({
      products_id: { id: p.id },
      quantity: p.quantity,
      price: p.price,
      package: p.package,
    }))

    const orderTransport =
      radioChoice.value === 'Самовывоз' ? pickupItem : formData.value.transport

    const orderData = [
      {
        status: 'published',
        total: total.value,
        client_order_id: clientOrderId,

        // Клиент
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,

        // Связь M2M (название поля в коллекции 'orders')
        products: orderItems,

        // Данные доставки
        transport: orderTransport,
      },
    ]

    // Создание
    await createItems({ collection: 'orders', items: orderData })

    // Очистка корзины
    cart.resetCart()

    await navigateTo(`/checkout/${clientOrderId}`)
  } catch (err) {
    error.value = err as Error
    console.error('Ошибка Directus:', err)
  } finally {
    loading.value = false
  }
}

const description = ref(
  'Московская обл., г. Лыткарино, территория промзоны Тураево стр. 36. Понедельник-Пятница с 08:00 до 18:00',
)

const { copy, copied } = useClipboard({ description })

const { files, open, reset, onCancel, onChange } = useFileDialog({
  accept: 'image/*,.pdf,.doc,.docx,.rtf,.xls,.xlsx',
  max: '200m',
})

onChange((files) => {
  /** do something with files */
})

onCancel(() => {
  /** do something on cancel */
})

const passportText =
  'Ваши паспортные данные будут использоваться для оформления в транспортной компании, а также данные необходимы для получения заказа'

const company = ref([
  { name: 'Деловые Линии', code: 'DL' },
  { name: 'СДЭК', code: 'SD' },
  { name: 'Boxberry', code: 'BB' },
  { name: 'Байкал Сервис', code: 'BS' },
  { name: 'ПЭТ', code: 'PT' },
  { name: 'ЖелДорЭкспедиция', code: 'ZD' },
  { name: 'GTD', code: 'GD' },
  { name: 'Норд Вил', code: 'NV' },
  { name: 'Энергия', code: 'EG' },
  { name: 'Сократ', code: 'SK' },
])

definePageMeta({ layout: 'default', name: 'Checkout' })

useSeoMeta({
  title: 'Checkout',
  description: 'This is my amazing site, let me tell you all about it.',
})
</script>

<style scoped>
@import url('~/assets/css/checkout.css');
</style>
