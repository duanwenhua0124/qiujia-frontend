import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, TASK_ICONS, REWARD_CATEGORIES } from '../utils/theme';
import { EmptyState, LoadingState } from '../components/CommonComponents';
import { CartoonButton } from '../components/CartoonButton';
import { getRewardsList, redeemReward, getRewardHistory, getUserProfile } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function RewardsScreen({ navigation }) {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('small');
  const [rewards, setRewards] = useState({ small: [], medium: [], large: [] });
  const [userPoints, setUserPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [redeeming, setRedeeming] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // 获取奖励列表
  const fetchRewards = async () => {
    try {
      const response = await getRewardsList();
      setRewards(response.data.groupedRewards || { small: [], medium: [], large: [] });
      setUserPoints(response.data.user_points || user?.points || 0);
    } catch (error) {
      console.error('获取奖励列表失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 获取兑换历史
  const fetchHistory = async (page = 1) => {
    try {
      const response = await getRewardHistory({ page, limit: 10 });
      if (page === 1) {
        setHistory(response.data.list || []);
      } else {
        setHistory(prev => [...prev, ...(response.data.list || [])]);
      }
      setHistoryTotal(response.data.total || 0);
      setHistoryPage(page);
    } catch (error) {
      console.error('获取兑换记录失败:', error);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  useEffect(() => {
    if (showHistory) {
      fetchHistory(1);
    }
  }, [showHistory]);

  // 下拉刷新
  const onRefresh = () => {
    setRefreshing(true);
    if (showHistory) {
      fetchHistory(1);
    } else {
      fetchRewards();
    }
  };

  // 兑换奖励
  const handleRedeem = async (reward) => {
    if (userPoints < reward.points_cost) {
      Alert.alert('积分不足', `还需要 ${reward.points_cost - userPoints} 积分才能兑换`);
      return;
    }

    Alert.alert(
      '确认兑换',
      `确定要用 ${reward.points_cost} 积分兑换「${reward.name}」吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认兑换',
          onPress: async () => {
            setRedeeming(reward.id);
            try {
              const response = await redeemReward(reward.id);
              Alert.alert(
                '兑换成功！',
                response.message,
                [{ text: '好的', onPress: () => {
                  fetchRewards();
                  fetchHistory(1);
                  // 更新用户积分
                  if (response.data.remaining_points !== undefined) {
                    updateUser({ ...user, points: response.data.remaining_points });
                  }
                }}]
              );
            } catch (error) {
              Alert.alert('兑换失败', error.message || '请稍后重试');
            } finally {
              setRedeeming(null);
            }
          }
        }
      ]
    );
  };

  // 获取状态文字和颜色
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { text: '待审核', color: COLORS.warning },
      approved: { text: '已通过', color: COLORS.success },
      rejected: { text: '已拒绝', color: COLORS.error },
      completed: { text: '已完成', color: COLORS.success }
    };
    return statusMap[status] || { text: status, color: COLORS.textSecondary };
  };

  // 渲染奖励卡片
  const renderRewardCard = (reward) => {
    const iconInfo = TASK_ICONS[reward.icon] || TASK_ICONS.gift;
    const canRedeem = userPoints >= reward.points_cost;

    return (
      <View key={reward.id} style={styles.rewardCard}>
        <View style={[styles.rewardIconContainer, { backgroundColor: iconInfo.color }]}>
          <Text style={styles.rewardIcon}>{iconInfo.emoji}</Text>
        </View>
        <View style={styles.rewardInfo}>
          <Text style={styles.rewardName}>{reward.name}</Text>
          <Text style={styles.rewardDesc} numberOfLines={2}>{reward.description}</Text>
          <View style={styles.rewardFooter}>
            <View style={styles.rewardPoints}>
              <Text style={styles.rewardPointsIcon}>⭐</Text>
              <Text style={styles.rewardPointsValue}>{reward.points_cost}</Text>
            </View>
          </View>
        </View>
        <CartoonButton
          title={canRedeem ? '兑换' : '不足'}
          size="small"
          onPress={() => handleRedeem(reward)}
          disabled={!canRedeem || redeeming === reward.id}
          loading={redeeming === reward.id}
          style={[styles.redeemButton, !canRedeem && styles.redeemButtonDisabled]}
        />
      </View>
    );
  };

  // 渲染历史记录
  const renderHistoryItem = (item) => {
    const statusInfo = getStatusInfo(item.status);
    return (
      <View key={item._id} style={styles.historyItem}>
        <View style={styles.historyLeft}>
          <Text style={styles.historyName}>{item.reward_name}</Text>
          <Text style={styles.historyDate}>
            {new Date(item.created_at).toLocaleDateString('zh-CN')}
          </Text>
        </View>
        <View style={styles.historyRight}>
          <Text style={styles.historyPoints}>-{item.points_spent}积分</Text>
          <View style={[styles.historyStatus, { backgroundColor: statusInfo.color + '20' }]}>
            <Text style={[styles.historyStatusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingState message="加载积分商城..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 积分展示 */}
        <View style={styles.pointsHeader}>
          <View style={styles.pointsInfo}>
            <Text style={styles.pointsLabel}>我的积分</Text>
            <Text style={styles.pointsValue}>{userPoints}</Text>
          </View>
          <TouchableOpacity 
            style={styles.historyButton}
            onPress={() => setShowHistory(!showHistory)}
          >
            <Text style={styles.historyButtonText}>
              {showHistory ? '← 返回商城' : '📜 兑换记录'}
            </Text>
          </TouchableOpacity>
        </View>

        {!showHistory ? (
          <>
            {/* 分类切换 */}
            <View style={styles.tabContainer}>
              {['small', 'medium', 'large'].map((tab) => {
                const info = REWARD_CATEGORIES[tab];
                const isActive = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.tab,
                      isActive && { backgroundColor: info.color }
                    ]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={styles.tabIcon}>{info.icon}</Text>
                    <Text style={[
                      styles.tabText,
                      isActive && styles.tabTextActive
                    ]}>
                      {info.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 当前分类说明 */}
            <View style={styles.categoryDesc}>
              <Text style={styles.categoryDescText}>
                {REWARD_CATEGORIES[activeTab].description}
              </Text>
            </View>

            {/* 奖励列表 */}
            <View style={styles.rewardsList}>
              {rewards[activeTab]?.length > 0 ? (
                rewards[activeTab].map(renderRewardCard)
              ) : (
                <EmptyState
                  icon="🎁"
                  title="暂无奖励"
                  message="该分类暂无奖励"
                />
              )}
            </View>
          </>
        ) : (
          <>
            {/* 兑换历史 */}
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>兑换记录</Text>
              <Text style={styles.historyCount}>共 {historyTotal} 条</Text>
            </View>
            
            {history.length > 0 ? (
              <View style={styles.historyList}>
                {history.map(renderHistoryItem)}
                {history.length < historyTotal && (
                  <TouchableOpacity
                    style={styles.loadMoreButton}
                    onPress={() => fetchHistory(historyPage + 1)}
                  >
                    <Text style={styles.loadMoreText}>加载更多</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <EmptyState
                icon="📜"
                title="暂无兑换记录"
                message="快去兑换心仪的奖励吧！"
              />
            )}
          </>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  pointsInfo: {
    alignItems: 'flex-start',
  },
  pointsLabel: {
    color: COLORS.textWhite,
    fontSize: 14,
    opacity: 0.9,
  },
  pointsValue: {
    color: COLORS.textWhite,
    fontSize: 40,
    fontWeight: '800',
    marginTop: 4,
  },
  historyButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
  },
  historyButtonText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.xs,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
  },
  tabIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.textWhite,
  },
  categoryDesc: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  categoryDescText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  rewardsList: {
    marginBottom: SPACING.lg,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  rewardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  rewardIcon: {
    fontSize: 32,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  rewardDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  rewardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.small,
  },
  rewardPointsIcon: {
    fontSize: 14,
    marginRight: 2,
  },
  rewardPointsValue: {
    fontSize: 14,
    color: '#F57C00',
    fontWeight: '700',
  },
  redeemButton: {
    marginLeft: SPACING.sm,
  },
  redeemButtonDisabled: {
    backgroundColor: COLORS.divider,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  historyCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  historyList: {
    marginBottom: SPACING.lg,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  historyLeft: {
    flex: 1,
  },
  historyName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  historyDate: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyPoints: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.small,
  },
  historyStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadMoreButton: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  loadMoreText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 100,
  },
});
