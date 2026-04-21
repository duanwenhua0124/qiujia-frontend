import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  RefreshControl,
  Alert
} from 'react-native';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, APP_THEME, TASK_CATEGORIES } from '../utils/theme';
import { TaskCard, TimePeriodHeader, CheckinSuccessToast, CategoryHeader } from '../components/TaskCard';
import { PointsCard, Mascot, StreakBadge } from '../components/CommonComponents';
import { getTodayTasks, checkin, getTaskStats } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user, updateUser } = useAuth();
  const [tasks, setTasks] = useState({ daily: [], advanced: [], growth: [] });
  const [currentPeriod, setCurrentPeriod] = useState('morning');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({ visible: false, taskName: '', points: 0 });
  const [stats, setStats] = useState({
    checkin_streak: 0,
    max_checkin_streak: 0,
    total_checkin_days: 0
  });
  const [isWeekend, setIsWeekend] = useState(false);

  // 获取今日任务
  const fetchTasks = async () => {
    try {
      const response = await getTodayTasks();
      setTasks({
        daily: response.data.daily || [],
        advanced: response.data.advanced || [],
        growth: response.data.growth || []
      });
      setCurrentPeriod(response.data.currentPeriod || 'morning');
      setIsWeekend(response.data.isWeekend || false);
    } catch (error) {
      console.error('获取任务失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 获取统计数据
  const fetchStats = async () => {
    try {
      const response = await getTaskStats();
      setStats(response.data || {});
    } catch (error) {
      console.error('获取统计失败:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  // 下拉刷新
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasks();
    fetchStats();
  }, []);

  // 打卡
  const handleCheckin = async (task) => {
    try {
      const response = await checkin(task._id);
      
      // 显示成功提示
      const totalPoints = task.base_points + (task.extra_points || 0);
      const bonusPoints = response.data.streak_bonus || 0;
      setToast({ 
        visible: true, 
        taskName: task.name, 
        points: totalPoints + bonusPoints,
        streakBonus: bonusPoints
      });
      
      // 隐藏提示
      setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 2500);
      
      // 更新用户积分
      if (response.data.total_points !== undefined) {
        updateUser({ ...user, points: response.data.total_points });
      }
      
      // 更新统计数据
      if (response.data.checkin_streak !== undefined) {
        setStats(prev => ({ ...prev, checkin_streak: response.data.checkin_streak }));
      }
      
      // 刷新任务列表
      fetchTasks();
    } catch (error) {
      Alert.alert('打卡失败', error.message || '请稍后重试');
    }
  };

  // 计算今日总进度
  const allTasks = [...tasks.daily, ...tasks.advanced, ...tasks.growth];
  const completedCount = allTasks.filter(t => t.status === 'completed').length;
  const totalCount = allTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // 获取鼓励语
  const getEncourageMessage = () => {
    if (completedCount === 0) {
      return '今天也要加油哦！🏃';
    } else if (completedCount < totalCount) {
      return `已完成 ${completedCount} 个任务，继续加油！💪`;
    } else {
      return '太棒了！今日任务全部完成！🎉';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 顶部欢迎区域 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              你好，{user?.nickname || '小朋友'}！👋
            </Text>
            <Text style={styles.encourage}>{getEncourageMessage()}</Text>
          </View>
          <Mascot size="small" />
        </View>

        {/* 积分和连续打卡卡片 */}
        <View style={styles.statsRow}>
          <PointsCard 
            points={user?.points || 0}
            totalPoints={user?.total_points || 0}
            onPress={() => navigation.navigate('Points')}
            compact
          />
          <StreakBadge 
            streak={stats.checkin_streak}
            maxStreak={stats.max_checkin_streak}
            onPress={() => navigation.navigate('Rewards')}
          />
        </View>

        {/* 进度条 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>今日进度</Text>
            <Text style={styles.progressText}>{completedCount}/{totalCount}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressPercent}>{progressPercent}%</Text>
        </View>

        {/* 任务列表 */}
        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 今日任务</Text>
            {isWeekend && (
              <View style={styles.weekendBadge}>
                <Text style={styles.weekendBadgeText}>🎉 周末挑战</Text>
              </View>
            )}
          </View>
          
          {/* 每日基础任务 */}
          {tasks.daily.length > 0 && (
            <View style={styles.categorySection}>
              <CategoryHeader 
                category="daily" 
                completed={tasks.daily.filter(t => t.status === 'completed').length}
                total={tasks.daily.length}
              />
              {tasks.daily.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onCheckin={handleCheckin}
                  timePeriod={task.time_period}
                  showCategory
                />
              ))}
            </View>
          )}

          {/* 进阶家务任务（周末显示） */}
          {tasks.advanced.length > 0 && (
            <View style={styles.categorySection}>
              <CategoryHeader 
                category="advanced" 
                completed={tasks.advanced.filter(t => t.status === 'completed').length}
                total={tasks.advanced.length}
              />
              {tasks.advanced.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onCheckin={handleCheckin}
                  timePeriod="weekend"
                  showCategory
                />
              ))}
            </View>
          )}

          {/* 成长责任任务 */}
          {tasks.growth.length > 0 && (
            <View style={styles.categorySection}>
              <CategoryHeader 
                category="growth" 
                completed={tasks.growth.filter(t => t.status === 'completed').length}
                total={tasks.growth.length}
              />
              {tasks.growth.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onCheckin={handleCheckin}
                  timePeriod="anytime"
                  showCategory
                />
              ))}
            </View>
          )}
        </View>

        {/* 连续打卡奖励提示 */}
        {(stats.checkin_streak === 7 || stats.checkin_streak === 30) && (
          <View style={styles.streakRewardBanner}>
            <Text style={styles.streakRewardIcon}>🎊</Text>
            <View style={styles.streakRewardText}>
              <Text style={styles.streakRewardTitle}>恭喜连续打卡{stats.checkin_streak}天！</Text>
              <Text style={styles.streakRewardSubtitle}>获得 +{stats.checkin_streak === 7 ? 10 : 50} 积分奖励！</Text>
            </View>
          </View>
        )}

        {/* 底部留白 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* 打卡成功提示 */}
      <CheckinSuccessToast 
        visible={toast.visible}
        taskName={toast.taskName}
        points={toast.points}
        streakBonus={toast.streakBonus}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  encourage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  progressContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'right',
    marginTop: 4,
  },
  tasksSection: {
    marginTop: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  weekendBadge: {
    backgroundColor: COLORS.accentGreen,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.round,
  },
  weekendBadgeText: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontWeight: '600',
  },
  categorySection: {
    marginBottom: SPACING.lg,
  },
  streakRewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  streakRewardIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  streakRewardText: {
    flex: 1,
  },
  streakRewardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  streakRewardSubtitle: {
    fontSize: 14,
    color: COLORS.accentOrange,
    marginTop: 2,
  },
  bottomSpacer: {
    height: 100,
  },
});
