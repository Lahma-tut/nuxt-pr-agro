<template>
  <div class="heading">
    <div class="wrapper">
        <NuxtLink v-if="link" :to="link">
          <div class="breadcrumb">
            <span class="breadcrumb-icon">
              <i class="pi pi-angle-double-left"></i>
            </span>
            <h4>{{ props.breadcrumbs }}</h4>
          </div>
        </NuxtLink>
      <div class="title">
        <h1>{{ props.title }}</h1>
        <span v-if="quantity" class="quantity">{{ quantity }} товаров</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  link?: string
  breadcrumbs?: string
  quantity?: number
}

const props = defineProps<Props>()

// const props = withDefaults(defineProps<Props>(), {
//   title: 'Заголовок',
//   quantity: 0
// })

</script>

<style scoped>
.heading {
  --heading-padding: 0 0;
  display: flex;
  align-items: center;
  padding: var(--heading-padding);
  margin-bottom: var(--spacing-4xl);
}

@media (width > 1100px) {
  .heading {
    --heading-padding: var(--spacing-xl) var(--spacing-xs);
  }
}

.wrapper {
  max-width: 768px;
  min-height: var(--spacing-8xl);
  height: 100%;
  display: grid;
  gap: var(--spacing-xxs);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.breadcrumb-icon {
  font-size: var(--text-s);
  color: var(--color-orange);
  line-height: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.quantity {
  padding-top: var(--spacing-xxxs);
  color: var(--p-neutral-400);
}

h1 {
  font-size: clamp(var(--text-2xl), calc(2.25vw + 0.875rem), var(--text-4xl));
  color: var(--color-green);
  font-weight: 600;
  text-wrap: pretty;
}

h4 {
  font-size: var(--text-m);
  color: var(--color-orange);
  font-weight: 500;
  text-transform: uppercase;
  transition: letter-spacing 0.3s ease-out;
  cursor: pointer;
  margin: 0;
}

h4:hover {
  letter-spacing: 1px;
}

@media (width <= 425px) {
  h4 {
    font-size: var(--text-sm);
  }
}
</style>
