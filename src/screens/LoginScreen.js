import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert
} from 'react-native';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING, APP_THEME } from '../utils/theme';
import { CartoonButton } from '../components/CartoonButton';
import { Mascot } from '../components/CommonComponents';
import { sendCode, login } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [step, setStep] = useState(1); // 1: 输入手机号, 2: 输入验证码
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();

  // 发送验证码
  const handleSendCode = async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }

    setLoading(true);
    try {
      const response = await sendCode(phone);
      setStep(2);
      setCountdown(60);
      
      // 开发模式：显示验证码
      if (response.data?.debug_code) {
        Alert.alert('验证码', `验证码是: ${response.data.debug_code}`);
        setCode(response.data.debug_code);
      }
      
      // 倒计时
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      Alert.alert('发送失败', error.message || '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 登录
  const handleLogin = async () => {
    if (code.length !== 6) {
      Alert.alert('提示', '请输入6位验证码');
      return;
    }

    setLoading(true);
    try {
      const response = await login(phone, code);
      await authLogin(response.data.token, response.data.user);
    } catch (error) {
      Alert.alert('登录失败', error.message || '验证码错误，请重试');
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
          {step === 1 ? (
            <>
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
                title="获取验证码"
                onPress={handleSendCode}
                loading={loading}
                fullWidth
                size="large"
              />
            </>
          ) : (
            <>
              <View style={styles.phoneRow}>
                <Text style={styles.phoneLabel}>验证码已发送至</Text>
                <Text style={styles.phoneValue}>{phone}</Text>
                <TouchableOpacity onPress={() => setStep(1)}>
                  <Text style={styles.changePhone}>更换</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>验证码</Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入6位验证码"
                  placeholderTextColor={COLORS.textLight}
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <View style={styles.codeHint}>
                {countdown > 0 ? (
                  <Text style={styles.countdownText}>{countdown}秒后可重新发送</Text>
                ) : (
                  <TouchableOpacity onPress={handleSendCode}>
                    <Text style={styles.resendText}>重新发送验证码</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <CartoonButton
                title="登录"
                onPress={handleLogin}
                loading={loading}
                fullWidth
                size="large"
                icon="🏀"
              />
            </>
          )}
        </View>

        {/* 底部协议 */}
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
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    backgroundColor: '#EEF4FF',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
  },
  phoneLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  phoneValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  changePhone: {
    fontSize: 14,
    color: COLORS.secondary,
    marginLeft: SPACING.md,
    fontWeight: '600',
  },
  codeHint: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  countdownText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  resendText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
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
