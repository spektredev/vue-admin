<template>
  <n-card :bordered="true" title="Проверка подключения к базе данных">
    <div style="display: flex; gap: 1em;">
      <span>STATUS: </span>
      <template v-if="store.channels.length">
        <div style="color: green;">OK</div>
      </template>
      <span style="color: red;" v-else>ERROR</span>
    </div>
    <div>Всего каналов в бд: {{ store.channels.length }}</div>
    <div>Всего категорий в бд: {{ store.categories.length }}</div>

    <!-- Новый функционал -->
    <n-divider title-placement="left">Проверка канала</n-divider>
    <n-form ref="formRef" :model="formData">
      <n-form-item label="ID канала" path="chatId">
        <n-input
          v-model:value="formData.chatId"
          placeholder="Введите chat_id (например, @username или числовой ID)"
        />
      </n-form-item>
    </n-form>
    <n-button type="primary" @click="checkChannel" :loading="loading">Проверить</n-button>

    <!-- Результат или ошибка -->
    <n-alert
      v-if="channelResult !== null"
      :type="resultType"
      :title="resultTitle"
      style="margin-top: 16px;"
    >
      <template v-if="isChatFullInfo(channelResult)">
        <p><strong>ID:</strong> {{ channelResult.id }}</p>
        <p><strong>Тип:</strong> {{ channelResult.type }}</p>
        <p><strong>Количество участников:</strong> {{ channelResult.membersCount ?? 'Не удалось получить' }}</p>
        <p><strong>Название:</strong> {{ channelResult.title ?? 'Не указано' }}</p>
        <p><strong>Username:</strong> {{ channelResult.username ?? 'Не указано' }}</p>
        <p><strong>Является форумом:</strong> {{ channelResult.is_forum ? 'Да' : 'Нет' }}</p>
        <p><strong>ID цвета акцента:</strong> {{ channelResult.accent_color_id ?? 'Не указано' }}</p>
        <p><strong>Макс. количество реакций:</strong> {{ channelResult.max_reaction_count ?? 'Не указано' }}</p>
        <p><strong>Фото:</strong> {{ channelResult.photo ? JSON.stringify(channelResult.photo) : 'Не указано' }}</p>
        <p><strong>Активные username:</strong> {{ channelResult.active_usernames?.join(', ') ?? 'Не указано' }}</p>
        <p><strong>Дата рождения:</strong> {{ channelResult.birthdate ? JSON.stringify(channelResult.birthdate) : 'Не указано' }}</p>
        <p><strong>Интро бизнеса:</strong> {{ channelResult.business_intro ? JSON.stringify(channelResult.business_intro) : 'Не указано' }}</p>
        <p><strong>Расположение бизнеса:</strong> {{ channelResult.business_location ? JSON.stringify(channelResult.business_location) : 'Не указано' }}</p>
        <p><strong>Часы работы бизнеса:</strong> {{ channelResult.business_opening_hours ? JSON.stringify(channelResult.business_opening_hours) : 'Не указано' }}</p>
        <p><strong>Личный чат:</strong> {{ channelResult.personal_chat ? JSON.stringify(channelResult.personal_chat) : 'Не указано' }}</p>
        <p><strong>Доступные реакции:</strong> {{ channelResult.available_reactions ? JSON.stringify(channelResult.available_reactions) : 'Не указано' }}</p>
        <p><strong>ID кастомного эмодзи фона:</strong> {{ channelResult.background_custom_emoji_id ?? 'Не указано' }}</p>
        <p><strong>ID цвета профиля:</strong> {{ channelResult.profile_accent_color_id ?? 'Не указано' }}</p>
        <p><strong>ID кастомного эмодзи профиля:</strong> {{ channelResult.profile_background_custom_emoji_id ?? 'Не указано' }}</p>
        <p><strong>ID статуса эмодзи:</strong> {{ channelResult.emoji_status_custom_emoji_id ?? 'Не указано' }}</p>
        <p><strong>Срок действия статуса эмодзи:</strong> {{ channelResult.emoji_status_expiration_date ?? 'Не указано' }}</p>
        <p><strong>Био:</strong> {{ channelResult.bio ?? 'Не указано' }}</p>
        <p><strong>Приватные пересылки:</strong> {{ channelResult.has_private_forwards ? 'Да' : 'Нет' }}</p>
        <p><strong>Ограничения на голос/видео:</strong> {{ channelResult.has_restricted_voice_and_video_messages ? 'Да' : 'Нет' }}</p>
        <p><strong>Требуется вступление:</strong> {{ channelResult.join_to_send_messages ? 'Да' : 'Нет' }}</p>
        <p><strong>Требуется подтверждение:</strong> {{ channelResult.join_by_request ? 'Да' : 'Нет' }}</p>
        <p><strong>Описание:</strong> {{ channelResult.description ?? 'Не указано' }}</p>
        <p><strong>Пригласительная ссылка:</strong> {{ channelResult.invite_link ?? 'Не указано' }}</p>
        <p><strong>Закреплённое сообщение:</strong> {{ channelResult.pinned_message ? JSON.stringify(channelResult.pinned_message) : 'Не указано' }}</p>
        <p><strong>Разрешения:</strong> {{ channelResult.permissions ? JSON.stringify(channelResult.permissions) : 'Не указано' }}</p>
        <p><strong>Можно отправлять подарки:</strong> {{ channelResult.can_send_gift ? 'Да' : 'Нет' }}</p>
        <p><strong>Можно отправлять платные медиа:</strong> {{ channelResult.can_send_paid_media ? 'Да' : 'Нет' }}</p>
        <p><strong>Задержка медленного режима:</strong> {{ channelResult.slow_mode_delay ?? 'Не указано' }} сек.</p>
        <p><strong>Бустов для снятия ограничений:</strong> {{ channelResult.unrestrict_boost_count ?? 'Не указано' }}</p>
        <p><strong>Время автоделита:</strong> {{ channelResult.message_auto_delete_time ?? 'Не указано' }} сек.</p>
        <p><strong>Агрессивный антиспам:</strong> {{ channelResult.has_aggressive_anti_spam_enabled ? 'Да' : 'Нет' }}</p>
        <p><strong>Скрытые участники:</strong> {{ channelResult.has_hidden_members ? 'Да' : 'Нет' }}</p>
        <p><strong>Защищённый контент:</strong> {{ channelResult.has_protected_content ? 'Да' : 'Нет' }}</p>
        <p><strong>Видимая история:</strong> {{ channelResult.has_visible_history ? 'Да' : 'Нет' }}</p>
        <p><strong>Название набора стикеров:</strong> {{ channelResult.sticker_set_name ?? 'Не указано' }}</p>
        <p><strong>Можно менять набор стикеров:</strong> {{ channelResult.can_set_sticker_set ? 'Да' : 'Нет' }}</p>
        <p><strong>Название набора кастомных эмодзи:</strong> {{ channelResult.custom_emoji_sticker_set_name ?? 'Не указано' }}</p>
        <p><strong>ID связанного чата:</strong> {{ channelResult.linked_chat_id ?? 'Не указано' }}</p>
        <p><strong>Расположение:</strong> {{ channelResult.location ? JSON.stringify(channelResult.location) : 'Не указано' }}</p>
      </template>
      <template v-else>
        {{ channelResult }}
      </template>
    </n-alert>
  </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NCard, NForm, NFormItem, NInput, NButton, NDivider, NAlert } from 'naive-ui';
import { useStore } from '@/stores/store';
import { api, ChatFullInfo } from '@/services/api'; // Импортируем api и ChatFullInfo

const store = useStore();
const formRef = ref();
const formData = ref({ chatId: '' });
const loading = ref(false);
const channelResult = ref<string | ChatFullInfo | null>(null);
const resultType = ref<'success' | 'error'>('success');
const resultTitle = ref('Результат проверки');

// Функция для проверки типа
const isChatFullInfo = (obj: any): obj is ChatFullInfo => {
  return obj && typeof obj.id === 'number' && typeof obj.type === 'string';
};

const checkChannel = async () => {
  const chatId = formData.value.chatId.trim();
  if (!chatId) {
    channelResult.value = 'Пожалуйста, введите chat_id.';
    resultType.value = 'error';
    resultTitle.value = 'Ошибка';
    return;
  }
  if (!/^-?\d+$|^@[\w\d_]+$/.test(chatId)) {
    channelResult.value = 'Неверный формат chat_id (должен быть @username или числовой ID).';
    resultType.value = 'error';
    resultTitle.value = 'Ошибка';
    return;
  }

  loading.value = true;
  channelResult.value = null;

  try {
    const result = await api.checkChannel(chatId);
    channelResult.value = result;
    resultType.value = 'success';
    resultTitle.value = 'Успешно';
  } catch (error: any) {
    channelResult.value = error.response?.data?.message || 'Произошла ошибка.';
    resultType.value = 'error';
    resultTitle.value = 'Ошибка';
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await store.fetchChannels();
  await store.fetchCategories();
});
</script>