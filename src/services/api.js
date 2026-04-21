import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://your-api-domain.com/api/v1'; // 替换为实际API地址

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除本地存储
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ============ 认证相关 ============

// 发送验证码
export const sendCode = (phone) => api.post('/auth/send-code', { phone });

// 验证码登录
export const login = (phone, code) => api.post('/auth/login', { phone, code });

// 更新用户资料
export const updateProfile = (data) => api.put('/auth/profile', data);

// ============ 用户相关 ============

// 获取用户信息
export const getUserProfile = () => api.get('/user/profile');

// 更新头像
export const updateAvatar = (avatar) => api.post('/user/avatar', { avatar });

// ============ 任务相关 ============

// 获取今日任务
export const getTodayTasks = () => api.get('/tasks/today');

// 任务打卡
export const checkin = (taskId) => api.post('/tasks/checkin', { task_id: taskId });

// 创建自定义任务
export const createCustomTask = (data) => api.post('/tasks/custom', data);

// 获取自定义任务列表
export const getCustomTasks = (params) => api.get('/tasks/custom', { params });

// 接取自定义任务
export const acceptCustomTask = (taskId) => api.post(`/tasks/custom/${taskId}/accept`);

// 完成自定义任务
export const completeCustomTask = (taskId) => api.post(`/tasks/custom/${taskId}/complete`);

// 取消自定义任务
export const cancelCustomTask = (taskId) => api.post(`/tasks/custom/${taskId}/cancel`);

// ============ 积分相关 ============

// 获取积分记录
export const getPointsHistory = (params) => api.get('/points/history', { params });

// ============ 管理端 ============

// 获取用户列表
export const getAdminUsers = (params) => api.get('/admin/users', { params });

// 获取用户详情
export const getAdminUserDetail = (userId) => api.get(`/admin/users/${userId}`);

// 调整用户积分
export const adjustUserPoints = (userId, amount, reason) => 
  api.post(`/admin/users/${userId}/adjust-points`, { amount, reason });

export default api;
