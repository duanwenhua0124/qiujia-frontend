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
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, APP_THEME } from '../utils/theme';
import { TaskCard, TimePeriodHeader, CheckinSuccessToast } from '../components/TaskCard';
import { PointsCard, Mascot } from '../components/CommonComponents';
import { getTodayTasks, checkin } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user, updateUser } = useAuth();
  const [tasks, setTasks] = useState({ morning: [], noon: [], evening: [] });
  const [currentPeriod, setCurrentPeriod] = useState('morning');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({ visible: false, taskName: '', points: 0 });

  // 获取今日任务
  const fetchTasks = async () => {
    try {
      const response = await getTodayTasks();
      setTasks({
        morning: response.data.morning || [],
        noon: response.data.noon || [],
        evening: response.data.evening || []
      });
      setCurrentPeriod(response.data.currentPeriod || 'morning');
    } catch (error) {
      console.error('获取任务失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 下拉刷新
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasks();
  }, []);

  // 打卡
  const handleCheckin = async (task) => {
    try {
      const response = await checkin(task._id);
      
      // 显示成功提示
      const totalPoints = task.base_points + (task.extra_points || 0);
      setToast({ visible: true, taskName: task.name, points: totalPoints });
      
      // 隐藏提示
      setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 2000);
      
      // 更新用户积分
      if (response.data.total_points !== undefined) {
        updateUser({ ...user, points: response.data.total_points });
      }
      
      // 刷新任务列表
      fetchTasks();
    } catch (error) {
      Alert.alert('打卡失败', error.message || '请稍后重试');
    }
  };

  // 计算今日总进度
  const allTasks = [...tasks.morning, ...tasks.noon, ...tasks.evening];
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

        {/* 积分卡片 */}
        <PointsCard 
          points={user?.points || 0}
          totalPoints={user?.total_points || 0}
          onPress={() => navigation.navigate('Points')}
        />

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
          <Text style={styles.sectionTitle}>📋 今日任务</Text>
          
          {/* 早上任务 */}
          {tasks.morning.length > 0 && (
            <View style={styles.periodSection}>
              <TimePeriodHeader 
                period="morning" 
                tasks={tasks.morning}
                currentPeriod={currentPeriod}
              />
              {tasks.morning.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onCheckin={handleCheckin}
                  timePeriod="morning"
                />
              ))}
            </View>
          )}

          {/* 中午任务 */}
          {tasks.noon.length > 0 && (
            <View style={styles.periodSection}>
              <TimePeriodHeader 
                period="noon" 
                tasks={tasks.noon}
                currentPeriod={currentPeriod}
              />
              {tasks.noon.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onCheckin={handleCheckin}
                  timePeriod="noon"
                />
              ))}
            </View>
          )}

          {/* 晚上任务 */}
          {tasks.evening.length > 0 && (
            <View style={styles.periodSection}>
              <TimePeriodHeader 
                period="evening" 
                tasks={tasks.evening}
                currentPeriod={currentPeriod}
              />
              {tasks.evening.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onCheckin={handleCheckin}
                  timePeriod="evening"
                />
              ))}
            </View>
          )}
        </View>

        {/* 底部留白 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* 打卡成功提示 */}
      <CheckinSuccessToast 
        visible={toast.visible}
        taskName={toast.taskName}
        points={toast.points}
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
  progressContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.lg,
    marginVertical: SPACING.lg,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  periodSection: {
    marginBottom: SPACING.md,
  },
  bottomSpacer: {
    height: 100,
  },
});
