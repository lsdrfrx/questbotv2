<script setup>
import { ref, inject } from 'vue'
import router from '../router/index'
import axios from 'axios'
import { config } from '../config'

const selectedType = ref('signin')

const username = ref('')
const password = ref('')
const repeatPassword = ref('')

const $cookies = inject('$cookies')

const changeType = (type) => {
  selectedType.value = type
}

const handleSubmit = (event) => {
  event.preventDefault()

  axios
    .post(`https://${config.QUESTBOT_API_HOST}:${config.QUESTBOT_API_PORT}/auth/signin`, {
      username: username.value,
      password: password.value,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((res) => {
      const token = res.data.token
      $cookies.set('token', token)
      router.push('/')
    })
    .catch((err) => {
      console.log(err.status)
    })
}
</script>

<template>
  <div class="auth">
    <div class="select_type">
      <button @click="changeType('signin')" :class="{ active: selectedType.value === 'signin' }">
        Вход
      </button>
      <button @click="changeType('signup')" :class="{ active: selectedType.value === 'signup' }">
        Регистрация
      </button>
    </div>

    <div class="form">
      <form @submit="handleSubmit">
        <input v-model="username" />
        <input type="password" v-model="password" />

        <button type="submit">Войти</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth {
  max-width: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.select_type {
  display: flex;
}

.select_type button {
  width: 100%;
  border: 0;
  border-radius: 10px 10px 0 0;
  font-size: 18px;
  padding: 10px;
  color: var(--color-foreground);
  background-color: var(--color-background-mute);
}

.select_type button.active,
.select_type button:hover {
  color: hsla(160, 100%, 37%, 1);
  background-color: var(--color-background-soft);
}

form {
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-soft);
  padding: 32px;
  border-radius: 0 0 10px 10px;
  gap: 30px;
}

input {
  color: var(--color-foreground);
  background-color: var(--color-background-soft);
  border: none;
  border-bottom: 1px solid var(--color-border);
  font-size: 18px;
  outline: none;
  transition: 0.2s all ease-in;
}

input:focus {
  border-bottom: 1px solid hsla(160, 100%, 37%, 1);
}

button {
  margin: 0 auto;
  color: var(--color-foreground);
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  padding: 8px;
  width: 150px;
  font-size: 18px;
  transition: 0.2s all ease-in;
}

form button:hover {
  color: hsla(160, 100%, 37%, 1);
  border: 1px solid hsla(160, 100%, 37%, 1);
}
</style>
