import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
} from 'react-native';
import { useTheme, globalStyles } from '../context/ThemeContext';
import { MainTabNavigationProp } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import {
  User,
  Bell,
  Globe,
  CreditCard,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Languages,
  Shield,
  Wallet,
} from 'lucide-react-native';

type Props = {
  navigation: MainTabNavigationProp;
};

type SettingItem = {
  id: string;
  title: string;
  icon: any;
  color: string;
  value?: string;
  isToggle?: boolean;
  toggleValue?: boolean;
};

export default function SettingsScreen({ navigation }: Props) {
  const { colors } = useTheme();

  const settingSections = [
    {
      title: 'Account',
      data: [
        {
          id: '1',
          title: 'Profile Information',
          icon: User,
          color: colors.primary,
          value: 'John Doe',
        },
        {
          id: '2',
          title: 'Notifications',
          icon: Bell,
          color: colors.secondary,
          isToggle: true,
          toggleValue: true,
        },
        {
          id: '3',
          title: 'Language',
          icon: Globe,
          color: colors.accent,
          value: 'English',
        },
      ],
    },
    {
      title: 'Payments',
      data: [
        {
          id: '4',
          title: 'Payment Methods',
          icon: CreditCard,
          color: colors.gold,
          value: '2 Cards',
        },
        {
          id: '5',
          title: 'Currency',
          icon: Wallet,
          color: colors.primary,
          value: 'USD',
        },
      ],
    },
    {
      title: 'Security',
      data: [
        {
          id: '6',
          title: 'Change Password',
          icon: Lock,
          color: colors.secondary,
        },
        {
          id: '7',
          title: 'Two-Factor Authentication',
          icon: Shield,
          color: colors.accent,
          isToggle: true,
          toggleValue: false,
        },
      ],
    },
    {
      title: 'Preferences',
      data: [
        {
          id: '8',
          title: 'Dark Mode',
          icon: Moon,
          color: colors.gold,
          isToggle: true,
          toggleValue: true,
        },
        {
          id: '9',
          title: 'App Language',
          icon: Languages,
          color: colors.primary,
          value: 'English',
        },
      ],
    },
    {
      title: 'Support',
      data: [
        {
          id: '10',
          title: 'Help & Support',
          icon: HelpCircle,
          color: colors.secondary,
        },
        {
          id: '11',
          title: 'Log Out',
          icon: LogOut,
          color: colors.danger,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.settingItem, globalStyles.glass]}
      onPress={() => {
        if (item.title === 'Log Out') {
          // Handle logout
          navigation.navigate('Auth');
        }
      }}
    >
      <View style={styles.settingItemLeft}>
        <View
          style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}
        >
          <item.icon size={20} color={item.color} />
        </View>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          {item.title}
        </Text>
      </View>
      <View style={styles.settingItemRight}>
        {item.isToggle ? (
          <Switch
            value={item.toggleValue}
            onValueChange={() => {}}
            trackColor={{ false: colors.glass.background, true: `${colors.primary}50` }}
            thumbColor={item.toggleValue ? colors.primary : colors.textSecondary}
          />
        ) : item.value ? (
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
            {item.value}
          </Text>
        ) : (
          <ChevronRight size={20} color={colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.surface }]}>
            Settings
          </Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, globalStyles.glass]}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.surface }]}>
              John Doe
            </Text>
            <Text style={[styles.profileEmail, { color: colors.surface }]}>
              john.doe@example.com
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.glass.background }]}
          >
            <User size={20} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            <View style={styles.sectionContent}>
              {section.data.map(renderSettingItem)}
            </View>
          </View>
        ))}
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
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileCard: {
    margin: 20,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionContent: {
    gap: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    marginRight: 8,
  },
}); 