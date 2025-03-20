<template>
  <div class="app-container">
    <Sidebar />
    <MainView />
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/layout/Sidebar.vue';
import MainView from '@/views/MainView.vue';
</script>

<style>
.app-container {
  display: flex;
}
</style>