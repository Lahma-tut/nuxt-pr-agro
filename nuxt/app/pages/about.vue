<script setup lang="ts">

definePageMeta({ layout: 'default', title: 'My About page' })

useSeoMeta({
  title: 'My About',
  ogTitle: 'My About',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="about">
    <div class="container">
      <Headling title="О компании"/>
      <article>
        <div>
          <p>
            About ipsum, dolor sit amet consectetur adipisicing elit. 
            At unde vitae sit doloremque. Maiores, perferendis possimus architecto obcaecati porro vel?
          </p>
          <ul>
            <li>About ipsum</li>
            <li>About ipsum</li>
            <li>About ipsum</li>
            
          </ul>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.about {

}
</style>