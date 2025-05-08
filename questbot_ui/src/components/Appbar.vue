<script setup>
import { inject, ref, defineProps } from 'vue'
import router from '../router/index'

const $cookies = inject('$cookies')

const props = defineProps(['name'])

const logout = () => {
  $cookies.remove('token')
  router.push('/auth')
}
</script>

<template>
  <div class="bar">
    <div class="page">
      <button>menu</button>
      <span>{{ props.name }}</span>
    </div>
    <div class="profile">
      <div class="img"></div>
      <button @click="logout">Выйти</button>
    </div>
  </div>
</template>

<style scoped>
.bar {
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  top: 0;
  left: 0;
  width: 100%;
  height: 48px;
  line-height: 48px;
  padding: 0 16px;
  font-size: 18px;
  border-bottom: 1px solid var(--color-border);
}

.bar div * {
  padding: 0 10px;
}

.profile button {
  background-color: var(--color-background);
  color: var(--color-foreground);
  padding: 4px;
  border: 1px solid var(--color-border);
  font-size: 18px;
  transition: all 0.2s ease-in;
}

.profile button:hover {
  color: hsla(160, 100%, 37%, 1);
  border: 1px solid hsla(160, 100%, 37%, 1);
}
</style>
