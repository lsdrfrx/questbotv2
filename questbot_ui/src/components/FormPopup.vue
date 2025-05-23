<script setup>
import axios from 'axios'
import { ref } from 'vue'

import FormField from '../components/FormField.vue'
import { config } from '../config'

const apiHeaders = {
  'Auth-Type': 'web',
  Authorization: `Bearer ${$cookies.get('token')}`,
}

const props = defineProps(['columns', 'data', 'name', 'fieldData', 'findOrAddData'])
const emit = defineEmits(['close', 'openFindOrAddPopup', 'handleInput'])

const findOrAddData = ref(props.findOrAddData || [])

const createRow = (event) => {
  event.preventDefault()
  axios
    .post(`${config.QUESTBOT_API_HOST}/${props.name}`, props.fieldData, {
      headers: apiHeaders,
    })
    .then((res) => {
      emit('close')
    })
}

const modifyRow = (event) => {
  event.preventDefault()
  axios
    .put(`${config.QUESTBOT_API_HOST}/${props.name}/${props.data[0]}`, props.fieldData, {
      headers: apiHeaders,
    })
    .then((res) => {
      emit('close')
    })
}

const saveQuestion = (event) => {
  let [text, options] = event.split('#')
  if (options) {
    options = options.split('|').map((v) => {
      let o = undefined
      if (v.includes('!')) {
        o = v.replace('!', '')
      }
      return {
        text: o || v,
        finalizing: v.includes('!'),
      }
    })
  }

  const data = {
    text: text,
    options: options || [],
  }

  axios
    .post(`${config.QUESTBOT_API_HOST}/questions`, data, {
      headers: apiHeaders,
    })
    .then((data) => {
      findOrAddData.value.push(data.data)
    })
    .catch((error) => {
      console.log(error)
    })
}
</script>

<template>
  <div @click.self="emit('close')" class="dim">
    <div class="container">
      <form @keydown.enter.prevent>
        <div v-for="(column, index) in columns" :key="index" class="input">
          <FormField
            @changeInput="(event, data) => emit('handleInput', event, data)"
            @openFindOrAddPopup="$emit('openFindOrAddPopup')"
            @saveQuestion="saveQuestion"
            :editValue="props.data[index]"
            :metadata="column"
            :fieldData="props.fieldData"
            :findOrAddData="findOrAddData"
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
  height: fit-content;
  max-height: 800px;
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
</style>
