"use client"
import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
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
  MapPin,
  AlertTriangle,
} from "lucide-react-native"
import ScreenLayout from "../components/ScreenLayout"
import { notificationService } from "../services/NotificationService"
import { LocalStorage, STORAGE_KEYS } from "../utils/storage"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Props = {
  navigation: MainTabNavigationProp
}

export default function ProfileScreen({ navigation }: Props) {
  const { colors } = useTheme()
  const { user, signOut, updateProfile, reauthenticateWithCredential } = useAuth()
  const [notificationSettings, setNotificationSettings] = useState({
    billReminders: true,
  })
  const [userData, setUserData] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteReason, setDeleteReason] = useState('')
  const [password, setPassword] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [isPasswordVerified, setIsPasswordVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  // Load notification settings and user data when component mounts
  useEffect(() => {
    loadNotificationSettings()
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const savedUserData = await LocalStorage.getData(STORAGE_KEYS.USER_DATA)
      if (savedUserData) {
        setUserData(savedUserData)
      } else {
        // If no saved data, create initial user data
        const initialUserData = {
          displayName: user?.name || '',
          email: user?.email || '',
          photoURL: null,
          location: '',
          subscription: null
        }
        setUserData(initialUserData)
        await LocalStorage.saveData(STORAGE_KEYS.USER_DATA, initialUserData)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      // Fallback to auth context data if there's an error
      setUserData({
        displayName: user?.name || '',
        email: user?.email || '',
        photoURL: null,
        location: '',
        subscription: null
      })
    }
  }

  // Refresh user data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData()
    });

    return unsubscribe;
  }, [navigation]);

  const loadNotificationSettings = async () => {
    try {
      const settings = await notificationService.getSettings()
      setNotificationSettings({
        billReminders: settings.billReminders
      })
    } catch (error) {
      console.error("Error loading notification settings:", error)
    }
  }

  const toggleNotification = async (key: keyof typeof notificationSettings) => {
    try {
      const newValue = !notificationSettings[key]
      setNotificationSettings(prev => ({
        ...prev,
        [key]: newValue
      }))
      
      await notificationService.updateSettings({
        billReminders: newValue
      })

      // If enabling notifications, immediately check for any bills that need reminders
      if (newValue && key === 'billReminders') {
        await notificationService.checkBillReminders()
      }
    } catch (error) {
      console.error("Error updating notification settings:", error)
      // Revert the toggle if there was an error
      setNotificationSettings(prev => ({
        ...prev,
        [key]: !prev[key]
      }))
    }
  }

  const handleEditProfile = () => {
    navigation.navigate("EditProfile")
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

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showDeleteModal && countdown > 0 && isPasswordVerified) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [showDeleteModal, countdown, isPasswordVerified])

  const verifyPassword = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your current password')
      return
    }

    setIsVerifying(true)
    try {
      const isValid = await reauthenticateWithCredential(password)
      if (isValid) {
        setIsPasswordVerified(true)
        setCountdown(5) // Start the countdown after password verification
      } else {
        Alert.alert('Error', 'Incorrect password. Please try again.')
        setIsPasswordVerified(false)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify password. Please try again.')
      setIsPasswordVerified(false)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleDeleteData = async () => {
    if (!isPasswordVerified) {
      Alert.alert('Error', 'Please verify your password first')
      return
    }

    if (!deleteReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for deleting your data')
      return
    }

    setIsDeleting(true)
    try {
      // Clear all financial data first
      await Promise.all([
        LocalStorage.removeData(STORAGE_KEYS.TRANSACTIONS),
        LocalStorage.removeData(STORAGE_KEYS.ACCOUNTS),
        LocalStorage.removeData(STORAGE_KEYS.CATEGORIES),
        LocalStorage.removeData(STORAGE_KEYS.BILLS),
        LocalStorage.removeData(STORAGE_KEYS.BUDGETS),
        LocalStorage.removeData(STORAGE_KEYS.REPORTS),
        LocalStorage.removeData(STORAGE_KEYS.DASHBOARD_DATA),
      ])

      // Clear all user-related data
      const keysToDelete = Object.values(STORAGE_KEYS)
      for (const key of keysToDelete) {
        await LocalStorage.removeData(key)
      }

      // Clear any remaining data in AsyncStorage
      await AsyncStorage.clear()
      
      Alert.alert(
        'Success',
        'All your data has been deleted successfully',
        [
          {
            text: 'OK',
            onPress: async () => {
              setShowDeleteModal(false)
              try {
                // Force logout
                await signOut()
                
                // Clear AsyncStorage again to ensure no data remains after signOut
                await AsyncStorage.clear()
                
                // Reset all app state
                await Promise.all([
                  LocalStorage.removeData(STORAGE_KEYS.USER_DATA),
                  LocalStorage.removeData(STORAGE_KEYS.TRANSACTIONS),
                  LocalStorage.removeData(STORAGE_KEYS.CATEGORIES),
                  LocalStorage.removeData(STORAGE_KEYS.ACCOUNTS),
                  LocalStorage.removeData(STORAGE_KEYS.BUDGETS),
                  LocalStorage.removeData(STORAGE_KEYS.SETTINGS),
                  LocalStorage.removeData(STORAGE_KEYS.BILLS),
                  LocalStorage.removeData(STORAGE_KEYS.NOTIFICATION_SETTINGS),
                  LocalStorage.removeData(STORAGE_KEYS.NOTIFICATIONS),
                  LocalStorage.removeData(STORAGE_KEYS.SENT_NOTIFICATIONS),
                  LocalStorage.removeData(STORAGE_KEYS.REPORTS),
                  LocalStorage.removeData(STORAGE_KEYS.DASHBOARD_DATA),
                ])

                // Final cleanup of ALL data
                await LocalStorage.clearAll()
                
                // Reset navigation stack to Auth screen
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Auth' }],
                })
              } catch (error) {
                console.error('Error during forced logout:', error)
              }
            }
          }
        ]
      )
    } catch (error) {
      Alert.alert('Error', 'Failed to delete data. Please try again.')
    } finally {
      setIsDeleting(false)
    }
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
      switchKey: "billReminders" as keyof typeof notificationSettings,
      switchValue: notificationSettings.billReminders,
      onToggle: () => toggleNotification("billReminders"),
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
    {
      title: "Delete All Data",
      icon: AlertTriangle,
      color: colors.danger,
      description: "Permanently delete all your data",
      onPress: () => {
        setShowDeleteModal(true)
        setCountdown(5)
        setDeleteReason('')
        setPassword('')
      },
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

  const modalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
  };

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
            {userData?.photoURL ? (
              <Image source={{ uri: userData.photoURL }} style={styles.avatar} />
            ) : (
              <User size={40} color={colors.primary} />
            )}
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            {userData?.subscription?.type === "premium" && (
              <View style={[styles.premiumBadge, { backgroundColor: colors.gold }]}>
                <Crown size={12} color={colors.surface} />
              </View>
            )}
          </View>
          <View style={styles.nameContainer}>
            <Text style={[styles.userName, { color: colors.surface }]}>
              {userData?.displayName || "User"}
              {userData?.subscription?.type === "premium" && (
                <Text style={[styles.premiumText, { color: colors.gold }]}> PRO</Text>
              )}
            </Text>
            <Text style={[styles.userEmail, { color: colors.surface }]}>
              {userData?.email || ""}
            </Text>
            {userData?.location && (
              <View style={styles.locationContainer}>
                <MapPin size={14} color={colors.surface} style={styles.locationIcon} />
                <Text style={[styles.locationText, { color: colors.surface }]}>
                  {userData.location}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={handleEditProfile}
            activeOpacity={0.7}
          >
            <Text style={[styles.editButtonText, { color: colors.surface }]}>Edit Profile</Text>
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

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowDeleteModal(false)
          setIsPasswordVerified(false)
          setPassword('')
          setDeleteReason('')
          setCountdown(5)
        }}
      >
        <View style={modalStyles.overlay}>
          <View style={[styles.modalContent, { 
            backgroundColor: colors.surface,
            margin: 20,
          }]}>
            <Text style={[styles.modalTitle, { color: colors.danger }]}>
              Delete All Data
            </Text>
            
            <Text style={[styles.modalSubtitle, { color: colors.text }]}>
              This action cannot be undone. Please tell us why you want to delete your data:
            </Text>

            <TextInput
              style={[styles.reasonInput, { 
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="Enter your reason..."
              placeholderTextColor={colors.textSecondary}
              value={deleteReason}
              onChangeText={setDeleteReason}
              multiline
              numberOfLines={3}
            />

            <Text style={[styles.modalSubtitle, { color: colors.text, marginTop: 16 }]}>
              Enter your current password to confirm:
            </Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                  flex: 1
                }]}
                placeholder="Current password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={(text) => {
                  setPassword(text)
                  setIsPasswordVerified(false)
                }}
                secureTextEntry
                editable={!isPasswordVerified}
              />
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  {
                    backgroundColor: isPasswordVerified ? colors.success : colors.primary,
                    opacity: isVerifying ? 0.7 : 1
                  }
                ]}
                onPress={verifyPassword}
                disabled={isVerifying || isPasswordVerified || !password.trim()}
              >
                {isVerifying ? (
                  <ActivityIndicator color={colors.surface} />
                ) : (
                  <Text style={[styles.buttonText, { color: colors.surface }]}>
                    {isPasswordVerified ? 'Verified' : 'Verify'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {isPasswordVerified && (
              <Text style={[styles.timerText, { color: colors.textSecondary }]}>
                Delete button will be enabled in: {countdown}s
              </Text>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.background }]}
                onPress={() => {
                  setShowDeleteModal(false)
                  setIsPasswordVerified(false)
                  setPassword('')
                  setDeleteReason('')
                  setCountdown(5)
                }}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  {
                    backgroundColor: colors.danger,
                    opacity: countdown === 0 && isPasswordVerified && deleteReason ? 1 : 0.5
                  }
                ]}
                onPress={handleDeleteData}
                disabled={countdown > 0 || !isPasswordVerified || !deleteReason || isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color={colors.surface} />
                ) : (
                  <Text style={[styles.buttonText, { color: colors.surface }]}>
                    Delete All Data
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationIcon: {
    marginRight: 4,
    opacity: 0.8,
  },
  locationText: {
    fontSize: 14,
    opacity: 0.8,
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  reasonInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  passwordContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  verifyButton: {
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  timerText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
})
