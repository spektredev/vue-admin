<template>
  <div class="import-module">
    <n-card title="Импорт каналов" :bordered="false" class="card">
      <n-space vertical>
        <n-upload
          accept=".xlsx"
          :max="1"
          :file-list="fileList"
          @update:file-list="handleFileUpload"
          :default-file-list="[]"
        >
          <n-button type="default" dashed>
            <template #icon>
              <n-icon><upload-icon /></n-icon>
            </template>
            Выберите файл
          </n-button>
        </n-upload>
        <n-button
          type="primary"
          @click="importChannels"
          :disabled="!channels.length"
          :loading="importing"
        >
          Импортировать
        </n-button>
        <n-progress
          v-if="importing"
          type="line"
          :percentage="progress"
          :show-indicator="true"
          status="info"
        />
        <n-alert
          v-if="error"
          type="error"
          title="Ошибка"
          :show-icon="true"
          closable
          @close="error = ''"
        >
          {{ error }}
        </n-alert>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UploadFileInfo, useMessage } from 'naive-ui';
import * as XLSX from 'xlsx';
import { api } from '@/services/api';
import {
  NCard,
  NSpace,
  NUpload,
  NButton,
  NAlert,
  NIcon,
  NProgress,
} from 'naive-ui';
import { CloudUploadOutline as UploadIcon } from '@vicons/ionicons5';

const message = useMessage();
const fileList = ref<UploadFileInfo[]>([]);
const channels = ref<{ link: string; cat_id: number }[]>([]);
const error = ref<string>('');
const importing = ref(false);
const progress = ref(0);

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const handleFileUpload = (files: UploadFileInfo[]) => {
  if (files.length > 0) {
    const file = files[0].file;
    if (!file) return;

    fileList.value = files;
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('Нет данных');

        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        channels.value = json
          .map((row: any) => ({
            link: row.link?.toString().trim(),
            cat_id: parseInt(row.cat_id, 10),
          }))
          .filter(
            (channel) =>
              channel.link &&
              // isValidUrl(channel.link) && // Добавляем валидацию URL
              !isNaN(channel.cat_id) &&
              channel.cat_id !== undefined
          );

        if (!channels.value.length) {
          error.value = 'Файл пуст или содержит некорректные данные';
          fileList.value = [];
        } else {
          error.value = '';
        }
      } catch (err) {
        error.value = 'Ошибка при чтении файла: ' + (err as Error).message;
        fileList.value = [];
      }
    };

    reader.onerror = () => {
      error.value = 'Ошибка при загрузке файла';
      fileList.value = [];
    };

    reader.readAsBinaryString(file);
  } else {
    channels.value = [];
    fileList.value = [];
  }
};

const importChannels = async () => {
  if (!channels.value.length) return;

  importing.value = true;
  progress.value = 0;

  try {
    const chunkSize = 1000; // Отправляем по 1000 записей за раз
    const total = channels.value.length;

    for (let i = 0; i < total; i += chunkSize) {
      const chunk = channels.value.slice(i, i + chunkSize);
      await api.importChannels(chunk);
      progress.value = Math.round(((i + chunkSize) / total) * 100);
    }

    channels.value = [];
    fileList.value = [];
    error.value = '';
    message.success('Каналы успешно импортированы');
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Ошибка при импорте каналов';
  } finally {
    importing.value = false;
    progress.value = 0;
  }
};
</script>

<style scoped>
.import-module {
  margin: 20px auto;
}

.card {
  background-color: #fafafa;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>