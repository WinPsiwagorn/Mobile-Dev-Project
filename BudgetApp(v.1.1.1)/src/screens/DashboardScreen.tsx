"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, ScrollView, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { MainTabNavigationProp, MainTabParamList } from "../types/navigation"
import { useAuth } from "../context/AuthContext"
import { createAnimationHooks } from "../utils/animations"
import { useFinance } from "../context/FinanceContext"

const { width } = Dimensions.get("window")

// Add constants for bottom spacing
const TAB_BAR_HEIGHT = 88
const BOTTOM_SPACING = Platform.select({
  ios: 24,
  android: 16,
  default: 16,
})
const TOTAL_BOTTOM_HEIGHT = TAB_BAR_HEIGHT + (Platform.OS === "ios" ? BOTTOM_SPACING : BOTTOM_SPACING)

type IconName = keyof typeof Ionicons.glyphMap
type ScreenName = keyof MainTabParamList

interface QuickAction {
  id: string
  icon: IconName
  label: string
  description: string
  gradient: readonly [string, string]
  screen: ScreenName
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "add",
    icon: "add-circle-outline",
    label: "Add Transaction",
    description: "Record your income and expenses",
    gradient: ["#FF8F3F", "#E67E38"] as const,
    screen: "AddTransaction",
  },
  {
    id: "accounts",
    icon: "wallet-outline",
    label: "Accounts",
    description: "Manage your accounts",
    gradient: ["#FF8F3F", "#E67E38"] as const,
    screen: "Accounts",
  },
  {
    id: "bills",
    icon: "document-text-outline",
    label: "Pay Bills",
    description: "Track and pay your bills",
    gradient: ["#FF8F3F", "#E67E38"] as const,
    screen: "Bills",
  },
  {
    id: "analytics",
    icon: "pie-chart-outline",
    label: "Analytics",
    description: "View your spending insights",
    gradient: ["#FF8F3F", "#E67E38"] as const,
    screen: "Reports",
  },
]

export default function DashboardScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const { user } = useAuth()
  const { accounts, transactions, isLoading } = useFinance()
  const { glowAnim, pulseAnim, backgroundAnim, contentAnim, glowOpacity, fadeInScale, startAnimations } =
    createAnimationHooks()

  useEffect(() => {
    // Start animations only once when component mounts
    const animationTimeout = setTimeout(() => {
      startAnimations()
    }, 100)

    return () => {
      clearTimeout(animationTimeout)
    }
  }, [])

  // Calculate total balance from all accounts
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  // Calculate total income and expenses from transactions
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const renderQuickAction = (item: QuickAction) => (
    <TouchableOpacity
      key={item.id}
      style={styles.quickActionButton}
      onPress={() => {
        if (item.screen === "AddTransaction") {
          navigation.navigate("AddTransaction", { type: "expense" })
        } else if (item.screen === "Accounts") {
          navigation.navigate("Accounts", undefined)
        } else if (item.screen === "Bills") {
          navigation.navigate("Bills", undefined)
        } else if (item.screen === "Reports") {
          navigation.navigate("Reports", undefined)
        }
      }}
    >
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.quickActionGradient}
      >
        <Animated.View
          style={[
            styles.quickActionGlow,
            {
              opacity: glowOpacity,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
        <Ionicons name={item.icon} size={28} color="#FFFFFF" />
        <Text style={styles.quickActionText}>{item.label}</Text>
        <Text style={styles.quickActionDescription}>{item.description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={["#FFB23F", "#FF8F3F"] as const} style={styles.headerGradient}>
          <Animated.View 
            style={[
              styles.header, 
              fadeInScale,
              { opacity: 1 } // Ensure header is always visible
            ]}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logo} />
            </View>
            <Text style={styles.welcomeText}>Welcome back, {user?.name || "User"}</Text>
            <Text style={styles.subtitleText}>Your financial summary</Text>
          </Animated.View>

          <Animated.View 
            style={[
              styles.balanceCard, 
              fadeInScale,
              { opacity: 1 } // Ensure balance card is always visible
            ]}
          >
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.balanceGradient}
            >
              <Animated.View
                style={[
                  styles.balanceGlow,
                  {
                    opacity: glowOpacity,
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              />
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <Text style={styles.balanceAmount}>
                ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Text>
              <View style={styles.balanceMetrics}>
                <View style={[styles.metric, { backgroundColor: "rgba(255, 255, 255, 0.1)" }]}>
                  <Ionicons name="arrow-up-outline" size={20} color="#FFFFFF" />
                  <Text style={[styles.metricLabel, { color: "#FFFFFF" }]}>Income</Text>
                  <Text style={[styles.metricAmount, { color: "#FFFFFF" }]}>
                    +${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </Text>
                </View>
                <View style={[styles.metric, { backgroundColor: "rgba(255, 255, 255, 0.1)" }]}>
                  <Ionicons name="arrow-down-outline" size={20} color="#FFFFFF" />
                  <Text style={[styles.metricLabel, { color: "#FFFFFF" }]}>Expenses</Text>
                  <Text style={[styles.metricAmount, { color: "#FFFFFF" }]}>
                    -${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </LinearGradient>

        <View style={styles.content}>
          <Animated.View 
            style={[
              fadeInScale,
              { opacity: 1 } // Ensure content is always visible
            ]}
          >
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>{QUICK_ACTIONS.map(renderQuickAction)}</View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: TOTAL_BOTTOM_HEIGHT + 20, // Add padding to prevent content from being hidden
  },
  headerGradient: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 30,
    height: 30,
    backgroundColor: "#FFB23F",
    transform: [{ rotate: "45deg" }],
    borderRadius: 5,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitleText: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  balanceCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 143, 63, 0.2)",
    shadowColor: "#FF8F3F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceGradient: {
    padding: 24,
    position: "relative",
    backgroundColor: "rgba(26, 26, 26, 0.95)",
  },
  balanceGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#E67E38",
    opacity: 0.08,
  },
  balanceLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 24,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  balanceMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  metric: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  metricLabel: {
    fontSize: 14,
    marginVertical: 4,
  },
  metricAmount: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 32,
  },
  quickActionButton: {
    width: (width - 56) / 2,
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#FF8F3F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  quickActionGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    position: "relative",
    backgroundColor: "rgba(26, 26, 26, 0.95)",
  },
  quickActionGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#E67E38",
    opacity: 0.08,
  },
  quickActionText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  quickActionDescription: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    paddingHorizontal: 8,
  },
})
