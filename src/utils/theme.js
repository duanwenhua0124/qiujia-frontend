// 卡通风格主题色和样式 - 球家宝贝成长社
export const COLORS = {
  // 主色调 - 蓝色系（适合儿童/家庭）
  primary: '#4A90D9',        // 主蓝色
  primaryLight: '#7AB3ED',   // 浅蓝
  primaryDark: '#2E6BB0',   // 深蓝
  
  // 辅助色 - 粉色系
  secondary: '#FF6B9D',      // 粉红色
  secondaryLight: '#FFB6C1', // 浅粉
  secondaryDark: '#FF4081',  // 深粉
  
  // 强调色
  accent: '#FFD54F',         // 明黄色
  accentOrange: '#FFB74D',   // 橙色
  accentGreen: '#81C784',    // 绿色
  accentPurple: '#BA68C8',   // 紫色
  accentCyan: '#4DD0E1',     // 青色
  
  // 背景色
  background: '#F0F7FF',     // 淡蓝色背景
  card: '#FFFFFF',
  surface: '#FAFCFF',
  
  // 文字色
  textPrimary: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  textWhite: '#FFFFFF',
  
  // 状态色
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // 任务图标背景色（儿童友好配色）
  taskBg: {
    morning: '#FFF3E0',      // 温暖橙黄
    noon: '#E3F2FD',         // 清爽蓝
    evening: '#F3E5F5',      // 柔和紫
  },
  
  // 边框和分隔线
  border: '#E8EEF5',
  divider: '#F0F4F8',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

// 阴影样式
export const SHADOWS = {
  small: {
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
};

// 圆角
export const BORDER_RADIUS = {
  small: 8,
  medium: 12,
  large: 16,
  round: 999,
};

// 间距
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

// 任务图标映射（儿童友好emoji）
export const TASK_ICONS = {
  tooth: { emoji: '🪥', color: '#E3F2FD', label: '刷牙' },
  bowl: { emoji: '🍜', color: '#FFF3E0', label: '洗碗' },
  table: { emoji: '🪑', color: '#E8F5E9', label: '整理餐桌' },
  homework: { emoji: '📚', color: '#FCE4EC', label: '作业' },
  trash: { emoji: '🗑️', color: '#F3E5F5', label: '倒垃圾' },
  mop: { emoji: '🧹', color: '#E0F7FA', label: '拖地' },
  star: { emoji: '⭐', color: '#FFF9E6', label: '奖励' },
  heart: { emoji: '❤️', color: '#FFEBEE', label: '爱心' },
};

// 时间段配置
export const TIME_PERIODS = {
  morning: {
    label: '早上',
    subLabel: '7:00-12:00',
    icon: '☀️',
    gradient: ['#FFD54F', '#FFB74D'],
    color: '#F57C00',
  },
  noon: {
    label: '中午',
    subLabel: '12:00-18:00',
    icon: '🌤️',
    gradient: ['#90CAF9', '#64B5F6'],
    color: '#1976D2',
  },
  evening: {
    label: '晚上',
    subLabel: '18:00-24:00',
    icon: '🌙',
    gradient: ['#CE93D8', '#BA68C8'],
    color: '#7B1FA2',
  },
};

// APP主题配置
export const APP_THEME = {
  name: '球家宝贝成长社',
  logo: '🏀',
  mascot: '🏀',  // 篮球作为吉祥物
  version: '1.0.0',
};
