import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING, TASK_ICONS, TIME_PERIODS, TASK_CATEGORIES } from '../utils/theme';

// 任务卡片组件 - 卡通风格
export const TaskCard = ({ task, onCheckin, timePeriod, showAnimation = false, showCategory = false }) => {
  const isCompleted = task.status === 'completed';
  const iconInfo = TASK_ICONS[task.icon] || TASK_ICONS.default;
  
  // 计算总积分
  const totalPoints = task.base_points + (task.extra_points || 0);
  const hasBonus = task.extra_points > 0;

  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      {/* 左侧图标区域 */}
      <View style={[styles.iconContainer, { backgroundColor: iconInfo.color }]}>
        <Text style={styles.iconEmoji}>{iconInfo.emoji}</Text>
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>✓</Text>
          </View>
        )}
      </View>
      
      {/* 中间内容区域 */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.taskName, isCompleted && styles.taskNameCompleted]}>
            {task.name}
          </Text>
          {showCategory && task.category && (
            <View style={[styles.categoryBadge, { backgroundColor: COLORS.categoryColors[task.category] + '20' }]}>
              <Text style={[styles.categoryBadgeText, { color: COLORS.categoryColors[task.category] }]}>
                {TASK_CATEGORIES[task.category]?.label || task.category}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.pointsContainer}>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsIcon}>⭐</Text>
            <Text style={styles.pointsText}>+{totalPoints}</Text>
          </View>
          {hasBonus && (
            <View style={styles.bonusBadge}>
              <Text style={styles.bonusText}>含{task.extra_points}奖励</Text>
            </View>
          )}
        </View>
        {task.checked_at && (
          <Text style={styles.checkTime}>
            完成于 {new Date(task.checked_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
      
      {/* 右侧打卡按钮 */}
      <TouchableOpacity
        style={[
          styles.checkButton,
          isCompleted ? styles.checkButtonCompleted : styles.checkButtonActive
        ]}
        onPress={() => !isCompleted && onCheckin(task)}
        disabled={isCompleted}
        activeOpacity={0.7}
      >
        <Text style={styles.checkButtonText}>
          {isCompleted ? '✓' : '打卡'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// 时间段头部组件
export const TimePeriodHeader = ({ period, tasks, currentPeriod }) => {
  const info = TIME_PERIODS[period] || TIME_PERIODS.morning;
  const isActive = period === currentPeriod;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const allCompleted = completedCount === totalCount && totalCount > 0;
  
  return (
    <View style={[styles.headerContainer, isActive && styles.headerActive]}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerIcon}>{info.icon}</Text>
        <View>
          <Text style={[styles.headerText, isActive && styles.headerTextActive]}>
            {info.label}任务
          </Text>
          <Text style={styles.headerSubText}>{info.subLabel}</Text>
        </View>
      </View>
      
      <View style={styles.headerRight}>
        {allCompleted ? (
          <View style={styles.allCompletedBadge}>
            <Text style={styles.allCompletedText}>全部完成 🎉</Text>
          </View>
        ) : (
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>{completedCount}/{totalCount}</Text>
          </View>
        )}
        {isActive && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>进行中</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// 任务类别头部组件
export const CategoryHeader = ({ category, completed = 0, total = 0 }) => {
  const info = TASK_CATEGORIES[category] || TASK_CATEGORIES.daily;
  const allCompleted = completed === total && total > 0;
  
  return (
    <View style={[styles.categoryHeaderContainer, { borderLeftColor: info.color }]}>
      <View style={styles.categoryHeaderLeft}>
        <Text style={styles.categoryHeaderIcon}>{info.icon}</Text>
        <View>
          <Text style={[styles.categoryHeaderText, { color: info.color }]}>
            {info.label}
          </Text>
          <Text style={styles.categoryHeaderSubText}>{info.description}</Text>
        </View>
      </View>
      
      <View style={styles.categoryHeaderRight}>
        {allCompleted ? (
          <View style={[styles.allCompletedBadge, { backgroundColor: info.color }]}>
            <Text style={styles.allCompletedText}>全部完成 🎉</Text>
          </View>
        ) : (
          <View style={[styles.categoryProgressBadge, { backgroundColor: info.color + '20' }]}>
            <Text style={[styles.categoryProgressText, { color: info.color }]}>
              {completed}/{total}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

// 打卡成功动画提示
export const CheckinSuccessToast = ({ visible, taskName, points, streakBonus = 0 }) => {
  if (!visible) return null;
  
  return (
    <View style={styles.toast}>
      <Text style={styles.toastIcon}>🎉</Text>
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>打卡成功！</Text>
        <Text style={styles.toastText}>{taskName} +{points}积分</Text>
        {streakBonus > 0 && (
          <Text style={styles.toastStreakBonus}>+{streakBonus}连续打卡奖励</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  cardCompleted: {
    opacity: 0.8,
    backgroundColor: '#F5FFFA',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    position: 'relative',
  },
  iconEmoji: {
    fontSize: 32,
  },
  completedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  completedBadgeText: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  taskName: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  taskNameCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textLight,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.small,
    marginLeft: SPACING.sm,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.small,
  },
  pointsIcon: {
    fontSize: 14,
    marginRight: 2,
  },
  pointsText: {
    fontSize: 14,
    color: '#F57C00',
    fontWeight: '600',
  },
  bonusBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.small,
    marginLeft: SPACING.sm,
  },
  bonusText: {
    fontSize: 12,
    color: '#E53935',
    fontWeight: '500',
  },
  checkTime: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  checkButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  checkButtonCompleted: {
    backgroundColor: COLORS.success,
  },
  checkButtonText: {
    color: COLORS.textWhite,
    fontWeight: '700',
    fontSize: 15,
  },
  
  // Header styles
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.medium,
  },
  headerActive: {
    backgroundColor: '#EEF4FF',
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 28,
    marginRight: SPACING.sm,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  headerTextActive: {
    color: COLORS.primary,
  },
  headerSubText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.round,
  },
  progressText: {
    color: COLORS.textWhite,
    fontWeight: '600',
    fontSize: 13,
  },
  allCompletedBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.round,
  },
  allCompletedText: {
    color: COLORS.textWhite,
    fontWeight: '600',
    fontSize: 12,
  },
  currentBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.small,
    marginLeft: SPACING.sm,
  },
  currentBadgeText: {
    color: COLORS.textWhite,
    fontWeight: '600',
    fontSize: 11,
  },

  // Category header styles
  categoryHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.medium,
    borderLeftWidth: 4,
    ...SHADOWS.small,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryHeaderIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  categoryHeaderText: {
    fontSize: 16,
    fontWeight: '700',
  },
  categoryHeaderSubText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 1,
  },
  categoryHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryProgressBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.round,
  },
  categoryProgressText: {
    fontWeight: '600',
    fontSize: 13,
  },

  // Toast styles
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    ...SHADOWS.large,
  },
  toastIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  toastContent: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  toastText: {
    fontSize: 14,
    color: COLORS.textWhite,
    marginTop: 2,
  },
  toastStreakBonus: {
    fontSize: 12,
    color: '#FFE082',
    marginTop: 2,
  },
});
