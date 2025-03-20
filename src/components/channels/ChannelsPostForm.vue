<template>
  <n-modal v-model:show="showModal">
    <n-card
      style="width: 600px"
      title="Добавить новый канал"
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
        <n-button type="primary" @click="handleSubmit">Добавить</n-button>
      </n-space>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NModal, NCard, NForm, NFormItem, NInput, NSelect, NSpace, NButton } from 'naive-ui';
import { useStore } from '@/stores/store';
import { api } from '@/services/api';

const emit = defineEmits(['channel-added']);
const store = useStore();
const showModal = ref(false);

const categoryOptions = ref<{ label: string; value: number }[]>([]);

const openModal = () => {
  showModal.value = true;
  loadCategories();
};

const handleCancel = () => {
  showModal.value = false;
};

const formData = ref({
  title: '',
  description: '',
  category: 0,
  link: '',
});

const loadCategories = () => {
  categoryOptions.value = store.categories.map((cat) => ({
    label: cat.title,
    value: cat.id,
  }));
   if (categoryOptions.value.length === 0) {
    categoryOptions.value.push({ label: 'Нет категорий', value: 0 });
  }
  formData.value.category = categoryOptions.value[0].value;
};


const handleSubmit = async () => {
  try {
    await api.createChannel(formData.value);
    showModal.value = false;
    formData.value = {title: '', description: '', category: 0, link: '' };
    emit('channel-added');
  } catch (error) {
    console.error('Ошибка при создании канала:', error);
  }
};

defineExpose({ openModal });

onMounted(loadCategories);
</script>
