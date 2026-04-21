import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  ScrollView,
  StyleSheet, 
  SafeAreaView,
  Alert
} from 'react-native';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '../utils/theme';
import { CartoonButton } from '../components/CartoonButton';
import { createCustomTask } from '../services/api';

export default function CustomTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pointsReward, setPointsReward] = useState('');
  const [loading, setLoading] = useState(false);

  // 创建自定义任务
  const handleCreateTask = async () => {
    if (!title.trim()) {
      Alert.alert('提示', '请输入任务标题');
      return;
    }
    
    const reward = parseInt(pointsReward);
    if (!reward || reward < 1) {
      Alert.alert('提示', '请输入有效的积分奖励（至少1积分）');
      return;
    }

    setLoading(true);
    try {
      await createCustomTask({
        title: title.trim(),
        description: description.trim(),
        points_reward: reward
      });
      
      Alert.alert('发布成功', '任务已发布，等待其他小朋友接取！🎉', [
        { text: '确定', onPress: () => {
          setTitle('');
          setDescription('');
          setPointsReward('');
        }}
      ]);
    } catch (error) {
      Alert.alert('发布失败', error.message || '积分不足或网络错误');
    } finally {
      setLoading(false);
    }
  };

  // 快捷积分选项
  const quickPoints = [10, 20, 30, 50];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 标题 */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>📝</Text>
          <Text style={styles.headerTitle}>发布自定义任务</Text>
          <Text style={styles.headerSubtitle}>
            发布任务需要消耗相应积分，其他小朋友完成后你可获得积分奖励
          </Text>
        </View>

        {/* 表单 */}
        <View style={styles.form}>
          {/* 任务标题 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>任务标题 <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="例如：帮忙取快递"
              placeholderTextColor={COLORS.textLight}
              value={title}
              onChangeText={setTitle}
              maxLength={30}
            />
            <Text style={styles.charCount}>{title.length}/30</Text>
          </View>

          {/* 任务描述 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>任务描述</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="详细描述任务内容，让接任务的人更清楚..."
              placeholderTextColor={COLORS.textLight}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={200}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{description.length}/200</Text>
          </View>

          {/* 积分奖励 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>积分奖励 <Text style={styles.required}>*</Text></Text>
            <Text style={styles.hint}>你愿意支付多少积分作为完成奖励？</Text>
            
            {/* 快捷选项 */}
            <View style={styles.quickPoints}>
              {quickPoints.map(point => (
                <TextInput
                  key={point}
                  style={[
                    styles.quickPoint,
                    parseInt(pointsReward) === point && styles.quickPointActive
                  ]}
                  value={pointsReward === point.toString() ? point.toString() : ''}
                  onPress={() => setPointsReward(point.toString())}
                  editable={false}
                >
                  {point}
                </TextInput>
              ))}
            </View>
            
            <View style={styles.customPoints}>
              <Text style={styles.customPointsLabel}>自定义：</Text>
              <TextInput
                style={[styles.input, styles.pointsInput]}
                placeholder="输入积分"
                placeholderTextColor={COLORS.textLight}
                value={pointsReward}
                onChangeText={setPointsReward}
                keyboardType="number-pad"
              />
              <Text style={styles.pointsUnit}>积分</Text>
            </View>
          </View>

          {/* 积分说明 */}
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>💡</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>积分规则说明</Text>
              <Text style={styles.infoText}>
                • 发布任务时，积分会立即从你的账户扣除{'\n'}
                • 其他小朋友完成任务后，积分将奖励给他们{'\n'}
                • 任务被接取后无法取消，请谨慎发布
              </Text>
            </View>
          </View>

          {/* 提交按钮 */}
          <CartoonButton
            title="发布任务"
            onPress={handleCreateTask}
            loading={loading}
            fullWidth
            size="large"
            icon="🚀"
            disabled={!title.trim() || !pointsReward}
          />
        </View>
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
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  form: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.xl,
    ...SHADOWS.medium,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  required: {
    color: COLORS.error,
  },
  hint: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    height: 100,
    paddingTop: SPACING.md,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'right',
    marginTop: 4,
  },
  quickPoints: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  quickPoint: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.medium,
    paddingVertical: SPACING.md,
    marginRight: SPACING.sm,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  quickPointActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    color: COLORS.primary,
  },
  customPoints: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customPointsLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  pointsInput: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  pointsUnit: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
