<script setup>
import { defineProps, ref, computed } from 'vue'
import moment from 'moment'

const props = defineProps({
  cellValue: {
    type: Object,
    required: true,
  },
})

const RELATION_CRITERIA = {
  employee: 'usernameShort',
  project: 'projectName',
  chat: 'name',
  role: 'role',
  division: 'name',
  recepientEmployees: 'usernameShort',
  recepientChats: 'name',
}

// Реактивные данные
const classes = ref('')
const showArray = ref(false)
const arrayData = ref([])

// Вычисляемое свойство для отображаемого значения
const displayValue = computed(() => {
  classes.value = ''
  const value = props.cellValue.value

  if (value === null || value === '') {
    classes.value = 'disabled'
    return 'EMPTY'
  }

  if (value.label !== undefined && value.label !== null) {
    return value.label
  }

  if (value.name !== undefined) {
    return value.name
  }

  if (typeof value === 'boolean') {
    return value.toString().toUpperCase()
  }

  if (isRelationObject(value)) {
    return getRelationValue(value)
  }

  if (Array.isArray(value)) {
    processArrayValue(value)
    return ''
  }

  if (isValidDate(value)) {
    return formatDate(value)
  }

  return value
})

// Вспомогательные функции
const isRelationObject = (value) => {
  return (
    typeof value === 'object' &&
    Object.values(RELATION_CRITERIA).some((v) => Object.keys(value).includes(v))
  )
}

const getRelationValue = (value) => {
  const criteria = Object.values(RELATION_CRITERIA).find((v) => Object.keys(value).includes(v))
  return value[criteria]
}

const processArrayValue = (array) => {
  showArray.value = true
  arrayData.value = array.map((item) => {
    return isRelationObject(item) ? getRelationValue(item) : item
  })
}

const isValidDate = (value) => {
  return isNaN(Number(value)) && moment(value).isValid()
}

const formatDate = (value) => {
  return moment(value).format('DD.MM.YYYY, HH:mm')
}
</script>

<template>
  <td :class="classes">
    {{ displayValue }}
    <div v-if="showArray" class="flex">
      <div v-for="(value, index) in arrayData" :key="'chip_' + index" class="chip">
        {{ value }}
      </div>
    </div>
  </td>
</template>

<style scoped>
td {
  height: fit-content;
  min-width: 150px;
}

td:first-child {
  min-width: fit-content;
}

.flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
  white-space: nowrap;
}

.chip {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 4px 10px;
  margin: 4px 0;
  width: fit-content;
}

.disabled {
  color: var(--color-border);
  font-style: italic;
}
</style>
