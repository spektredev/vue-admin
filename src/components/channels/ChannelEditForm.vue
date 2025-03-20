<template>
  <n-modal v-model:show="showModal">
    <n-card
      style="width: 600px"
      title="Редактировать канал"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-form ref="formRef" :model="formData">
        <n-form-item label="Название" path="title">
          <n-input v-model:value="formData.title" placeholder="Введите название канала" />
        </n-form-item>

        <n-form-item label="Описание" path="description">
          <n-input
            v-model:value="formData.description"
            type="textarea"
            placeholder="Введите описание канала"
          />
        </n-form-item>

        <n-form-item label="Категория" path="category">
          <n-select
            v-model:value="formData.category"
            :options="categoryOptions"
            placeholder="Выберите категорию"
          />
        </n-form-item>

        <n-form-item label="Ссылка" path="link">
          <n-input v-model:value="formData.link" placeholder="Введите ссылку на канал" />
        </n-form-item>
      </n-form>

      <n-space justify="end">
        <n-button @click="handleCancel">Отмена</n-button>
        <n-button type="primary" @click="handleSubmit">Сохранить</n-button>
      </n-space>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NModal, NCard, NForm, NFormItem, NInput, NSelect, NSpace, NButton } from 'naive-ui';
import { useStore } from '@/stores/store';
import { api } from '@/services/api';

const emit = defineEmits(['channel-updated']);
const store = useStore();
const showModal = ref(false);

const formData = ref({
  id: 0,
  title: '',
  description: '',
  category: 0,
  link: '',
});

const categoryOptions = ref<{ label: string; value: number }[]>([]);

const openModal = (id: number) => {
  showModal.value = true;
  loadCategories();
  preloadData(id);
};

const handleCancel = () => {
  showModal.value = false;
};

const loadCategories = () => {
  categoryOptions.value = store.categories.map((cat) => ({
    label: cat.title,
    value: cat.id,
  }));
};

const preloadData = async (id: number) => {
  try {
    const channelData = await api.fetchSingleChannel(id);
    formData.value = { ...channelData };
  } catch (error) {
    console.error('Ошибка при загрузке данных', error);
  }
};

const handleSubmit = async () => {
  try {
    await api.updateChannel(formData.value);
    showModal.value = false;
    emit('channel-updated');
  } catch (error) {
    console.error('Ошибка при сохранении канала:', error);
  }
};

defineExpose({ openModal });

onMounted(loadCategories);
</script>
