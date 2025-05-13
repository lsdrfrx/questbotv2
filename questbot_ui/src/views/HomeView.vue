<script setup>
import Sidebar from '../components/Sidebar.vue'
import Appbar from '../components/Appbar.vue'
import CustomTable from '../components/CustomTable.vue'
import { ref, onMounted, onUpdated, inject } from 'vue'
import axios from 'axios'
import router from '../router/index'
import { config } from '../config'

const state = ref('employees')
const data = ref([])
const $cookies = inject('$cookies')
const key = ref(0)

const changeState = (event) => {
  console.log(config)
  console.log(config.QUESTBOT_API_HOST)
  axios
    .get(`https://${config.QUESTBOT_API_HOST}:${config.QUESTBOT_API_PORT}/${event}/metadata`, {
      headers: {
        'Auth-Type': 'web',
        Authorization: `Bearer ${$cookies.get('token')}`,
      },
    })
    .then((res) => {
      state.value = event
      return res.data
    })
    .then((resdata) => {
      axios
        .get(`https://${config.QUESTBOT_API_HOST}:${config.QUESTBOT_API_PORT}/${event}`, {
          headers: {
            'Auth-Type': 'web',
            Authorization: `Bearer ${$cookies.get('token')}`,
          },
        })
        .then((res) => {
          state.value = event
          console.log(resdata)
          res.data.forEach((row) => {
            Object.entries(row).forEach((value) => {
              const key = value[0]
              const val = value[1]
              console.log(key, val)
              resdata.filter((v, k, a) => {
                if (v.name === key) {
                  if (resdata[k].value === undefined || resdata[k].value === null)
                    resdata[k].value = []
                  resdata[k].value.push(val)
                }
              })
            })
          })
          data.value = resdata
          key.value++
        })
        .catch((err) => {
          console.log(err)
          if (err.status === 403) {
            router.push('/auth')
          }
        })
    })
    .catch((err) => {
      if (err.status === 403) {
        router.push('/auth')
      }
    })
}

const redraw = () => {
  changeState(state.value)
}

onMounted(() => {
  redraw()
})
</script>

<template>
  <main>
    <Appbar :name="state" />
    <Sidebar @changeState="changeState" />
    <div class="container">
      <CustomTable
        :key="key"
        :tableData="JSON.parse(JSON.stringify(data))"
        :name="state"
        @redraw="redraw"
      />
    </div>
  </main>
</template>

<style scoped>
.container {
  margin-left: 270px;
  margin-top: 100px;
  margin-right: 30px;
}
</style>
