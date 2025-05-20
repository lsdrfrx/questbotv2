<script setup>
import axios from 'axios'
import { ref } from 'vue'

import FormField from '../components/FormField.vue'
import { config } from '../config'

const props = defineProps(['columns', 'data', 'name'])
const emit = defineEmits(['close', 'openFindOrAddPopup'])
const fieldData = ref({})

const createRow = (event) => {
  event.preventDefault()
  axios
    .post(`${config.QUESTBOT_API_HOST}/${props.name}`, fieldData.value, {
      headers: {
        'Auth-Type': 'web',
        Authorization: `Bearer ${$cookies.get('token')}`,
      },
    })
    .then((res) => {
      emit('close')
    })
}

const modifyRow = (event) => {
  event.preventDefault()
  axios
    .put(`${config.QUESTBOT_API_HOST}/${props.name}/${props.data[0]}`, fieldData.value, {
      headers: {
        'Auth-Type': 'web',
        Authorization: `Bearer ${$cookies.get('token')}`,
      },
    })
    .then((res) => {
      emit('close')
    })
}

const handleInput = (event, data) => {
  fieldData.value[event] = data
}
</script>

<template>
  <div @click.self="emit('close')" class="dim">
    <div class="container">
      <form>
        <div v-for="(column, index) in columns" :key="index" class="input">
          <span class="label"
            >{{ column.label === undefined || column.label === null ? column.name : column.label }}
          </span>
          <span class="required">{{ !column.required ? '*' : '' }}</span>
          <br />
          <FormField
            @changeInput="handleInput"
            @openFindOrAddPopup="$emit('openFindOrAddPopup')"
            :editValue="props.data[index]"
            :metadata="column"
            :fieldData="fieldData"
          />
        </div>
        <button v-if="Object.keys(props.data).length > 0" @click.self="modifyRow">Изменить</button>
        <button v-else @click.self="createRow">Создать</button>
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
