<template>
  <div class="slider">
    <div class="slider-wrapper" ref="wpapperRef">
      <img 
        :src="state.src" 
        :alt="state.alt" 
        :key="state.id"
        />
      <div class="title">
        <h5>{{ state.title }}</h5>
      </div>
      <div class="slick">
        <button 
          @click="prev()">
          <i class="icon pi pi-chevron-circle-left"></i>
        </button>
        <button 
          @click="next()">
          <i class="icon pi pi-chevron-circle-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCycleList } from "@vueuse/core";
import { useIntervalFn } from '@vueuse/core'
import imagePshenicza from '~/assets/image/pshenicza-v-pole.jpeg'
import imageScaled from '~/assets/image/duyet-le-vsh-scaled.jpeg'
import imageYablonya from '~/assets/image/jen-theod-yablonya.jpeg'

import { usePointerSwipe } from '@vueuse/core'
import { useTemplateRef } from 'vue'

// Непонятно как работает
const list = shallowRef([
  {
    id: 1,
    title: "Средства защиты растений для всех культур",
    src: imagePshenicza,
    alt: "pshenicza",
  },
  {
    id: 2,
    title: "Удобрения для полевых и тепличных культур",
    src: imageScaled,
    alt: "feature",
  },
  {
    id: 3,
    title: "Биопрепараты для защиты сада и теплиц",
    src: imageYablonya,
    alt: "yablonya",
  }
]);

const { state, next, prev } = useCycleList(list)
const { pause } = useIntervalFn(() => next(), 8000)

const wpapperRef = useTemplateRef('wpapperRef')

const { isSwiping, direction } = usePointerSwipe(wpapperRef, {
  onSwipeEnd() {
    next()
  }
})


</script>

<style scoped>
.slider {
  position: relative;
}

.slider-wrapper {
  height: 25rem;
  width: 100%;
  border-radius: 2px;
  overflow: hidden;
}

img {
  width: 100%;
  height: 100%;
  filter: brightness(95%);
  border-radius: 2px;
  object-fit: cover;
  animation: scale 36s infinite;
}

@keyframes scale {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.title {
  width: 100%;
  height: 100%;
  padding: 6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
}

h5 {
  max-width: 70%;
  font-size: 2.6rem;
  font-weight: 500;
  color: white;
  text-transform: uppercase;
}

.slick {
  width: 100%;
  height: 100%;
  padding: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
}

.icon {
  font-size: 2rem;
  color: white;
  opacity: 0.7;
  transition: 0.3s ease-out;
}

.icon:hover {
  opacity: 1;
  transform: scale(1.1);
}

@media (width < 768px) {
  h5 {
    max-width: 100%;
  }
}

@media (width < 590px) {
  .slick {
    display: none;
  }
  
  .title {
    padding: 2.4rem;
  }
  
  h5 {
    font-size: 2.2rem;
  }
}

@media (width < 375px) {
  .slider-wrapper {
    height: 20rem;
  }

  .title {
    padding: 2rem;
  }

  h5 {
    font-size: 1.8rem;
  }
}

/* Варианты переходов и анимации не используются */

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

</style>
