import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING, APP_THEME } from '../utils/theme';

// 积分徽章组件
export const PointsBadge = ({ points, size = 'medium', showIcon = true }) => {
  return (
    <View style={[styles.badge, styles[`badge_${size}`]]}>
      {showIcon && <Text style={styles.badgeIcon}>⭐</Text>}
      <Text style={[styles.badgeText, styles[`badgeText_${size}`]]}>{points}</Text>
    </View>
  );
};

// 积分展示卡片（用于首页）
export const PointsCard = ({ points, totalPoints, onPress, compact = false }) => {
  if (compact) {
    return (
      <TouchableOpacity style={styles.pointsCardCompact} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.pointsCardCompactLeft}>
          <Text style={styles.pointsCardCompactIcon}>⭐</Text>
          <View>
            <Text style={styles.pointsCardCompactValue}>{points}</Text>
            <Text style={styles.pointsCardCompactLabel}>当前积分</Text>
          </View>
        </View>
        <Text style={styles.pointsCardCompactArrow}>→</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.pointsCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.pointsCardHeader}>
        <Text style={styles.pointsCardTitle}>我的积分</Text>
        <Text style={styles.pointsCardIcon}>🏆</Text>
      </View>
      <View style={styles.pointsCardBody}>
        <Text style={styles.pointsValue}>{points}</Text>
        <Text style={styles.pointsLabel}>当前积分</Text>
      </View>
      <View style={styles.pointsCardFooter}>
        <View style={styles.totalPointsContainer}>
          <Text style={styles.totalPointsLabel}>历史总积分</Text>
          <Text style={styles.totalPointsValue}>{totalPoints}</Text>
        </View>
        <Text style={styles.pointsCardArrow}>→</Text>
      </View>
    </TouchableOpacity>
  );
};

// 连续打卡徽章
export const StreakBadge = ({ streak = 0, maxStreak = 0, onPress }) => {
  const getStreakColor = () => {
    if (streak >= 30) return '#FFD700';
    if (streak >= 7) return '#FF9800';
    if (streak >= 3) return '#4CAF50';
    return COLORS.primary;
  };

  const getStreakIcon = () => {
    if (streak >= 30) return '🔥';
    if (streak >= 7) return '💪';
    if (streak >= 3) return '✨';
    return '📅';
  };

  return (
    <TouchableOpacity style={[styles.streakBadge, { backgroundColor: getStreakColor() }]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.streakIcon}>{getStreakIcon()}</Text>
      <View style={styles.streakContent}>
        <Text style={styles.streakValue}>{streak}</Text>
        <Text style={styles.streakLabel}>连续打卡</Text>
      </View>
      {maxStreak > 0 && (
        <View style={styles.streakMaxContainer}>
          <Text style={styles.streakMaxLabel}>最高</Text>
          <Text style={styles.streakMaxValue}>{maxStreak}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// 用户头像组件
export const UserAvatar = ({ 
  avatar, 
  nickname, 
  size = 'medium', 
  showBadge = false,
  badgeCount,
  onPress 
}) => {
  const sizeMap = {
    small: 36,
    medium: 56,
    large: 88,
  };
  
  const avatarSize = sizeMap[size] || 56;
  
  return (
    <TouchableOpacity 
      style={styles.avatarContainer} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.avatar, styles[`avatar_${size}`], { width: avatarSize, height: avatarSize }]}>
        {avatar ? (
          <View style={styles.avatarImage} />
        ) : (
          <Text style={[styles.avatarText, { fontSize: avatarSize * 0.4 }]}>
            {nickname?.charAt(0) || '🏀'}
          </Text>
        )}
      </View>
      {showBadge && badgeCount !== undefined && badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeCount}>{badgeCount > 99 ? '99+' : badgeCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// 空状态组件
export const EmptyState = ({ icon = '📭', title, message, actionText, onAction }) => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
      {actionText && onAction && (
        <TouchableOpacity style={styles.emptyAction} onPress={onAction}>
          <Text style={styles.emptyActionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// 加载状态组件
export const LoadingState = ({ message = '加载中...' }) => {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingIcon}>🏀</Text>
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

// 吉祥物组件
export const Mascot = ({ size = 'medium', message }) => {
  const sizes = {
    small: 48,
    medium: 80,
    large: 120,
  };
  
  return (
    <View style={styles.mascotContainer}>
      <Text style={[styles.mascotEmoji, { fontSize: sizes[size] }]}>
        {APP_THEME.mascot}
      </Text>
      {message && (
        <View style={styles.mascotBubble}>
          <Text style={styles.mascotBubbleText}>{message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // PointsBadge styles
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badge_small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badge_medium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badge_large: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  badgeIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  badgeText: {
    color: '#F57C00',
    fontWeight: '700',
  },
  badgeText_small: {
    fontSize: 14,
  },
  badgeText_medium: {
    fontSize: 16,
  },
  badgeText_large: {
    fontSize: 20,
  },
  
  // PointsCard styles
  pointsCard: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.xl,
    marginRight: SPACING.md,
    ...SHADOWS.medium,
  },
  pointsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  pointsCardTitle: {
    color: COLORS.textWhite,
    fontSize: 15,
    opacity: 0.9,
  },
  pointsCardIcon: {
    fontSize: 24,
  },
  pointsCardBody: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  pointsValue: {
    color: COLORS.textWhite,
    fontSize: 48,
    fontWeight: '800',
  },
  pointsLabel: {
    color: COLORS.textWhite,
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  pointsCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
  },
  totalPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalPointsLabel: {
    color: COLORS.textWhite,
    fontSize: 13,
    opacity: 0.9,
    marginRight: SPACING.sm,
  },
  totalPointsValue: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
  pointsCardArrow: {
    color: COLORS.textWhite,
    fontSize: 18,
    opacity: 0.8,
  },
  
  // PointsCard compact styles
  pointsCardCompact: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    marginRight: SPACING.md,
    ...SHADOWS.small,
  },
  pointsCardCompactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsCardCompactIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  pointsCardCompactValue: {
    color: COLORS.textWhite,
    fontSize: 24,
    fontWeight: '800',
  },
  pointsCardCompactLabel: {
    color: COLORS.textWhite,
    fontSize: 12,
    opacity: 0.8,
  },
  pointsCardCompactArrow: {
    color: COLORS.textWhite,
    fontSize: 20,
    opacity: 0.8,
  },
  
  // StreakBadge styles
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  streakIcon: {
    fontSize: 28,
    marginRight: SPACING.sm,
  },
  streakContent: {
    alignItems: 'center',
  },
  streakValue: {
    color: COLORS.textWhite,
    fontSize: 20,
    fontWeight: '800',
  },
  streakLabel: {
    color: COLORS.textWhite,
    fontSize: 11,
    opacity: 0.9,
  },
  streakMaxContainer: {
    marginLeft: SPACING.md,
    paddingLeft: SPACING.md,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  streakMaxLabel: {
    color: COLORS.textWhite,
    fontSize: 10,
    opacity: 0.8,
  },
  streakMaxValue: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
  
  // UserAvatar styles
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 999,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  avatar_small: {
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  avatar_medium: {
    borderWidth: 3,
    borderColor: COLORS.card,
  },
  avatar_large: {
    borderWidth: 4,
    borderColor: COLORS.card,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primaryLight,
  },
  avatarText: {
    color: COLORS.textWhite,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.error,
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  badgeCount: {
    color: COLORS.textWhite,
    fontSize: 10,
    fontWeight: '700',
  },
  
  // EmptyState styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  emptyAction: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.large,
    ...SHADOWS.small,
  },
  emptyActionText: {
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  
  // LoadingState styles
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  loadingIcon: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  
  // Mascot styles
  mascotContainer: {
    alignItems: 'center',
  },
  mascotEmoji: {
    marginBottom: SPACING.sm,
  },
  mascotBubble: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    ...SHADOWS.small,
  },
  mascotBubbleText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
});
