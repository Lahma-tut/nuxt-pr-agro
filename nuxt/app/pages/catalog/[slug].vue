<template>
  <div class="product">
    <div class="container">
      <div v-if="pending" class="status">
        <Message severity="success">Загрузка...</Message>
      </div>
      <div v-else-if="error" class="status">
        <Message severity="error"
          >Ошибка загрузки данных: v-else-if="error" // status:
          {{ status }}</Message
        >
        <Message severity="success">Ничего страшного, сейчас починим!</Message>
        <Message severity="info">info</Message>
      </div>
      <article v-else>
        <Heading
          :title="product?.title"
          :breadcrumbs="product?.categories ? product?.categories.title : 'Упс'"
          :link="
            product?.categories
              ? `/catalog/category/${product.ranks?.slug}/${product?.categories.slug}`
              : '#'
          "
        />
        <div class="wrapper">
          <div class="product-container">
            <div class="product-card">
              <div class="product-card__image">
                <ProductImage
                  :img="product?.image"
                  :alt="product?.title"
                  width="300"
                  height="304px"
                />
                <p class="description__minmax">
                  Минимальная партия: <span>{{ min }} {{ box }}</span>
                </p>
              </div>
              <div class="product-card__atribute">
                <div class="description">
                  <h6>Назначение</h6>
                  <div>
                    <p>{{ product?.description }}</p>
                  </div>
                </div>
                <Ingredient
                  v-if="product?.ingredients?.length"
                  title="Состав"
                  category="ingredient"
                  :ingredients="product?.ingredients"
                />
                <Attribute
                  v-if="product?.culture.length"
                  title="Культура"
                  category="culture"
                  :attribute="product?.culture as TAttribute[]"
                />
                <Attribute
                  v-if="product?.harmful.length"
                  title="Вредный объект"
                  category="harmful"
                  :attribute="product?.harmful as TAttribute[]"
                />
                <Attribute
                  v-if="product?.manufacturer.length"
                  title="Производитель"
                  category="manufacturer"
                  :attribute="product?.manufacturer as TAttribute[]"
                />
                <div class="quantity">
                  <h6>Упаковка</h6>
                  <p>
                    {{ product?.package?.title }}
                    {{ product?.package_unit?.title }}
                  </p>
                </div>
                <div class="price-box">
                  <div class="price">
                    <h6>Цена за л/кг</h6>
                    <ul>
                      <li class="price-item">
                        <strong class="price-item-count">
                          {{ Number(product?.price).toLocaleString('ru') }} ₽
                        </strong>
                        <span class="price-info"
                          >Рекомендованная цена с НДС 22%</span
                        >
                      </li>
                    </ul>
                  </div>
                  <div class="price-packaging">
                    <h6>Цена за упаковку</h6>
                    <ul>
                      <li class="price-item">
                        <strong class="price-item-count">
                          {{
                            (
                              Number(product?.price) *
                              Number(product?.package?.title)
                            ).toLocaleString('ru')
                          }}
                          ₽
                        </strong>
                        <span class="price-info">
                          Скидка рассчитывается индивидуально
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div v-if="product?.discount" class="sale">
                    <h6>Со скидкой л/кг</h6>
                    <ul>
                      <li class="sale-item">
                        <strong class="sale-item-count">
                          {{ Number(product?.discount).toLocaleString('ru') }} ₽
                        </strong>
                        <span class="sale-info"> Предлагаем вам цену </span>
                      </li>
                    </ul>
                  </div>
                  <div v-if="product?.discount" class="sale-packaging">
                    <h6>Ваша цена</h6>
                    <ul>
                      <li class="sale-item">
                        <strong class="sale-item-count">
                          {{
                            (
                              Number(product?.discount) *
                              Number(product?.package?.title)
                            ).toLocaleString('ru')
                          }}
                          ₽
                        </strong>
                        <span class="sale-info">
                          Дополнительная скидка рассчитывается от объема
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="cart-wrapper">
                  <div class="cart-count">
                    <button @click.prevent="decrement" class="button-count">
                      <i class="pi pi-minus"></i>
                    </button>
                    <input v-model="count" type="text" />
                    <button @click.prevent="increment" class="button-count">
                      <i class="pi pi-plus"></i>
                    </button>
                  </div>
                  <div class="cart-button">
                    <Button
                      @click.prevent="submitAddCart(product, count)"
                      msg="Добавить"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div v-html="product?.content" class="product-description"></div>
          </div>
          <aside>
            <ProductSidebar :similar="similar" :sale="sale" />
          </aside>
        </div>
        <Toast position="bottom-right" />
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TAttribute, TCartProduct, TDirectusProduct } from '~/type'
import Attribute from '~/components/Attribute.vue'
import Button from '~/components/Button.vue'
import ProductSidebar from '~/components/ProductSidebar.vue'

const route = useRoute()
const productSlug = Array.isArray(route.params.slug)
  ? route.params.slug[0]
  : route.params.slug

const similar = ['Ария', 'Торнадо']
const sale = ['Абакус Ультра', 'sal']

// Подлючаем директус
const { getItems } = useDirectusItems()

// Получаем данные
const { data, status, pending, error } = await useAsyncData<TDirectusProduct[]>(
  `product-${productSlug}`,
  () =>
    getItems<TDirectusProduct>({
      collection: 'products',
      params: {
        filter: { slug: { _eq: productSlug } },
        fields: [
          '*',
          'ranks.ranks_id.title',
          'ranks.ranks_id.slug',
          'categories.categories_id.title',
          'categories.categories_id.slug',

          'ingredient.ingredient_id.title',
          'ingredient.ingredient_id.slug',
          'ingredient.ingredient_id.description',
          'ingredient.quantity',
          'ingredient.unit.title',

          'culture.culture_id.title',
          'culture.culture_id.slug',
          'harmful.harmful_id.title',
          'harmful.harmful_id.slug',
          'manufacturer.manufacturer_id.title',
          'manufacturer.manufacturer_id.slug',
          'package.package_id.title',
          'package.package_id.slug',
          'package_unit.package_unit_id.title',
          'package_unit.package_unit_id.slug',
        ],
      },
    }),
)



// Обрабатываем данные через сomputed для всего продукта
const product = computed(() => {
  const item = data.value?.[0]
  if (!item) return null

  return {
    // Основные поля
    id: item.id,
    slug: item.slug,
    title: item.title,
    image: item.image,
    description: item.description,
    price: item.price,
    discount: item.discount,
    content: item.content,
    ingredients: item.ingredient,
    seo: item?.seo,

    // Связанные коллекции
    categories: item.categories?.[0]?.categories_id || null,
    // ingredients: item.ingredient?.map((c) => c.ingredient_id) || [],

    // ingredients: {
    //   ingredient: item.ingredient?.map((i) => i.ingredient_id) || [],
    //   quantity: item.ingredient?.map((i) => i.quantity) || [],
    //   unit: item.ingredient_unit?.map((i) => i.ingredient_unit_id) || [],
    // },

    ranks: item.ranks?.[0]?.ranks_id || null,
    culture: item.culture?.map((c) => c.culture_id) || [],
    harmful: item.harmful?.map((h) => h.harmful_id) || [],
    manufacturer: item.manufacturer?.map((m) => m.manufacturer_id) || [],
    package: item.package?.[0]?.package_id || null,
    package_unit: item.package_unit?.[0]?.package_unit_id || null,
  }
})

// Для добавления в корзину
const count = ref(1)
const increment = () => count.value++
const decrement = () => {
  if (count.value > 1) {
    count.value--
  } else {
    count.value
  }
}

const { addCart } = useCartStore()

const submitAddCart = (product: TDirectusProduct, count: number) => {
  if (product && count) {
    addCart(product, count)
    console.log('product: ', product)
  } else return
}

const min = 20
const box = 'шт - 1 коробка'

// SEO
const seoTitle = computed(() => product.value?.seo ? product.value?.seo.title : undefined)

console.log('seoTitle ', seoTitle.value)
// console.log('seoTitle ', seoDirectuse.value)


useSeoMeta({
  title: seoTitle.value || product.value?.title
})
</script>

<style scoped>
@import url('~/assets/css/product.css');
</style>
