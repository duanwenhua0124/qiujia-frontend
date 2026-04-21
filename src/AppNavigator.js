import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from './contexts/AuthContext';
import { COLORS, SHADOWS } from './utils/theme';

// Screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import TaskListScreen from './screens/TaskListScreen';
import CustomTaskScreen from './screens/CustomTaskScreen';
import PointsHistoryScreen from './screens/PointsHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import { LoadingState } from './components/CommonComponents';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// TabBar图标组件
const TabIcon = ({ icon, focused, label }) => (
  <View style={styles.tabIconContainer}>
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{icon}</Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
  </View>
);

// 主页Tab导航
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" focused={focused} label="首页" />
          ),
        }}
      />
      <Tab.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📋" focused={focused} label="任务" />
          ),
        }}
      />
      <Tab.Screen
        name="CustomTask"
        component={CustomTaskScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="➕" focused={focused} label="发布" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" focused={focused} label="我的" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// 主导航器
export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingState message="加载中..." />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeTabs} />
            <Stack.Screen 
              name="PointsHistory" 
              component={PointsHistoryScreen}
              options={{
                headerShown: true,
                title: '积分明细',
                headerStyle: { backgroundColor: COLORS.primary },
                headerTintColor: COLORS.textWhite,
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  tabBar: {
    height: 70,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: COLORS.card,
    borderTopWidth: 0,
    ...SHADOWS.medium,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  tabIconFocused: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  tabLabelFocused: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
