<script setup>
import { defineProps, ref, h } from 'vue'
import moment from 'moment'

const props = defineProps(['cellValue'])
const classes = ref('')

const parseValue = (value) => {
  classes.value = ''
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
  if (value === true || value === false) {
    return value.toString().toUpperCase()
  }
  if (isNaN(Number(value)) && moment(value).isValid()) {
    return moment(value).format('DD.MM.YYYY, HH:mm')
  }

  return value
}
</script>

<template>
  <td :class="[classes]">
    {{ parseValue(props.cellValue.value) }}
  </td>
</template>

<style scoped></style>
