<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
button {
  margin: 0 auto;
  color: var(--color-foreground);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  padding: 8px;
  max-width: 250px;
  font-size: 18px;
  transition: 0.2s all ease-in;
}

button:hover {
  color: hsla(160, 100%, 37%, 1);
  border: 1px solid hsla(160, 100%, 37%, 1);
}

input {
  color: var(--color-foreground);
  background-color: var(--color-background-soft);
  border: none;
  border-bottom: 1px solid var(--color-border);
  font-size: 18px;
  outline: none;
  transition: 0.2s all ease-in;
  width: 100%;
}

input:focus {
  border-bottom: 1px solid hsla(160, 100%, 37%, 1);
}

input[type='checkbox'] {
  width: 60px;
}
</style>
