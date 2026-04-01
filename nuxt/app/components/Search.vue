<template>
  <div class="search-box">
    <div :class="['search-input', isResults && 'is-result-search']">
      <input
        v-model="input"
        type="text"
        ref="inputTyping"
        placeholder="search"
        @input="handleInput"
      />
      <span v-if="input.length > 0" @click="clearInput" class="icon-clear">
        <i class="pi pi pi-times"></i>
      </span>
    </div>
    <Transition name="search-results" mode="default">
      <div class="result-box" v-if="isResults">
        <div class="result-items">
          <div v-for="(item, index) in resultSearch" :key="item.id">
            <div
              :class="selectedIndex === index ? 'aktive' : ''"
              @click="setSelected(item.title, item.slug)"
            >
              <div class="result-cart">
                <div class="result-cart-image">
                  <Image
                    :src="img(item.image) || ImageDefault"
                    :alt="item.title"
                    width="40"
                    height="40"
                  />
                </div>
                <div class="result-cart-title">
                  <p>{{ item.title }}</p>
                </div>
                <div class="result-cart-price">
                  <p>{{ item.price }} &nbsp;<span>&#x20bd;</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="loading" class="icon-spinner">
          <i class="pi pi-ellipsis-h"> loading</i>
        </div>
        <div class="result-item">
          <p>Подробнее при наведении</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, Transition, watch } from 'vue'
import {
  onClickOutside,
  onKeyDown,
  onKeyStroke,
  refDebounced,
} from '@vueuse/core'
import Image from 'primevue/image'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { onStartTyping } from '@vueuse/core'
import { watchDebounced } from '@vueuse/core'
import { shallowRef } from 'vue'
import ImageDefault from '~/assets/image/default-image.jpg'

const { getThumbnail: img } = useDirectusFiles()

const input = ref('')
const debounced = refDebounced(input, 600)
const isOpen = ref(false)

const clickOutside = ref(null)
const inputTyping = ref<HTMLInputElement | null>(null)
const selectedIndex = ref(-1)
const isResults = ref(false)

// Store
const { getSearchItems, clearSearch } = useSearchStore()
const { resultSearch, loading, error } = storeToRefs(useSearchStore())

// Логика показа результата поиска, вариант 2 refDebounced
watch(debounced, () => {
  if (input.value.length) {
    getSearchItems(input.value)
    isResults.value = true
  } else {
    isResults.value = false
  }
})

const emit = defineEmits(['navigateEvent'])

// переход по выбраному продукту
const setSelected = async (title: string, slug: string) => {
  input.value = title
  isResults.value = false

  await navigateTo(`/catalog/${slug}`)
  emit('navigateEvent')
}

const handleInput = (event: Event) => {
  isOpen.value = true
  input.value = (event.target as HTMLInputElement).value
}

// Очистка формы поиска
const clearInput = () => {
  input.value = ''
  clearSearch()
  isResults.value = false
}

// Фокусировка на input при открытии
onStartTyping(() => {
  if (inputTyping.value !== document.activeElement) inputTyping.value!.focus()
})

// Длина списка реактивно
const itemsLength = computed(() => resultSearch.value?.length ?? 0)

onKeyStroke('ArrowDown', (e) => {
    e.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, itemsLength.value - 1)
  },
  { target: document },
)

onKeyStroke('ArrowUp', (e: any) => {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
  },
  { target: document },
)

// Enter: выбрать выделенный
onKeyStroke('Enter', (e) => {
  e.preventDefault()
  if (selectedIndex.value >= 0 && resultSearch.value) {
    const selectedItem = resultSearch.value[selectedIndex.value]
    setSelected(selectedItem.title, selectedItem.slug)
  }
}, { target: document })

// Сброс при потере фокуса или Escape
onKeyStroke('Escape', () => {
  selectedIndex.value = -1
  input.value = ''
}, { target: document })

</script>

<style scoped>
@import url('~/assets/css/search.css');
</style>
