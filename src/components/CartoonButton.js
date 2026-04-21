import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING, APP_THEME } from '../utils/theme';

// 卡通风格按钮 - 球家宝贝成长社
export const CartoonButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  fullWidth = false
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`button_${size}`]];
    if (fullWidth) baseStyle.push(styles.buttonFullWidth);
    
    switch (variant) {
      case 'secondary':
        return [...baseStyle, styles.buttonSecondary];
      case 'accent':
        return [...baseStyle, styles.buttonAccent];
      case 'outline':
        return [...baseStyle, styles.buttonOutline];
      case 'ghost':
        return [...baseStyle, styles.buttonGhost];
      default:
        return [...baseStyle, styles.buttonPrimary];
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, styles[`buttonText_${size}`]];
    
    switch (variant) {
      case 'outline':
      case 'ghost':
        return [...baseStyle, styles.buttonTextOutline];
      case 'accent':
        return [...baseStyle, styles.buttonTextAccent];
      default:
        return [...baseStyle, styles.buttonTextWhite];
    }
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), disabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary : COLORS.textWhite} />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <Text style={styles.buttonIcon}>{icon}</Text>}
          <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// 主色调按钮（蓝色）
const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  button_small: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  button_medium: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  button_large: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  buttonAccent: {
    backgroundColor: COLORS.accent,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  buttonText: {
    fontWeight: '700',
  },
  buttonText_small: {
    fontSize: 14,
  },
  buttonText_medium: {
    fontSize: 16,
  },
  buttonText_large: {
    fontSize: 18,
  },
  buttonTextWhite: {
    color: COLORS.textWhite,
  },
  buttonTextOutline: {
    color: COLORS.primary,
  },
  buttonTextAccent: {
    color: COLORS.textPrimary,
  },
});
