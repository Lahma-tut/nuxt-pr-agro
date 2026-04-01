<template>
  <div class="catalog">
    <div class="container">
      <article>
        <div class="heading">
          <div class="heading-wrapper">
            <div class="title">
              <h1>Каталог</h1>
              <!-- <span v-if="data?.length" class="quantity">{{ data.length }} товаров</span> -->
            </div>
          </div>
        </div>
        <div class="catalog-column">
          <aside>
            <div v-if="manufacturer.length">
              <h5>Производитель</h5>
              <ul>
                <li v-for="item of manufacturer" :key="item.id">
                  <Checkbox
                    v-model="manufacturer"
                    name="manufacturer"
                    :inputId="item.slug"
                    :value="item.id"
                  />
                  <label :for="item.slug">{{ item.title }}</label>
                </li>
              </ul>
            </div>
            <div v-if="culture.length">
              <h5>Культура</h5>
              <ul>
                <li v-for="item of culture" :key="item.id">
                  <Checkbox
                    v-model="culture"
                    name="culture"
                    :inputId="item.slug"
                    :value="item.id"
                  />
                  <label :for="item.slug">{{ item.title }}</label>
                </li>
              </ul>
            </div>
            <div v-if="harmful.length">
              <h5>Культура</h5>
              <ul v-if="harmful">
                <li v-for="item of harmful" :key="item.id">
                  <Checkbox
                    v-model="harmful"
                    name="harmful"
                    :inputId="item.slug"
                    :value="item.id"
                  />
                  <label :for="item.slug">{{ item.title }}</label>
                </li>
              </ul>
            </div>
          </aside>
          <section>
            <div v-if="rankItems.length" class="catalog-items">
              <CatalogList
                v-for="rank in rankItems"
                :key="rank.id"
                :rank="rank"
              />
            </div>
          </section>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
const manufacturer = ref([])
const culture = ref([])
const harmful = ref([])

const { data: rankItems, pending } = await useRanks()

useSeoMeta({
  title: 'Каталог',
  description: 'This is my amazing site, let me tell you all about it.',
})
</script>

<style scoped>
@import url('~/assets/css/catalog.css');
</style>
