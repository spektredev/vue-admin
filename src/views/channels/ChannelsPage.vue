<template>
  <n-card :bordered="false" title="Управление каналами">
    <n-space justify="start">
      <n-button type="primary" @click="openChannelsPostForm">Создать</n-button>
    </n-space>

    <n-space style="margin-bottom: 16px;">
      <n-select 
        v-model:value="sortBy" 
        :options="sortOptions" 
        placeholder="Сортировать по" 
        style="width: 200px;"
        default-value="id"
      />
      <n-select 
        v-model:value="sortOrder" 
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
        <tr v-for="channel in channels" :key="channel.id">
          <td>{{ channel.id }}</td>
          <td>{{ channel.title }}</td>
          <td>{{ channel.description }}</td>
          <td>{{ categoryName(channel.cat_id) }}</td>
          <td>{{ channel.link }}</td>
          <td>
            <n-button size="small" @click="openChannelEditForm(channel.id)">Редактировать</n-button>
            <n-button size="small" type="error" @click="deleteChannel(channel.id)">Удалить</n-button>
          </td>
        </tr>
      </tbody>
    </n-table>

    <!-- Пагинация -->
    <n-pagination
      v-if="total > 0"
      v-model:page="currentPage"
      :page-size="pageSize"
      :item-count="total"
      @update:page="fetchChannels"
      style="margin-top: 16px;"
    />

    <!-- Модальное окно с формой -->
    <ChannelsPostForm ref="channelsPostFormRef" @channel-added="fetchChannels" />
    <ChannelEditForm ref="channelEditFormRef" @channel-updated="fetchChannels" />
  </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useStore } from '@/stores/store';
import { sortOptions, orderOptions } from '@/utils/sort';
import { NCard, NButton, NSpace, NTable, NSelect, NPagination, useMessage } from 'naive-ui';
import ChannelsPostForm from '@/components/channels/ChannelsPostForm.vue';
import ChannelEditForm from '@/components/channels/ChannelEditForm.vue';
import { api, Channel } from '@/services/api';

const message = useMessage();
const store = useStore();

// Локальное состояние для пагинации и каналов
const channels = ref<Channel[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// Локальное состояние для сортировки
const sortBy = ref('id');
const sortOrder = ref<'asc' | 'desc'>('asc');

// Ссылки на модальные окна
const channelsPostFormRef = ref<InstanceType<typeof ChannelsPostForm> | null>(null);
const channelEditFormRef = ref<InstanceType<typeof ChannelEditForm> | null>(null);

// Загрузка каналов с пагинацией
const fetchChannels = async () => {
  try {
    const response = await api.fetchChannelsPaginated(
      currentPage.value,
      pageSize.value,
      sortBy.value,
      sortOrder.value.toUpperCase() as 'ASC' | 'DESC'
    );
    channels.value = response.data;
    total.value = response.total;
  } catch (error) {
    message.error('Ошибка при загрузке каналов');
    console.error(error);
  }
};

// Открытие модальных окон
const openChannelsPostForm = () => {
  channelsPostFormRef.value?.openModal();
};

const openChannelEditForm = (id: number) => {
  channelEditFormRef.value?.openModal(id);
};

// Удаление канала
const deleteChannel = async (id: number) => {
  try {
    await api.deleteChannel(id);
    message.success('Канал удалён');
    fetchChannels(); // Обновляем список после удаления
  } catch (error) {
    message.error('Ошибка при удалении канала');
    console.error(error);
  }
};

// Получение названия категории
const categoryName = (categoryId: number) => {
  return store.categoryMap[categoryId] || 'Неизвестная категория';
};

// Загружаем категории и каналы при монтировании
onMounted(async () => {
  await store.fetchCategories(); // Загружаем категории в store
  await fetchChannels(); // Загружаем каналы с пагинацией
});

// Следим за изменением параметров сортировки
watch([sortBy, sortOrder], () => {
  fetchChannels(); // Обновляем список при изменении сортировки
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