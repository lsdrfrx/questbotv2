<script setup>
const props = defineProps(['show'])
</script>

<template>
  <div v-if="show" class="bar">
    <button @click="$emit('changeState', 'employees')">Сотрудники</button>
    <button @click="$emit('changeState', 'projects')">Проекты</button>
    <button @click="$emit('changeState', 'quests')">Квесты</button>
    <button @click="$emit('changeState', 'polls')">Опросы</button>
    <button @click="$emit('changeState', 'divisions')">Отделы</button>
    <button @click="$emit('changeState', 'chats')">Чаты</button>
    <button @click="$emit('changeState', 'roles')">Роли</button>
    <button @click="$emit('changeState', 'users')">Пользователи</button>
    <button @click="$emit('changeState', 'preferences')">Настройки</button>
  </div>
</template>

<style scoped>
.bar {
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
  width: fit-content;
  height: calc(100vh - 48px);
  padding: 10px;
  left: 0;
  top: 48px;
  border-right: 1px solid var(--color-border);
}
.bar button {
  font-size: 16px;
  padding: 10px;
  border: 0;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
  transition: 0.2s ease-in all;
  width: 100%;
}

.bar button:hover {
  color: hsla(160, 100%, 37%, 1);
  border-bottom: 1px solid hsla(160, 100%, 37%, 1);
}

button:focus {
  color: hsla(160, 100%, 37%, 1);
  border-bottom: 1px solid hsla(160, 100%, 37%, 1);
}
</style>
