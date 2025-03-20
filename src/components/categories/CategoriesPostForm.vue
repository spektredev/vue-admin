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
        <n-button type="primary" @click="handleSubmit">Добавить</n-button>
      </n-space>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NModal, NCard, NForm, NFormItem, NInput, NSpace, NButton } from 'naive-ui';
import { api } from '@/services/api';

const emit = defineEmits(['category-added']);

const showModal = ref(false);

const formData = ref({
  title: '',
  description: '',
  link: '',
  cat_image: '',
});

const selectedFile = ref<File | null>(null);

const openModal = () => {
  showModal.value = true;
};

const handleCancel = () => {
  showModal.value = false;
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selectedFile.value = target.files?.[0] || null;
};

const handleSubmit = async () => {
  try {

    const newCategory = await api.createCategory(formData.value);

    if (selectedFile.value && newCategory.id) {
      const uploadData = new FormData();
      uploadData.append('file', selectedFile.value);
      await api.uploadCategoryImage(newCategory.id, uploadData);
    }

    showModal.value = false;
    formData.value = { title: '', description: '', link: '', cat_image: '' };
    selectedFile.value = null;

    emit('category-added');
  } catch (error) {
    console.error('Ошибка при добавлении категории:', error);
  }
};

defineExpose({ openModal });
</script>
