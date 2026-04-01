<template>
  <header>
    <div class="container">
      <div class="wrapper">
        <div class="logo">
          <NuxtLink to="/">
            <img :src="logo" alt="logo" width="260px" />
          </NuxtLink>
        </div>
        <nav>
          <div v-for="item in navigate" :key="item.id">
            <NuxtLink :to="item.link" class="nav-desktop__item">
              {{ item.name }}
            </NuxtLink>
          </div>
        </nav>
        <div class="search" ref="dropdownHandler">
          <button @click.prevent="dropdownSearch = !dropdownSearch">
            <i
              class="pi pi-search"
              :class="[dropdownSearch ? 'orange' : 'green']"
            ></i>
          </button>
        </div>
        <div class="cart">
          <NuxtLink to="/cart">
            <i
              class="pi pi-shopping-cart"
              :class="[$route.path === '/cart' ? 'orange' : 'green']"
            ></i>
            <Transition>
              <span
                v-if="sumQuantity"
                class="cart__count"
                :class="[$route.path === '/cart' ? 'orange' : 'green']"
              >
                {{ sumQuantity }}
              </span>
            </Transition>
          </NuxtLink>
        </div>
        <div class="contact">
          <span class="mail">agro@pr-agro.ru</span>
          <span class="tel">8 (495) 198-07-97</span>
        </div>
        <div class="nav-mobile">
          <NuxtLink to="/catalog">
            <i class="pi pi-align-justify"></i>
          </NuxtLink>
        </div>
      </div>
      <Transition name="search" mode="out-in">
        <div v-if="dropdownSearch" class="search-animation-wrapper">
          <div class="search-container-inner">
            <Search @navigateEvent="handle" />
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import logo from '~/assets/image/logo-pr-agro.png'

const { sumQuantity } = storeToRefs(useCartStore())

const dropdownSearch = ref(false)

const handle = () => (dropdownSearch.value = false)

const navigate = ref([
  { id: 1, name: 'О компании', link: '/' },
  { id: 2, name: 'Каталог', link: '/catalog' },
  { id: 3, name: 'Доставка', link: '/' },
  { id: 4, name: 'Блог', link: '/' },
  { id: 5, name: 'Контакты', link: '/' },
])
</script>

<style scoped>
@import url('~/assets/css/header.css');
</style>
