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
import {
  ArrowLeft,
  Shield,
  Fingerprint,
  Lock,
  Eye,
  Key,
  AlertTriangle,
} from 'lucide-react-native';

type Props = {
  navigation: MainTabNavigationProp;
};

export default function SecurityScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    biometricLogin: true,
    passwordLock: true,
    hideBalance: false,
    loginAlerts: true,
  });

  const toggleSetting = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const securityItems = [
    {
      id: 'twoFactorAuth',
      title: '2-Factor Authentication',
      description: 'Add an extra layer of security',
      icon: Shield,
      color: colors.primary,
    },
    {
      id: 'biometricLogin',
      title: 'Biometric Login',
      description: 'Use fingerprint or face ID',
      icon: Fingerprint,
      color: colors.success,
    },
    {
      id: 'passwordLock',
      title: 'App Lock',
      description: 'Require password on open',
      icon: Lock,
      color: colors.warning,
    },
    {
      id: 'hideBalance',
      title: 'Hide Balance',
      description: 'Hide balance in public',
      icon: Eye,
      color: colors.info,
    },
    {
      id: 'loginAlerts',
      title: 'Login Alerts',
      description: 'Get notified of new logins',
      icon: AlertTriangle,
      color: colors.danger,
    },
  ];

  const handleChangePassword = () => {
    // TODO: Implement change password functionality
    console.log('Change password pressed');
  };

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
            Security
          </Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {securityItems.map((item) => (
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
                value={securitySettings[item.id as keyof typeof securitySettings]}
                onValueChange={() =>
                  toggleSetting(item.id as keyof typeof securitySettings)
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.changePasswordButton, { backgroundColor: colors.surface }]}
          onPress={handleChangePassword}
        >
          <Key size={20} color={colors.primary} />
          <Text style={[styles.changePasswordText, { color: colors.primary }]}>
            Change Password
          </Text>
        </TouchableOpacity>
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
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 20,
    gap: 8,
  },
  changePasswordText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 