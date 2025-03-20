<template>
  <n-modal v-model:show="showModal">
    <n-card
      style="width: 600px"
      title="Добавить новую категорию"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-form ref="formRef" :model="formData">
        <n-form-item label="Название" path="title">
          <n-input v-model:value="formData.title" placeholder="Введите название категории" />
        </n-form-item>

        <n-form-item label="Описание" path="description">
          <n-input
            v-model:value="formData.description"
            type="textarea"
            placeholder="Введите описание категории"
          />
        </n-form-item>

        <n-form-item label="Ссылка" path="link">
          <n-input v-model:value="formData.link" placeholder="Введите ссылку" />
        </n-form-item>

        <n-form-item label="Изображение">
          <input type="file" @change="handleFileSelect" />
        </n-form-item>
      </n-form>

      <n-space justify="end">
        <n-button @click="handleCancel">Отмена</n-button>
        <n-button type="primary" @click="handleSubmit">
          Сохранить
        </n-button>
      </n-space>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { NModal, NCard, NForm, NFormItem, NInput, NSpace, NButton } from 'naive-ui';
import { api } from '@/services/api';

const emit = defineEmits(['category-updated']);

const showModal = ref(false);

const formData = ref({
  id: 0, 
  title: '',
  description: '',
  link: '',
  cat_image: ''
});

const selectedFile = ref<File | null>(null);

const openModal = (id: number | null = null) => {
  showModal.value = true;
  if (id) {
    preloadData(id);
  } else {
    console.log('undefined id');   
  }
};

const handleCancel = () => {
  showModal.value = false;
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selectedFile.value = target.files?.[0] || null;
};

const preloadData = async (id: number) => {
  try {
    const categoryData = await api.fetchSingleCategory(id);
    formData.value = {
      id: categoryData.id,
      title: categoryData.title,
      description: categoryData.description,
      link: categoryData.link,
      cat_image: categoryData.cat_image
    };
  } catch (error) {
    console.error('Ошибка при загрузке данных', error);
  }
};

const handleSubmit = async () => {
  try {
    if (formData.value.id) {
      await api.updateCategory(formData.value);
    } else {
      console.log('undefined id');
    }
    if (selectedFile.value && formData.value.id) {
      const uploadData = new FormData();
      uploadData.append('file', selectedFile.value);
      await api.uploadCategoryImage(formData.value.id, uploadData);
    }
    showModal.value = false;
    formData.value = { id: 0, title: '', description: '', link: '', cat_image: '' };
    selectedFile.value = null;

    emit('category-updated');
  } catch (error) {
    console.error('Ошибка при сохранении категории:', error);
  }
};

defineExpose({ openModal });
</script>