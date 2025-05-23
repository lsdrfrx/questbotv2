<script setup>
import axios from 'axios'
import { ref, computed } from 'vue'
import { inject } from 'vue'
import FormField from '../components/FormField.vue'
import { config } from '../config'

const $cookies = inject('$cookies')

const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  name: {
    type: String,
    required: true,
  },
  fieldData: {
    type: Object,
    default: () => ({}),
  },
  findOrAddData: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'openFindOrAddPopup', 'handleInput'])

const apiHeaders = computed(() => ({
  'Auth-Type': 'web',
  Authorization: `Bearer ${$cookies.get('token')}`,
}))

const findOrAddData = ref(props.findOrAddData || [])

const handleApiRequest = async (method, url, data) => {
  try {
    const response = await axios({
      method,
      url: `${config.QUESTBOT_API_HOST}/${url}`,
      data,
      headers: apiHeaders.value,
    })
    emit('close')
    return response
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

const createRow = (event) => {
  event.preventDefault()
  handleApiRequest('post', props.name, props.fieldData)
}

const modifyRow = (event) => {
  event.preventDefault()
  handleApiRequest('put', `${props.name}/${props.data[0]}`, props.fieldData)
}

const saveQuestion = (event) => {
  const [text, options] = event.split('#')
  const processedOptions =
    options?.split('|').map((v) => ({
      text: v.includes('!') ? v.replace('!', '') : v,
      finalizing: v.includes('!'),
    })) || []

  const data = { text, options: processedOptions }

  handleApiRequest('post', 'questions', data).then((response) => {
    findOrAddData.value.push(response.data)
  })
}
</script>

<template>
  <div @click.self="emit('close')" class="dim">
    <div class="container">
      <form @keydown.enter.prevent>
        <div v-for="(column, index) in columns" :key="column.id || index" class="input">
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
        <div class="buttons">
          <button v-if="Object.keys(props.data).length > 0" @click.self="modifyRow">
            Изменить
          </button>
          <button v-else @click.self="createRow">Создать</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Исходные стили (без изменений) */
.dim {
  position: fixed;
  background-color: #000000aa;
  width: 100vw;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
}

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: fit-content;
  max-height: 80vh;
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

/* Новые стили для мобильных устройств */
@media (max-width: 768px) {
  .container {
    width: 90vw;
    max-width: 100%;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    max-height: calc(100vh - 40px);
  }

  form {
    padding: 20px;
    gap: 20px;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  button {
    width: 100%;
    padding: 12px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .container {
    width: 95vw;
    padding: 10px;
  }

  form {
    padding: 15px;
    gap: 15px;
  }
}
</style>
