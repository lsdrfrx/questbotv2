<script setup>
import { defineProps, defineEmits, ref, onMounted, onActivated, onUpdated } from 'vue'
import TableCell from '../components/TableCell.vue'
import FormPopup from '../components/FormPopup.vue'
import axios from "axios"
import { config } from "../config"

const props = defineProps(['tableData', 'name'])
const rows = ref([])
const formHidden = ref(true)
const emit = defineEmits(['redraw'])
const editData = ref([])
const formKey = ref(0)

const getData = (data) => {
  if (data[0] !== undefined && data[0].value !== undefined) {
    const rows = []
    if (data[0].value === null) {
      return rows
    }
    for (let i = 0; i < data[0].value.length; i++) {
      const cells = []
      for (let j = 0; j < data.length; j++) {
        if (data[j].value === undefined || data[j].value === null) cells.push(null)
        else cells.push(data[j].value[i])
      }
      rows.push(cells)
    }
    return rows
  }
}

const openPopup = (event) => {
  redrawForm()
  formHidden.value = false
}

const closePopup = (event) => {
  formHidden.value = true
  emit('redraw')
}

const modifyRow = (row) => {
  editData.value = row
  openPopup()
}

const redrawForm = (event) => {
  formKey.value++
}

const deleteRow = (row) => {
  axios.delete(`${config.QUESTBOT_API_HOST}/${props.name}/${row[0]}`,
  {
    headers: {
      'Auth-Type': 'web',
      Authorization: `Bearer ${$cookies.get('token')}`,
    },
  })
    .then((data) => {
      emit('redraw')
    })
}
</script>

<template>
  <FormPopup
    :columns="props.tableData"
    @closePopup="closePopup"
    :hidden="formHidden"
    :name="props.name"
    :data="editData"
    :key="formKey"
  />
  <button @click="openPopup">Создать</button>
  <div v-if="props.tableData !== undefined">
    <table>
      <thead>
        <tr>
          <TableCell v-for="value in props.tableData" :key="value.id" :cellValue="{ value }" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in getData(props.tableData)" :key="index">
          <TableCell v-for="(value, idx) in row" :key="idx" :cellValue="{ value }" />
          <td>
            <button @click="modifyRow(row)">Модифицировать</button>
          </td>
          <td>
            <button @click="deleteRow(row)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else>Не удалось получить данные</div>
</template>

<style scoped>
button {
  margin-bottom: 10px;
  background-color: var(--color-background);
  color: var(--color-foreground);
  padding: 4px;
  border: 1px solid var(--color-border);
  font-size: 18px;
  transition: all 0.2s ease-in;
}

button:hover {
  color: hsla(160, 100%, 37%, 1);
  border: 1px solid hsla(160, 100%, 37%, 1);
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
</style>
