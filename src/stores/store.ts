import { defineStore } from 'pinia';
import { api, Channel, Category } from '@/services/api';
import { sortByField } from '@/utils/sort';

export const useStore = defineStore('appstore', {
  state: () => ({
    channels: [] as Channel[],
    categories: [] as Category[], // O(n)
    categoryMap: {} as Record<number, string>, // O(1)
    loading: false,
    sortBy: 'id' as 'id' | 'title',
    sortOrder: 'asc' as 'asc' | 'desc',
  }),

  actions: {
    async fetchChannels() {
      this.loading = true;
      try {
        this.channels = await api.fetchChannels();
        console.log('fetchChannels');
      } catch (error) {
        console.error('Ошибка при загрузке каналов:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      this.loading = true;
      try {
        const categoryList = await api.fetchCategories();
        console.log('fetchCategories');
        this.categories = categoryList;
        this.categoryMap = categoryList.reduce((acc: Record<number, string>, cat: Category) => {
          acc[cat.id] = cat.title; 
          return acc;
        }, {});
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteChannel(id: number) {
      this.loading = true;
      try {
        await api.deleteChannel(id);
        console.log('deleteChannel');
        this.channels = this.channels.filter(channel => channel.id !== id);
      } catch (error) {
        console.error('Ошибка при удалении канала:', error);
      } finally {
        this.loading = false;
      }
    },
    async deleteCategory(id: number) {
      this.loading = true;
      try {
        await api.deleteCategory(id);
        console.log('deleteCategory');
        this.categories = this.categories.filter(category => category.id !== id);
      } catch (error) {
        console.error('Ошибка при удалении категории:', error);
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    sortedChannels: (state) => {
      return sortByField(state.channels, state.sortBy, state.sortOrder);
    },
    sortedCategories: (state) => {
      return sortByField(state.categories, state.sortBy, state.sortOrder);
    },
    getChannelById: (state) => (id: number) => {
      return state.channels.find(channel => channel.id === id) || null;
    },
  },
});