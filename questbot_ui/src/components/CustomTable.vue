<script setup>
import { ref, computed, inject } from 'vue'
import axios from 'axios'
import { config } from '../config'

import TableCell from '../components/TableCell.vue'
import FormPopup from '../components/FormPopup.vue'
import FindOrAddPopup from '../components/FindOrAddPopup.vue'

const $cookies = inject('$cookies')

const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
  name: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['redraw', 'handleInput'])

// Состояния компонента
const showForm = ref(false)
const showFindOrAddPopup = ref(false)
const editData = ref([])
const formKey = ref(0)
const isDeleting = ref(false)
const fieldData = ref({})

// Получение данных таблицы в нужном формате
const tableRows = computed(() => {
  if (!props.tableData?.length || !props.tableData[0]?.value) return []

  return props.tableData[0].value.map((_, rowIndex) =>
    props.tableData.map((column) => column.value?.[rowIndex] ?? null),
  )
})

// Управление попапами
const togglePopup = {
  form: (open = true, data = []) => {
    editData.value = data
    showForm.value = open
    if (open) formKey.value++
    else emit('redraw')
  },
  findOrAdd: (open = true) => {
    showFindOrAddPopup.value = open
    if (!open) formKey.value++
  },
}

// Удаление строки
const deleteRow = async (row) => {
  try {
    isDeleting.value = true
    await axios.delete(`${config.QUESTBOT_API_HOST}/${props.name}/${row[0]}`, {
      headers: {
        'Auth-Type': 'web',
        Authorization: `Bearer ${$cookies.get('token')}`,
      },
    })
  } catch (error) {
    console.error('Ошибка при удалении:', error)
  } finally {
    emit('redraw')
    isDeleting.value = false
  }
}

const handleInput = (event, data) => {
  fieldData.value[event] = data
}
</script>

<template>
  <div class="table-container">
    <button @click="togglePopup.form(true, [])">Создать</button>

    <FormPopup
      v-if="showForm"
      @close="togglePopup.form(false)"
      @openFindOrAddPopup="togglePopup.findOrAdd(true)"
      @handleInput="handleInput"
      :columns="props.tableData"
      :name="props.name"
      :data="editData"
      :key="'form_' + formKey"
      :fieldData="fieldData"
      :findOrAddData="fieldData['findOrAdd']"
    />

    <FindOrAddPopup
      v-if="showFindOrAddPopup"
      @handleInput="handleInput"
      @close="togglePopup.findOrAdd(false)"
      :key="'find_' + formKey"
    />

    <div v-if="props.tableData?.length" class="table-wrapper">
      <table>
        <thead>
          <tr>
            <TableCell
              v-for="column in props.tableData"
              :key="column.id"
              :cellValue="{ value: column }"
            />
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in tableRows" :key="rowIndex">
            <TableCell
              v-for="(value, colIndex) in row"
              :key="`${rowIndex}_${colIndex}`"
              :cellValue="{ value }"
            />
            <td class="actions">
              <button @click="togglePopup.form(true, row)">Изменить</button>
              <button @click="deleteRow(row)" :disabled="isDeleting" class="danger">
                {{ isDeleting ? 'Удаление...' : 'Удалить' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="no-data">Не удалось получить данные</div>
  </div>
</template>

<style scoped>
button {
  margin-bottom: 10px;
}

table {
  border-collapse: collapse;
  font-size: 18px;
}

th,
td {
  border: 1px solid var(--color-border);
  padding: 8px 10px;
}

tbody > tr:nth-of-type(even) {
  background-color: var(--color-background-soft);
}

.table-container {
  width: 100%;
}

.table-wrapper {
  overflow-x: auto;
}

.actions {
  white-space: nowrap;
}

.actions button {
  margin-bottom: 0;
  margin-right: 5px;
}

.danger {
  color: #ff4444;
  border-color: #ff4444;
}

.danger:disabled {
  opacity: 0.6;
}

.no-data {
  padding: 10px;
  text-align: center;
  color: #666;
}
</style>
