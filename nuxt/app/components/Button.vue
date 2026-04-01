<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <button>{{ msg }}</button>
</template>

<style scoped>
button {
  padding: 15px var(--spacing-8xl);
  font-size: 1rem;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-image: linear-gradient(
    to right,
    #ff8008 0%,
    #ffc837 51%,
    #ff8008 100%
  );
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 30px;
  display: block;
  cursor: pointer;
}

button:hover {
  background-position: right center;
  /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
}


</style>