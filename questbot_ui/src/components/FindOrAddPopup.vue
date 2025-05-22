<script setup>
import { ref, inject, onMounted } from 'vue'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
import { config } from '../config'

const props = defineProps(['options'])
const emit = defineEmits(['handleInput', 'close'])

const questions = ref([])
const multiselectData = ref([])

// Заголовки для API запросов
const apiHeaders = {
  'Auth-Type': 'web',
  Authorization: `Bearer ${inject('$cookies').get('token')}`,
}

const finishSelect = (event) => {
  emit('handleInput', 'findOrAdd', multiselectData.value)
  emit('close')
}

const fetchQuestions = async () => {
  const questionsResponse = await axios.get(`${config.QUESTBOT_API_HOST}/questions`, {
    headers: apiHeaders,
  })
  questions.value = questionsResponse.data.map((v) => {
    return { text: v.text, options: v.options }
  })
}

onMounted(async () => {
  await fetchQuestions()
})
</script>

<template>
  <div @click.self="$emit('close')" class="dim">
    <div class="container">
      <Multiselect
        v-model="multiselectData"
        :multiple="true"
        :options="questions"
        :close-on-select="false"
        track-by="text"
        label="text"
      />
      <button @click="finishSelect">Добавить</button>
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

  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 450px;
  height: fit-content;
  min-height: 380px;
  max-height: 800px;
  overflow: auto;
  border-radius: 10px;
  background-color: var(--color-background);
  padding: 30px;
}

button {
  position: absolute;
  background-color: var(--color-background-soft);
  width: 150px;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
