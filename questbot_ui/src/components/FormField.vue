<script setup>
import { defineProps, defineEmits, ref, inject, onUpdated, onMounted, watch } from 'vue'
import axios from 'axios'
import moment from 'moment'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import { config } from '../config'

const props = defineProps({
  editValue: {
    type: [String, Number, Boolean, Array, Date, Object],
    default: null,
  },
  metadata: {
    type: Object,
    required: true,
    validator: (meta) => !!meta.name && !!meta.type,
  },
})

const emit = defineEmits(['changeInput', 'saveQuestion', 'openFindOrAddPopup'])

// Состояния компонента
const fieldType = ref('text')
const fieldValue = ref(props.metadata.defaultValue)
const options = ref([])
const isLoading = ref(false)

// Критерии для разных типов отношений
const RELATION_CRITERIA = {
  employee: 'usernameShort',
  project: 'projectName',
  chat: 'name',
  role: 'role',
  division: 'name',
}

// URI для разных типов множественного выбора
const MULTISELECT_URI = {
  recepientChats: 'chat',
  recepientEmployees: 'employee',
  subprojects: 'project',
}

// Определяем тип поля
const determineFieldType = () => {
  const { type, name, relations, joins } = props.metadata

  if (type === 'boolean') return 'checkbox'
  if (name === 'deadline' || name === 'nextTime') return 'datepicker'
  if (name === 'questions') return 'findOrAdd'
  if (relations) return 'autocomplete'
  if (joins) return 'multiselect'
  return 'text'
}

// Загрузка опций для выпадающих списков
const loadOptions = async () => {
  const { relations, joins, name } = props.metadata

  if (!relations && !joins) return

  try {
    isLoading.value = true
    const uri = relations ? `${relations}s` : `${MULTISELECT_URI[name]}s`
    const response = await axios.get(`${config.QUESTBOT_API_HOST}/${uri}`, {
      headers: getAuthHeaders(),
    })

    const criteria = relations
      ? RELATION_CRITERIA[relations]
      : RELATION_CRITERIA[MULTISELECT_URI[name]]
    options.value = response.data.map((item) => ({
      name: item[criteria],
      // Сохраняем весь объект для использования в компоненте
      ...item,
    }))

    // Инициализация значения для multiselect
    if (fieldType.value === 'multiselect' && props.editValue) {
      fieldValue.value = options.value.filter((opt) => props.editValue.includes(opt.name))
    }
  } catch (error) {
    console.error('Failed to load options:', error)
  } finally {
    isLoading.value = false
  }
}

// Получение заголовков авторизации
const getAuthHeaders = () => ({
  'Auth-Type': 'web',
  Authorization: `Bearer ${inject('$cookies').get('token')}`,
})

// Обработчик изменения значения
const handleInputChange = (value) => {
  fieldValue.value = value

  // Для autocomplete передаем только имя выбранного элемента
  if (fieldType.value === 'autocomplete') {
    emit('changeInput', props.metadata.name, value?.name || null)
  }
  // Для multiselect передаем массив имен выбранных элементов
  else if (fieldType.value === 'multiselect') {
    emit(
      'changeInput',
      props.metadata.name,
      value.map((v) => v.name),
    )
  }
  // Для остальных типов передаем значение как есть
  else {
    emit('changeInput', props.metadata.name, value)
  }
}

// Инициализация компонента
onMounted(async () => {
  fieldType.value = determineFieldType()

  // Инициализация значения
  if (props.editValue !== null && props.editValue !== undefined) {
    // Для multiselect значение устанавливается после загрузки options
    if (fieldType.value !== 'multiselect') {
      fieldValue.value = props.editValue
    }
  }

  if (['autocomplete', 'multiselect'].includes(fieldType.value)) {
    await loadOptions()
  }
})

const openFindOrAddPopup = (event) => {
  event.preventDefault()
  emit('openFindOrAddPopup')
}
</script>

<template>
  <div class="form-field">
    <!-- Checkbox поле -->
    <input
      v-if="fieldType === 'checkbox'"
      v-model="fieldValue"
      type="checkbox"
      @change="handleInputChange(fieldValue)"
    />

    <!-- Текстовое поле -->
    <input
      v-if="fieldType === 'text'"
      v-model="fieldValue"
      type="text"
      @input="handleInputChange(fieldValue)"
    />

    <!-- Автодополнение -->
    <Multiselect
      v-if="fieldType === 'autocomplete'"
      v-model="fieldValue"
      :options="options"
      :loading="isLoading"
      track-by="name"
      label="name"
      @select="handleInputChange($event)"
      @remove="handleInputChange(null)"
    />

    <!-- Множественный выбор -->
    <Multiselect
      v-if="fieldType === 'multiselect'"
      v-model="fieldValue"
      :multiple="true"
      :options="options"
      :loading="isLoading"
      :close-on-select="false"
      track-by="name"
      label="name"
      @select="handleInputChange(fieldValue)"
      @remove="handleInputChange(fieldValue)"
    />

    <!-- Датапикер -->
    <Datepicker
      v-if="fieldType === 'datepicker'"
      v-model="fieldValue"
      @update:model-value="handleInputChange($event)"
    />

    <!-- Поиск и добавление -->
    <div v-if="fieldType === 'findOrAdd'" class="find-or-add">
      <div class="flex">
        <input v-model="fieldValue" type="text" @keyup.enter="emit('saveQuestion', fieldValue)" />
        <button @click="openFindOrAddPopup">Добавить вопрос</button>
      </div>
      <span>Чтобы добавить введённый вопрос, нажмите Enter</span>
    </div>
  </div>
</template>

<style scoped>
button {
  background-color: var(--color-background-soft);
}

.flex {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>
