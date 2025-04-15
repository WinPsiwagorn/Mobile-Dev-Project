"use client"
import React, { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from "react-native"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import {
  User,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  Crown,
  LogOut,
} from "lucide-react-native"
import ScreenLayout from "../components/ScreenLayout"

type Props = {
  navigation: MainTabNavigationProp
}

export default function ProfileScreen({ navigation }: Props) {
  const { colors } = useTheme()
  const { user, signOut } = useAuth()

  const handleEditProfile = () => {
    navigation.navigate("EditProfile")
  }

  const [notificationToggles, setNotificationToggles] = useState({
    billReminders: true,
  })

  const toggleSwitch = (key: keyof typeof notificationToggles) => {
    setNotificationToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut()
            } catch (error) {
              console.error("Error signing out:", error)
              Alert.alert("Error", "Failed to sign out. Please try again.")
            }
          }
        }
      ]
    )
  }

  // Grouped Menu Items
  const subscriptionItems = [
    {
      title: "Premium Account",
      icon: Crown,
      color: colors.gold,
      badge: user?.subscription?.type === "premium" ? "ACTIVE" : "UPGRADE",
      description: user?.subscription?.type === "premium" 
        ? `Premium ${user.subscription.plan} plan - Valid until ${new Date(user.subscription.validUntil || "").toLocaleDateString()}`
        : "Unlock exclusive features",
      onPress: () => navigation.navigate("PremiumAccountDetails"),
    },
  ]

  const notificationItems = [
    {
      title: "Bill Reminders",
      icon: Bell,
      color: colors.warning,
      description: "Receive reminders for upcoming bills",
      switchKey: "billReminders",
      switchValue: notificationToggles.billReminders,
      onToggle: () => toggleSwitch("billReminders"),
    },
  ]

  const supportItems = [
    {
      title: "Contact Us",
      icon: Shield,
      color: colors.success,
      description: "Get in touch with us",
      onPress: () => navigation.navigate("ContactUs"),
    },
    {
      title: "Term & Privacy",
      icon: HelpCircle,
      color: colors.accent,
      description: "Legal information",
      onPress: () => navigation.navigate("TermPrivacy"),
    },
  ]

  const renderMenuSection = (title: string, items: any[]) => (
    <View style={[styles.sectionContainer, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.menuItem,
            index !== items.length - 1 && styles.menuItemBorder,
            { borderBottomColor: colors.border },
          ]}
          onPress={item.onPress}
          activeOpacity={item.onPress ? 0.7 : 1}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
              <item.icon size={20} color={item.color} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={[styles.menuItemTitle, { color: colors.text }]}>{item.title}</Text>
              {item.description && (
                <Text style={[styles.menuItemDescription, { color: colors.textSecondary }]}>
                  {item.description}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.menuItemRight}>
            {item.switchKey !== undefined ? (
              <Switch
                value={item.switchValue}
                onValueChange={item.onToggle}
                trackColor={{
                  false: "rgba(255, 255, 255, 0.3)",
                  true: `${item.color}80`,
                }}
                thumbColor={item.switchValue ? item.color : "#FFFFFF"}
                ios_backgroundColor="rgba(255, 255, 255, 0.3)"
                style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
              />
            ) : (
              <>
                {item.badge && (
                  <View style={[styles.badge, { backgroundColor: colors.goldLight }]}>
                    <Text style={[styles.badgeText, { color: colors.gold }]}>{item.badge}</Text>
                  </View>
                )}
                <ChevronRight size={20} color={colors.textSecondary} />
              </>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )

  return (
    <ScreenLayout backgroundColor={colors.background}>
      {/* Header */}
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.surface }]}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <User size={40} color={colors.primary} />
            )}
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            {user?.subscription?.type === "premium" && (
              <View style={[styles.premiumBadge, { backgroundColor: colors.gold }]}>
                <Crown size={12} color={colors.surface} />
              </View>
            )}
          </View>
          <View style={styles.nameContainer}>
            <Text style={[styles.userName, { color: colors.surface }]}>
              {user?.name || "User"}
              {user?.subscription?.type === "premium" && (
                <Text style={[styles.premiumText, { color: colors.gold }]}> PRO</Text>
              )}
            </Text>
            <Text style={[styles.userEmail, { color: colors.surface }]}>{user?.email || ""}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderMenuSection("Subscription", subscriptionItems)}
        {renderMenuSection("Notification", notificationItems)}
        {renderMenuSection("Help & Support", supportItems)}

        {/* Sign Out */}
        <TouchableOpacity style={[styles.signOutButton, { backgroundColor: colors.surface }]} onPress={handleSignOut}>
          <LogOut size={20} color={colors.danger} />
          <Text style={[styles.signOutText, { color: colors.danger }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileHeader: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
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
    borderColor: "#FFF",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
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
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: "700",
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
  sectionContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    paddingHorizontal: 16,
    opacity: 0.9,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    opacity: 1,
  },
  menuItemDescription: {
    fontSize: 14,
    opacity: 0.85,
    fontWeight: "400",
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  signOutButton: {
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
  },
  premiumBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  nameContainer: {
    alignItems: 'center',
  },
  premiumText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
})
