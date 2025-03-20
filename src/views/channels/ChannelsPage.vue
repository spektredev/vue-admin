<template>
  <n-card :bordered="false" title="Управление каналами">
    <n-space justify="start">
      <n-button type="primary" @click="openChannelsPostForm">Создать</n-button>
    </n-space>

    <n-space style="margin-bottom: 16px;">
      <n-select 
        v-model:value="store.sortBy" 
        :options="sortOptions" 
        placeholder="Сортировать по" 
        style="width: 200px;"
        default-value="id"
      />
      <n-select 
        v-model:value="store.sortOrder" 
        :options="orderOptions" 
        placeholder="Порядок" 
        style="width: 200px;"
        default-value="asc"
      />
    </n-space>

    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Описание</th>
          <th>Категория</th>
          <th>Ссылка</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="channel in store.sortedChannels" :key="channel.id">
          <td>{{ channel.id }}</td>
          <td>{{ channel.title }}</td>
          <td>{{ channel.description }}</td>
          <td>{{ categoryName(channel.category) }}</td>
          <td>{{ channel.link }}</td>
          <td>
            <n-button size="small" @click="openChannelEditForm(channel.id)">Редактировать</n-button>
            <n-button size="small" type="error" @click="deleteChannel(channel.id)">Удалить</n-button>
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-card>

  <!-- Модальное окно с формой -->
  <ChannelsPostForm ref="channelsPostFormRef" @channel-added="store.fetchChannels" />
  <ChannelEditForm ref="channelEditFormRef" @channel-updated="store.fetchChannels" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from '@/stores/store';
import { sortOptions, orderOptions } from '@/utils/sort';
import { NCard, NButton, NSpace, NTable, NSelect } from 'naive-ui';
import ChannelsPostForm from '@/components/channels/ChannelsPostForm.vue';
import ChannelEditForm from '@/components/channels/ChannelEditForm.vue';

const store = useStore();

const channelsPostFormRef = ref<InstanceType<typeof ChannelsPostForm> | null>(null);
const channelEditFormRef = ref<InstanceType<typeof ChannelEditForm> | null>(null);


const openChannelsPostForm = () => {
  channelsPostFormRef.value?.openModal();
};

const openChannelEditForm = (id: number) => {
  channelEditFormRef.value?.openModal(id);
};

const deleteChannel = async (id: number) => {
  await store.deleteChannel(id); // Предполагается, что store обновляет состояние
};

const categoryName = (categoryId: number) => {
  return store.categoryMap[categoryId] || 'Неизвестная категория';
};

onMounted(async () => {
  await store.fetchCategories();
  await store.fetchChannels();
});
</script>

<style>
.n-space {
  padding: 12px 0;
}
.n-button {
  margin-right: 10px;
}
</style>