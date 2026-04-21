import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList,
  StyleSheet, 
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '../utils/theme';
import { EmptyState, LoadingState, UserAvatar } from '../components/CommonComponents';
import { CartoonButton } from '../components/CartoonButton';
import { getCustomTasks, acceptCustomTask, completeCustomTask } from '../services/api';

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // 获取任务列表
  const fetchTasks = async () => {
    try {
      const response = await getCustomTasks({ status: 'open' });
      setTasks(response.data.list || []);
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
  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  // 接取任务
  const handleAccept = async (taskId) => {
    Alert.alert(
      '确认接取',
      '确定要接取这个任务吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确认', 
          onPress: async () => {
            setActionLoading(taskId);
            try {
              await acceptCustomTask(taskId);
              Alert.alert('成功', '已接取任务，完成后记得打卡哦！🎉');
              fetchTasks();
            } catch (error) {
              Alert.alert('接取失败', error.message || '请稍后重试');
            } finally {
              setActionLoading(null);
            }
          }
        }
      ]
    );
  };

  // 完成任务
  const handleComplete = async (taskId) => {
    Alert.alert(
      '确认完成',
      '确定已完成任务了吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确认', 
          onPress: async () => {
            setActionLoading(taskId);
            try {
              await completeCustomTask(taskId);
              Alert.alert('恭喜', '任务完成，积分已到账！⭐');
              fetchTasks();
            } catch (error) {
              Alert.alert('操作失败', error.message || '请稍后重试');
            } finally {
              setActionLoading(null);
            }
          }
        }
      ]
    );
  };

  // 渲染任务卡片
  const renderTaskCard = ({ item }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={styles.creatorInfo}>
          <UserAvatar 
            nickname={item.creator?.nickname || '未知'} 
            size="small"
          />
          <Text style={styles.creatorName}>{item.creator?.nickname || '神秘人'}</Text>
        </View>
        <View style={styles.rewardBadge}>
          <Text style={styles.rewardIcon}>⭐</Text>
          <Text style={styles.rewardText}>+{item.points_reward}</Text>
        </View>
      </View>
      
      <Text style={styles.taskTitle}>{item.title}</Text>
      {item.description && (
        <Text style={styles.taskDesc} numberOfLines={2}>{item.description}</Text>
      )}
      
      <View style={styles.taskFooter}>
        <Text style={styles.taskTime}>
          {new Date(item.created_at).toLocaleDateString('zh-CN')}
        </Text>
        <CartoonButton
          title="接任务"
          size="small"
          onPress={() => handleAccept(item._id)}
          loading={actionLoading === item._id}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingState message="加载任务列表..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTaskCard}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📭"
            title="暂无任务"
            message="还没有人发布自定义任务，\n快去发布一个吧！"
            actionText="发布任务"
            onAction={() => navigation.navigate('CustomTask')}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🏃 可接任务</Text>
            <Text style={styles.headerSubtitle}>
              帮助别人完成任务，赚取积分奖励！
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  taskCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.round,
  },
  rewardIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F57C00',
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  taskDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  taskTime: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});
