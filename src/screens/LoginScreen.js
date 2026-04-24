import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING, APP_THEME } from '../utils/theme';
import { CartoonButton } from '../components/CartoonButton';
import { Mascot } from '../components/CommonComponents';
import { login } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();

  // 直接手机号登录
  const handleLogin = async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }

    setLoading(true);
    try {
      const response = await login(phone);
      await authLogin(response.data.token, response.data.user);
    } catch (error) {
      Alert.alert('登录失败', error.message || '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Logo区域 */}
        <View style={styles.header}>
          <Mascot size="large" message="欢迎来到球家宝贝成长社！" />
          <Text style={styles.appName}>{APP_THEME.name}</Text>
          <Text style={styles.slogan}>养成好习惯，收获快乐成长</Text>
        </View>

        {/* 表单区域 */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>手机号</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入手机号"
              placeholderTextColor={COLORS.textLight}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={11}
            />
          </View>

          <CartoonButton
            title="一键登录"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            size="large"
            icon="🏀"
          />
        </View>

        {/* 底部说明 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            登录即表示同意
            <Text style={styles.link}>《用户协议》</Text>
            和
            <Text style={styles.link}>《隐私政策》</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  slogan: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  form: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.xl,
    ...SHADOWS.medium,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
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
  footer: {
    marginTop: SPACING.xxl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  link: {
    color: COLORS.primary,
  },
});
