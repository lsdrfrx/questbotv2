<script lang="jsx" setup>
import { defineProps, ref, inject, onUpdated, onMounted } from 'vue'
import axios from 'axios'
import moment from 'moment'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import { config } from '../config'

const $cookies = inject('$cookies')
const props = defineProps(['metadata'])

const showDatepicker = ref(false)
const showText = ref(false)
const showCheckbox = ref(false)
const showAutocomplete = ref(false)
const showMultiselect = ref(false)

const datepickerData = ref()
const textData = ref()
const checkboxData = ref(props.metadata.defaultValue)
const autocompleteData = ref()
const autocompleteOptions = ref([])
const multiselectData = ref([])
const multiselectOptions = ref([])

const parseMetadata = async (data) => {
  if (data.type === 'boolean') {
    showCheckbox.value = true
  } else if (data.name === 'deadline' || data.name === 'nextTime') {
    showDatepicker.value = true
  } else if (data.relations !== undefined) {
    const options = await axios.get(`${config.QUESTBOT_API_HOST}/${data.relations}s`, {
      headers: {
        'Auth-Type': 'web',
        Authorization: `Bearer ${$cookies.get('token')}`,
      },
    })

    let criteria = ''
    if (data.relations === 'employee') criteria = 'usernameShort'
    else if (data.relations === 'project') criteria = 'projectName'
    else if (data.relations === 'chat') criteria = 'name'
    else if (data.relations === 'role') criteria = 'role'
    else if (data.relations === 'division') criteria = 'name'

    showAutocomplete.value = true
    autocompleteOptions.value = options.data.map((v) => {
      return { name: v[criteria] }
    })
  } else if (data.joins !== undefined) {
    let uri
    if (data.name === 'recepientChats') {
      uri = 'chat'
    }
    if (data.name === 'recepientEmployees') {
      uri = 'employee'
    }
    if (data.name === 'subprojects') {
      uri = 'project'
    }
    const options = await axios.get(`${config.QUESTBOT_API_HOST}/${uri}s`, {
      headers: {
        'Auth-Type': 'web',
        Authorization: `Bearer ${$cookies.get('token')}`,
      },
    })

    let criteria = ''
    if (uri === 'employee') criteria = 'usernameShort'
    else if (uri === 'project') criteria = 'projectName'
    else if (uri === 'chat') criteria = 'name'
    else if (uri === 'role') criteria = 'role'
    else if (uri === 'division') criteria = 'name'

    showMultiselect.value = true
    multiselectOptions.value = options.data.map((v) => {
      return { name: v[criteria] }
    })
  } else if (data.type === 'text' || data.type == 'integer') {
    showText.value = true
  }
}
onMounted(async () => {
  await parseMetadata(props.metadata)
})
</script>

<template>
  <input
    v-model="checkboxData"
    @input="$emit('changeInput', props.metadata.name, checkboxData)"
    v-if="showCheckbox"
    type="checkbox"
    checked="{props.metadata.defaultValue}"
  />
  <input
    v-model="textData"
    @input="$emit('changeInput', props.metadata.name, textData)"
    v-if="showText"
    type="text"
  />
  <Multiselect
    v-model="autocompleteData"
    @select="$emit('changeInput', props.metadata.name, autocompleteData.name)"
    v-if="showAutocomplete"
    :options="autocompleteOptions"
    track-by="name"
    label="name"
    :hidden="!showAutocomplete"
  />
  <Multiselect
    v-model="multiselectData"
    @select="$emit('changeInput', props.metadata.name, autocompleteData.name)"
    v-if="showMultiselect"
    :multiple="true"
    :options="multiselectOptions"
    :close-on-select="false"
    track-by="name"
    label="name"
  />
  <Datepicker
    v-model="datepickerData"
    @text-submit="$emit('changeInput', props.metadata.name, datepickerData)"
    v-if="showDatepicker"
  />
</template>

<style scoped>
input {
  color: var(--color-foreground);
  background-color: var(--color-background-soft);
  border: none;
  border-bottom: 1px solid var(--color-border);
  font-size: 18px;
  outline: none;
  transition: 0.2s all ease-in;
  width: 100%;
}

input:focus {
  border-bottom: 1px solid hsla(160, 100%, 37%, 1);
}

input[type='checkbox'] {
  width: 60px;
}
</style>
