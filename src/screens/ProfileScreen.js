import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, APP_THEME } from '../utils/theme';
import { UserAvatar, PointsBadge } from '../components/CommonComponents';
import { CartoonButton } from '../components/CartoonButton';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      '确认退出',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '退出', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  const menuItems = [
    { icon: '👤', title: '个人信息', onPress: () => {} },
    { icon: '⭐', title: '积分明细', onPress: () => navigation.navigate('PointsHistory') },
    { icon: '📊', title: '我的任务', onPress: () => {} },
    { icon: '🏆', title: '成就徽章', onPress: () => {} },
    { icon: '⚙️', title: '设置', onPress: () => {} },
    { icon: '❓', title: '帮助与反馈', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 用户信息卡片 */}
      <View style={styles.profileCard}>
        <View style={styles.avatarSection}>
          <UserAvatar 
            nickname={user?.nickname || '用户'}
            avatar={user?.avatar}
            size="large"
          />
          <View style={styles.userInfo}>
            <Text style={styles.nickname}>{user?.nickname || '新用户'}</Text>
            <Text style={styles.phone}>{user?.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.points || 0}</Text>
            <Text style={styles.statLabel}>当前积分</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.total_points || 0}</Text>
            <Text style={styles.statLabel}>历史总积分</Text>
          </View>
        </View>
      </View>

      {/* 菜单列表 */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 退出登录 */}
      <View style={styles.footer}>
        <CartoonButton
          title="退出登录"
          onPress={handleLogout}
          variant="outline"
          fullWidth
        />
        
        <Text style={styles.version}>
          {APP_THEME.name} v{APP_THEME.version}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.xl,
    marginTop: SPACING.lg,
    ...SHADOWS.medium,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  userInfo: {
    marginLeft: SPACING.lg,
    flex: 1,
  },
  nickname: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.divider,
    marginHorizontal: SPACING.md,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  menuSection: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    marginTop: SPACING.lg,
    ...SHADOWS.small,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  menuIcon: {
    fontSize: 22,
    marginRight: SPACING.md,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.textLight,
  },
  footer: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: SPACING.lg,
  },
});
