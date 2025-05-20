<script setup>
import { ref } from 'vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

const props = defineProps(['options'])
const emit = defineEmits(['changeInput', 'close'])

const multiselectData = ref([])

const finishSelect = (event) => {
  emit('changeInput', multiselectData.value)
}
</script>

<template>
  <div @click.self="$emit('close')" class="dim">
    <div class="container">
      <Multiselect
        v-model="multiselectData"
        :multiple="true"
        :options="props.options"
        :close-on-select="false"
        track-by="name"
        label="name"
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
  overflow: auto;
  border-radius: 10px;
  background-color: var(--color-background);
  padding: 30px;
}

button {
  margin: 0 auto;
  color: var(--color-foreground);
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  padding: 8px;
  width: 150px;
  font-size: 18px;
  transition: 0.2s all ease-in;
}
</style>
