import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MainTabNavigationProp } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, ArrowLeft, AlertTriangle, DollarSign, Zap, Mail } from 'lucide-react-native';

type Props = {
  navigation: MainTabNavigationProp;
};

export default function NotificationsScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    transactionAlerts: true,
    billReminders: true,
    budgetAlerts: true,
    emailNotifications: false,
  });

  const toggleSetting = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const notificationItems = [
    {
      id: 'pushNotifications',
      title: 'Push Notifications',
      description: 'Enable or disable all notifications',
      icon: Bell,
      color: colors.primary,
    },
    {
      id: 'transactionAlerts',
      title: 'Transaction Alerts',
      description: 'Get notified about new transactions',
      icon: DollarSign,
      color: colors.success,
    },
    {
      id: 'billReminders',
      title: 'Bill Reminders',
      description: 'Receive reminders for upcoming bills',
      icon: AlertTriangle,
      color: colors.warning,
    },
    {
      id: 'budgetAlerts',
      title: 'Budget Alerts',
      description: 'Get alerts when nearing budget limits',
      icon: Zap,
      color: colors.danger,
    },
    {
      id: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive updates via email',
      icon: Mail,
      color: colors.info,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.surface }]}>
            Notifications
          </Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {notificationItems.map((item) => (
            <View
              key={item.id}
              style={[
                styles.settingItem,
                { borderBottomColor: colors.border },
              ]}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${item.color}15` },
                  ]}
                >
                  <item.icon size={20} color={item.color} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  <Text
                    style={[styles.settingDescription, { color: colors.textSecondary }]}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationSettings[item.id as keyof typeof notificationSettings]}
                onValueChange={() =>
                  toggleSetting(item.id as keyof typeof notificationSettings)
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
}); 