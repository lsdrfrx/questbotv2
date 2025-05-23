<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { config } from '../config'
import Sidebar from '../components/Sidebar.vue'
import Appbar from '../components/Appbar.vue'
import CustomTable from '../components/CustomTable.vue'

const router = useRouter()

// Состояния компонента
const currentView = ref('employees')
const tableData = ref([])
const componentKey = ref(0)
const fetchError = ref(false)
const isLoading = ref(false)
const showSidebar = ref(false)

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

// Заголовки для API запросов
const apiHeaders = {
  'Auth-Type': 'web',
  Authorization: `Bearer ${inject('$cookies').get('token')}`,
}

// Обработка ошибок API
const handleApiError = (error) => {
  if (error.response?.status === 403) {
    router.push('/auth')
  } else if (error.response?.status === 404) {
    fetchError.value = true
  } else {
    console.error('API Error:', error)
  }
}

// Получение и преобразование данных таблицы
const fetchTableData = async (endpoint) => {
  try {
    isLoading.value = true
    fetchError.value = false

    // Получаем метаданные
    const metadataResponse = await axios.get(`${config.QUESTBOT_API_HOST}/${endpoint}/metadata`, {
      headers: apiHeaders,
    })

    // Получаем данные
    const dataResponse = await axios.get(`${config.QUESTBOT_API_HOST}/${endpoint}`, {
      headers: apiHeaders,
    })

    // Формируем структуру таблицы
    const formattedData = formatTableData(metadataResponse.data, dataResponse.data)

    currentView.value = endpoint
    tableData.value = formattedData
    componentKey.value++
  } catch (error) {
    handleApiError(error)
  } finally {
    isLoading.value = false
  }
}

// Преобразование данных в формат для таблицы
const formatTableData = (metadata, rows) => {
  // Создаем копию метаданных
  const formatted = JSON.parse(JSON.stringify(metadata))

  // Заполняем значения
  rows.forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      const column = formatted.find((col) => col.name === key)
      if (column) {
        column.value = column.value || []
        column.value.push(value)
      }
    })
  })

  return formatted
}

// Обработчик изменения состояния (переключение между разделами)
const handleStateChange = (newState) => {
  fetchTableData(newState)
}

// Обновление данных
const refreshData = () => {
  fetchTableData(currentView.value)
}

// Инициализация компонента
onMounted(() => {
  refreshData()
})
</script>

<template>
  <main>
    <Appbar @toggleSidebar="toggleSidebar" :name="currentView" />
    <div class="container">
      <Sidebar @changeState="handleStateChange" :show="showSidebar" />

      <div class="container">
        <div v-if="isLoading" class="loading-indicator">Загрузка данных...</div>

        <span v-else-if="fetchError" class="error-message"> Не удалось получить данные </span>

        <CustomTable
          v-else
          :key="componentKey"
          :tableData="tableData"
          :name="currentView"
          @redraw="refreshData"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  display: flex;
  margin-top: 48px;
  overflow: hidden;
  gap: 22px;
  margin-right: 12px;
}

.loading-indicator {
  padding: 1rem;
  text-align: center;
  color: #666;
}

.error-message {
  color: #c62828;
  display: block;
  padding: 1rem;
  text-align: center;
}
</style>
