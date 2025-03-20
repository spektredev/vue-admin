<template>
  <n-card :bordered="false" title="Управление категориями">
    <n-space justify="start">
      <n-button type="primary" @click="openCategoriesPostForm">Создать</n-button>
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
          <th>Ссылка</th>
          <th>Изображение</th>
          <th>Выбрать изображение</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in store.sortedCategories" :key="category.id">
          <td>{{ category.id }}</td>
          <td>{{ category.title }}</td>
          <td>{{ category.description }}</td>
          <td>{{ category.link || 'Пусто' }}</td>
          <td>
            <template v-if="category.cat_image">
              <img :src="`http://localhost:3000${category.cat_image}`" alt="Category Image" style="max-width: 100px;" />
            </template>
            <span v-else>Пусто</span>
          </td>
          <td>
            <input type="file" accept=".jpg,.jpeg,.png,.webp" @change="(event) => handleFileSelect(event, category.id)" />
            <n-button type="success" size="small" @click="uploadFile(category.id)" :disabled="!selectedFiles[category.id]">
              Загрузить
            </n-button>
          </td>
          <td>
            <n-button size="small" @click="openCategoryEditForm(category.id)">Редактировать</n-button>
            <n-button size="small" type="error" @click="deleteCategory(category.id)">Удалить</n-button>
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-card>

  <CategoriesPostForm ref="postFormRef" @category-added="store.fetchCategories" />
  <CategoryEditForm ref="editFormRef" @category-updated="store.fetchCategories" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from '@/stores/store';
import { api } from '@/services/api';
import { sortOptions, orderOptions } from '@/utils/sort';
import { NCard, NButton, NSpace, NTable, NSelect } from 'naive-ui';
import CategoriesPostForm from '@/components/categories/CategoriesPostForm.vue';
import CategoryEditForm from '@/components/categories/CategoryEditForm.vue';

const store = useStore();

const postFormRef = ref<InstanceType<typeof CategoriesPostForm> | null>(null);
const editFormRef = ref<InstanceType<typeof CategoryEditForm> | null>(null);

const selectedFiles = ref<{ [key: number]: File | null }>({});

const openCategoriesPostForm = () => {
  postFormRef.value?.openModal();
};

const openCategoryEditForm = (id: number) => {
  editFormRef.value?.openModal(id);
};

const deleteCategory = async (id: number) => {
  await store.deleteCategory(id);
}

const handleFileSelect = (event: Event, id: number) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  selectedFiles.value[id] = file;
};

const uploadFile = async (id: number) => {
  const file = selectedFiles.value[id];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  await api.uploadCategoryImage(id, formData);
  await store.fetchCategories();
  selectedFiles.value[id] = null;
};

onMounted(async () => {
  await store.fetchCategories();
});
</script>
