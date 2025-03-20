import { createRouter, createWebHistory } from 'vue-router';
import ChannelsPage from '@/views/channels/ChannelsPage.vue';
import CategoriesPage from '@/views/categories/CategoriesPage.vue';
import DashboardPage from '@/views/dashboard/DashboardPage.vue';
import ImportModule from '@/views/import/ImportModule.vue';

const routes = [
  {
    path: '/dashboard',
    name: 'Information',
    component: DashboardPage,
  },
  {
    path: '/channels',
    name: 'Channels',
    component: ChannelsPage,
  },
  {
    path: '/categories',
    name: 'Categories',
    component: CategoriesPage,
  },
  {
    path: '/import',
    name: 'Import',
    component: ImportModule,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;