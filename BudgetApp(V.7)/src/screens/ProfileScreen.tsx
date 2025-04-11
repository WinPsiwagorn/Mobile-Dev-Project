import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme, globalStyles } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { MainTabNavigationProp } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import {
  User,
  Settings,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  Crown,
  LogOut,
} from 'lucide-react-native';
import ScreenLayout from '../components/ScreenLayout';

type Props = {
  navigation: MainTabNavigationProp;
};

export default function ProfileScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const menuItems = [
    {
      title: 'Premium Account',
      icon: Crown,
      color: colors.gold,
      badge: 'ELITE',
      description: 'Access exclusive features',
      onPress: () => navigation.navigate('AddAccount'),
    },
    {
      title: 'Notifications',
      icon: Bell,
      color: colors.secondary,
      description: 'Customize alerts',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      title: 'Security',
      icon: Shield,
      color: colors.success,
      description: '2FA enabled',
      onPress: () => navigation.navigate('Security'),
    },
    {
      title: 'Help & Support',
      icon: HelpCircle,
      color: colors.accent,
      description: '24/7 premium support',
      onPress: () => navigation.navigate('HelpSupport'),
    },
  ];

  return (
    <ScreenLayout backgroundColor={colors.background}>
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.surface }]}>
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.avatar}
              />
            ) : (
              <User size={40} color={colors.primary} />
            )}
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
          </View>
          <Text style={[styles.userName, { color: colors.surface }]}>
            {user?.displayName || 'John Williams'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.surface }]}>
            {user?.email || 'john.williams@example.com'}
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Menu Items */}
        <View style={[styles.menuContainer, { backgroundColor: colors.surface }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && styles.menuItemBorder,
                { borderBottomColor: colors.border }
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
                  <item.icon size={20} color={item.color} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.menuItemDescription, { color: colors.textSecondary }]}>
                    {item.description}
                  </Text>
                </View>
              </View>
              <View style={styles.menuItemRight}>
                {item.badge && (
                  <View style={[styles.badge, { backgroundColor: colors.goldLight }]}>
                    <Text style={[styles.badgeText, { color: colors.gold }]}>{item.badge}</Text>
                  </View>
                )}
                <ChevronRight size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: colors.surface }]}
          onPress={signOut}
        >
          <LogOut size={20} color={colors.danger} />
          <Text style={[styles.signOutText, { color: colors.danger }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFF',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    opacity: 1,
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 24,
  },
  editButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
    opacity: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: -30,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  statsCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
    opacity: 1,
  },
  statsLabel: {
    fontSize: 15,
    opacity: 0.9,
    letterSpacing: 0.3,
    fontWeight: '500',
  },
  menuContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    opacity: 1,
  },
  menuItemDescription: {
    fontSize: 14,
    opacity: 0.85,
    fontWeight: '400',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  signOutButton: {
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 0,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 