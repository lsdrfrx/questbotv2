<script setup>
import { defineProps, defineEmits, ref, inject } from 'vue'
import FormField from '../components/FormField.vue'
import axios from 'axios'
import { config } from '../config'

const props = defineProps(['columns', 'closeForm', 'name'])
const emit = defineEmits(['closePopup'])
const fieldData = ref({})

const sendPost = (event) => {
  event.preventDefault()
  axios
    .post(`${config.QUESTBOT_API_HOST}/${props.name}`, fieldData.value, {
      headers: {
        'Auth-Type': 'web',
        Authorization: `Bearer ${$cookies.get('token')}`,
      },
    })
    .then((res) => {
      emit('closePopup')
    })
}

const handleInput = (event, data) => {
  fieldData.value[event] = data
}
</script>

<template>
  <div @click.self="emit('closePopup')" class="dim">
    <div class="container">
      <form>
        <div v-for="(column, index) in columns" :key="index" class="input">
          <span class="label"
            >{{ column.label === undefined || column.label === null ? column.name : column.label }}
          </span>
          <span class="required">{{ !column.required ? '*' : '' }}</span>
          <br />
          <FormField @changeInput="handleInput" :metadata="column" :fieldData="fieldData" />
        </div>
        <button @click.self="sendPost">Создать</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.dim {
  position: absolute;
  background-color: #000000aa;
  width: 100vw;
  height: 100%;
  top: 0;
  left: 0;
}

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 800px;
  overflow: auto;
  border-radius: 10px;
  background-color: var(--color-background);
}

form {
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-soft);
  padding: 30px;
  gap: 30px;
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

span.label {
  font-size: 18px;
  display: flexbox;
  padding-right: 5px;
}

span.required {
  color: red;
}
</style>
