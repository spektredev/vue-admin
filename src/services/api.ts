import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Channel {
  id: number;
  title: string;
  description: string;
  cat_id: number;
  link: string;
}

export interface CreateChannel {
  title: string;
  description: string;
  cat_id: number;
  link: string;
}

export interface Category {
  id: number;
  title: string;
  description: string;
  link: string;
  cat_image: string;
}

export interface CreateCategory {
  title: string;
  description: string;
  link: string;
  cat_image: string;
}

export interface ChatFullInfo {
  id: number;
  type: string;
  title?: string;
  username?: string;
  is_forum?: boolean;
  accent_color_id?: number;
  max_reaction_count?: number;
  photo?: any;
  active_usernames?: string[];
  birthdate?: any;
  business_intro?: any;
  business_location?: any;
  business_opening_hours?: any;
  personal_chat?: any;
  available_reactions?: any[];
  background_custom_emoji_id?: string;
  profile_accent_color_id?: number;
  profile_background_custom_emoji_id?: string;
  emoji_status_custom_emoji_id?: string;
  emoji_status_expiration_date?: number;
  bio?: string;
  has_private_forwards?: boolean;
  has_restricted_voice_and_video_messages?: boolean;
  join_to_send_messages?: boolean;
  join_by_request?: boolean;
  description?: string;
  invite_link?: string;
  pinned_message?: any;
  permissions?: any;
  can_send_gift?: boolean;
  can_send_paid_media?: boolean;
  slow_mode_delay?: number;
  unrestrict_boost_count?: number;
  message_auto_delete_time?: number;
  has_aggressive_anti_spam_enabled?: boolean;
  has_hidden_members?: boolean;
  has_protected_content?: boolean;
  has_visible_history?: boolean;
  sticker_set_name?: string;
  can_set_sticker_set?: boolean;
  custom_emoji_sticker_set_name?: string;
  linked_chat_id?: number;
  location?: any;
  membersCount?: number;
  [key: string]: any;
}

export const api = {
  async fetchChannels(): Promise<Channel[]> {
    const response = await axios.get<Channel[]>(`${BASE_URL}/channels`);
    return response.data;
  },

  async fetchChannelsPaginated(page: number, limit: number, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): Promise<{ data: Channel[]; total: number }> {
    const response = await axios.get<{ data: Channel[]; total: number }>(`${BASE_URL}/channels/paginated`, {
      params: { page, limit, sortBy, sortOrder },
    });
    return response.data;
  },

  async fetchSingleChannel(id: number): Promise<Channel> {
    const response = await axios.get<Channel>(`${BASE_URL}/channels/${id}`);
    return response.data;
  },

  async deleteChannel(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/channels/${id}`);
  },

  async createChannel(channel: CreateChannel): Promise<Channel> {
    const response = await axios.post<Channel>(`${BASE_URL}/channels`, channel);
    return response.data;
  },

  async updateChannel(channel: Channel): Promise<Channel> {
    const response = await axios.put<Channel>(`${BASE_URL}/channels/${channel.id}`, channel);
    return response.data;
  },

  async fetchCategories(): Promise<Category[]> {
    const response = await axios.get<Category[]>(`${BASE_URL}/categories`);
    return response.data;
  },

  async fetchSingleCategory(id: number): Promise<Category> {
    const response = await axios.get<Category>(`${BASE_URL}/categories/${id}`);
    return response.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/categories/${id}`);
  },

  async createCategory(category: CreateCategory): Promise<Category> {
    const response = await axios.post<Category>(`${BASE_URL}/categories`, category);
    return response.data;
  },

  async updateCategory(category: Category): Promise<Category> {
    const response = await axios.put<Category>(`${BASE_URL}/categories/${category.id}`, category);
    return response.data;
  },

  async uploadCategoryImage(id: number, formData: FormData): Promise<void> {
    const response = await axios.post<Category>(`${BASE_URL}/categories/${id}/upload_image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log(response.data);
  },

  async checkChannel(chatId: string): Promise<ChatFullInfo> {
    const response = await axios.get<ChatFullInfo>(`${BASE_URL}/tgapi/channel/info/${chatId}`);
    return response.data;
  },

  async importChannels(channels: { link: string; cat_id: number }[]) {
    const response = await axios.post(`${BASE_URL}/channels/bulk`, channels);
    return response.data;
  },
};