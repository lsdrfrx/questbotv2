<script setup>
import { ref, inject } from 'vue'
import router from '../router/index'
import axios from 'axios'
import { config } from '../config'

const selectedType = ref('signin')

const username = ref('')
const password = ref('')
const repeatPassword = ref('')
const errorText = ref('')

const $cookies = inject('$cookies')

const changeType = (type) => {
  errorText.value = ''
  selectedType.value = type
}

const handleSubmitSignIn = (event) => {
  event.preventDefault()

  axios
    .post(`${config.QUESTBOT_API_HOST}/auth/signin`, {
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
      if (err.status === 400) {
        errorText.value = 'Неверный логин или пароль'
      }
    })
}

const handleSubmitSignUp = (event) => {
  event.preventDefault()
  console.log('signup')
}
</script>

<template>
  <div class="auth">
    <div class="select_type">
      <button @click="changeType('signin')" :class="{ active: selectedType === 'signin' }">
        Вход
      </button>
      <button @click="changeType('signup')" :class="{ active: selectedType === 'signup' }">
        Регистрация
      </button>
    </div>

    <div v-if="selectedType === 'signin'" class="form">
      <form @submit="handleSubmitSignIn">
        <input v-model="username" placeholder="Имя пользователя" />
        <input type="password" v-model="password" placeholder="Пароль" />

        <button type="submit">Войти</button>
        <span class="error" v-if="errorText !== ''">{{ errorText }}</span>
      </form>
    </div>

    <div v-if="selectedType === 'signup'" class="form">
      <form @submit="handleSubmitSignUp">
        <input v-model="username" placeholder="Имя пользователя" />
        <input type="password" v-model="password" placeholder="Пароль" />
        <input type="password" v-model="repeatPassword" placeholder="Повторите пароль" />

        <button type="submit">Зарегистрироваться</button>
        <span class="error" v-if="errorText !== ''">{{ errorText }}</span>
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

button {
  margin: 0 auto;
  color: var(--color-foreground);
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  padding: 8px;
  min-width: 150px;
  max-width: 250px;
  font-size: 18px;
  transition: 0.2s all ease-in;
}

form button:hover {
  color: hsla(160, 100%, 37%, 1);
  border: 1px solid hsla(160, 100%, 37%, 1);
}

form .error {
  color: red;
  text-align: center;
}
</style>
