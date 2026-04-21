import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList,
  StyleSheet, 
  SafeAreaView,
  RefreshControl
} from 'react-native';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '../utils/theme';
import { LoadingState, EmptyState } from '../components/CommonComponents';
import { getPointsHistory } from '../services/api';

export default function PointsHistoryScreen() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 获取积分记录
  const fetchRecords = async (pageNum = 1, isRefresh = false) => {
    try {
      const response = await getPointsHistory({ page: pageNum, limit: 20 });
      const newRecords = response.data.list || [];
      
      if (isRefresh) {
        setRecords(newRecords);
      } else {
        setRecords(prev => [...prev, ...newRecords]);
      }
      
      setHasMore(newRecords.length === 20);
    } catch (error) {
      console.error('获取积分记录失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // 下拉刷新
  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchRecords(1, true);
  };

  // 加载更多
  const onEndReached = () => {
    if (hasMore && !loading && !refreshing) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchRecords(nextPage);
    }
  };

  // 渲染记录项
  const renderRecordItem = ({ item }) => {
    const isPositive = item.amount > 0;
    const typeIcons = {
      earn: '✅',
      deduct: '❌',
      reward: '🎁',
      adjust: '⚙️',
      publish: '📤',
      accept: '📥'
    };
    
    return (
      <View style={styles.recordItem}>
        <View style={[styles.iconContainer, isPositive ? styles.iconPositive : styles.iconNegative]}>
          <Text style={styles.iconText}>{typeIcons[item.type] || '📝'}</Text>
        </View>
        
        <View style={styles.recordContent}>
          <Text style={styles.recordReason}>{item.reason || '积分变动'}</Text>
          <Text style={styles.recordTime}>
            {new Date(item.created_at).toLocaleDateString('zh-CN')} {' '}
            {new Date(item.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, isPositive ? styles.amountPositive : styles.amountNegative]}>
            {isPositive ? '+' : ''}{item.amount}
          </Text>
          <Text style={styles.balance}>余额: {item.balance}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingState message="加载积分记录..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={records}
        renderItem={renderRecordItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <EmptyState
            icon="📊"
            title="暂无积分记录"
            message="完成任务后会在这里显示积分变动"
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerIcon}>💰</Text>
            <Text style={styles.headerTitle}>积分明细</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerIcon: {
    fontSize: 28,
    marginRight: SPACING.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconPositive: {
    backgroundColor: '#E8F5E9',
  },
  iconNegative: {
    backgroundColor: '#FFEBEE',
  },
  iconText: {
    fontSize: 20,
  },
  recordContent: {
    flex: 1,
  },
  recordReason: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  recordTime: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 17,
    fontWeight: '700',
  },
  amountPositive: {
    color: COLORS.success,
  },
  amountNegative: {
    color: COLORS.error,
  },
  balance: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
});
