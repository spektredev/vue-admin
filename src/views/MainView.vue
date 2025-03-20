<template>
  <div class="container">
    <h1 class="panel-title">Панель управления TgGrow</h1>
    <n-message-provider>
    <router-view></router-view> <!-- Здесь будут отображаться компоненты -->
  </n-message-provider>
  </div>
</template>

<script setup lang="ts">
import { NMessageProvider } from 'naive-ui';
</script>

<style>
.panel-title {
  margin: 0;
  padding: 10px;
}
.container {
  flex: auto;
  height: 100%;
  margin-left: 265px;
  margin-right: 15px;
}
</style>