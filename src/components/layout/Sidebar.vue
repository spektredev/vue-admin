<script setup lang="ts">
import { NMenu, NConfigProvider } from 'naive-ui';
import { h, ref, watch } from 'vue';
import { TvOutline, Albums, HomeOutline } from '@vicons/ionicons5';
import { useRouter, useRoute } from 'vue-router';
// import importIcon from '@/assets/icons/import.svg';
// import exportIcon from '@/assets/icons/export.svg';
import ImportIcon from '../icons/ImportIcon.vue';
import ExportIcon from '../icons/ExportIcon.vue';


const router = useRouter();
const route = useRoute();

const menuOptions = [
  {
    label: 'Статистика',
    key: 'dashboard',
    icon: () => h(HomeOutline),
  },
  {
    label: 'Каналы',
    key: 'channels',
    icon: () => h(TvOutline),
  },
  {
    label: 'Категории',
    key: 'categories',
    icon: () => h(Albums),
  },
  {
    label: 'Импорт',
    key: 'import',
    icon: () => h(ImportIcon),
  },
  {
    label: 'Экспорт',
    key: 'export',
    icon: () => h(ExportIcon),
  },
];

const themeOverrides = {
  Menu: {
    itemTextColor: 'white',
    itemIconColor: 'white',
    itemTextColorHover: 'black',
    itemIconColorHover: 'black',
    itemTextColorActive: 'black',
    itemIconColorActive: 'black',
    itemColorActive: 'white',
    itemColorActiveHover: 'white',
    itemTextColorActiveHover: 'black',
    itemIconColorActiveHover: 'black',
  },
};

const activeKey = ref<string | null>(null);

const setActiveKeyFromRoute = () => {
  const path = route.path.split('/')[1]; 
  const menuKey = menuOptions.find(option => option.key === path)?.key || null;
  activeKey.value = menuKey;
};

watch(
  () => route.path,
  () => {
    setActiveKeyFromRoute();
  },
  { immediate: true }
);

const handleMenuSelect = (key: string) => {
  router.push(`/${key}`);
};
</script>

<template>
  <div class="sidebar">
    <n-config-provider :theme-overrides="themeOverrides">
      <n-menu
        v-model:value="activeKey"
        :options="menuOptions"
        mode="vertical"
        :collapsed="false"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        accordion
        @update:value="handleMenuSelect"
      />
    </n-config-provider>
  </div>
</template>

<style>
.sidebar {
  position: fixed;
    top: 0;
    width: 250px;
    background-color: #000000;
    z-index: 90000;
    min-height: 100%;
}
</style>