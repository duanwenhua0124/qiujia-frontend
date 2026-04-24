import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://qiujia-backend-production-daa4.up.railway.app/api/v1'; // Railway后端API

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
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除登录状态
      AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// 发送验证码
export const sendCode = (phone) => api.post('/auth/send-code', { phone });

// 用户登录
export const login = (phone, code) => api.post('/auth/login', { phone, code });

// 获取用户信息
export const getUserProfile = () => api.get('/user/profile');

// 更新用户信息
export const updateProfile = (data) => api.put('/auth/profile', data);

// 更新头像
export const updateAvatar = (avatar) => api.post('/user/avatar', { avatar });

// 获取今日任务
export const getTodayTasks = () => api.get('/tasks/today');

// 打卡
export const checkin = (taskId, isMakeup = false) => 
  api.post('/tasks/checkin', { task_id: taskId, is_makeup: isMakeup });

// 获取任务统计
export const getTaskStats = () => api.get('/tasks/stats');

// 获取所有任务
export const getAllTasks = () => api.get('/tasks/all');

// 创建自定义任务
export const createCustomTask = (data) => api.post('/tasks/custom', data);

// 获取自定义任务列表
export const getCustomTasks = () => api.get('/tasks/custom');

// 接受自定义任务
export const acceptCustomTask = (taskId) => 
  api.post(`/tasks/custom/${taskId}/accept`);

// 完成自定义任务
export const completeCustomTask = (taskId) => 
  api.post(`/tasks/custom/${taskId}/complete`);

// 获取奖励列表
export const getRewardsList = () => api.get('/rewards');

// 兑换奖励
export const redeemReward = (rewardId) => 
  api.post('/rewards/redeem', { reward_id: rewardId });

// 获取积分历史
export const getPointsHistory = () => api.get('/user/points/history');

// 获取兑换历史
export const getRewardHistory = () => api.get('/rewards/history');

// 上传图片
export const uploadImage = async (uri, type = 'avatar') => {
  const formData = new FormData();
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  });
  formData.append('type', type);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
