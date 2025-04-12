"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { useTheme, globalStyles } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import ScreenLayout from "../components/ScreenLayout"

const { width } = Dimensions.get("window")

const REPORT_TYPES = [
  {
    id: "expenses",
    icon: "trending-down-outline",
    label: "Expenses",
    amount: 2340.0,
    change: -12.5,
  },
  {
    id: "income",
    icon: "trending-up-outline",
    label: "Income",
    amount: 6520.0,
    change: 8.3,
  },
  {
    id: "savings",
    icon: "wallet-outline",
    label: "Savings",
    amount: 4180.0,
    change: 15.7,
  },
  {
    id: "investments",
    icon: "bar-chart-outline",
    label: "Investments",
    amount: 12500.0,
    change: 5.2,
  },
]

const CATEGORIES = [
  { id: "shopping", name: "Shopping", amount: 850.0, percentage: 35 },
  { id: "food", name: "Food & Drinks", amount: 620.0, percentage: 25 },
  { id: "transport", name: "Transport", amount: 450.0, percentage: 20 },
  { id: "utilities", name: "Utilities", amount: 320.0, percentage: 15 },
  { id: "others", name: "Others", amount: 100.0, percentage: 5 },
]

export default function ReportsScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const { colors } = useTheme()
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [timeRange, setTimeRange] = useState("This Month")
  const [chartType, setChartType] = useState("expenses")

  // Mock data
  const spendingByCategory = [
    { category: "Shopping", amount: 2450.8, percentage: 35 },
    { category: "Food & Drinks", amount: 1850.5, percentage: 25 },
    { category: "Transportation", amount: 950.3, percentage: 15 },
    { category: "Entertainment", amount: 750.2, percentage: 12 },
    { category: "Others", amount: 650.7, percentage: 13 },
  ]

  return (
    <ScreenLayout backgroundColor={colors.background}>
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={[styles.headerTitle, { color: colors.surface }]}>Reports</Text>
        <View style={[styles.periodSelector, { backgroundColor: "rgba(255, 255, 255, 0.1)" }]}>
          {["week", "month", "year"].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && [styles.selectedPeriod, { backgroundColor: "rgba(255, 255, 255, 0.2)" }],
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodText,
                  { color: colors.surface },
                  selectedPeriod === period && styles.selectedPeriodText,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.reportGrid}>
          {REPORT_TYPES.map((report) => (
            <TouchableOpacity key={report.id} style={[styles.reportCard, globalStyles.glass]}>
              <View style={styles.reportIcon}>
                <Ionicons name={report.icon as any} size={24} color={colors.primary} />
              </View>
              <Text style={[styles.reportLabel, { color: colors.text }]}>{report.label}</Text>
              <Text style={[styles.reportAmount, { color: colors.text }]}>${report.amount.toFixed(2)}</Text>
              <View
                style={[
                  styles.changeIndicator,
                  {
                    backgroundColor: report.change > 0 ? `${colors.success}15` : `${colors.danger}15`,
                  },
                ]}
              >
                <Ionicons
                  name={report.change > 0 ? "arrow-up" : "arrow-down"}
                  size={16}
                  color={report.change > 0 ? colors.success : colors.danger}
                />
                <Text style={[styles.changeText, { color: report.change > 0 ? colors.success : colors.danger }]}>
                  {Math.abs(report.change)}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Spending by Category</Text>
          {CATEGORIES.map((category) => (
            <View key={category.id} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                <Text style={[styles.categoryAmount, { color: colors.text }]}>${category.amount.toFixed(2)}</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${category.percentage}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
                <Text style={[styles.percentageText, { color: colors.textSecondary }]}>{category.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  periodSelector: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  selectedPeriod: {
    borderRadius: 8,
  },
  periodText: {
    fontSize: 14,
    fontWeight: "600",
  },
  selectedPeriodText: {
    opacity: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  reportGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  reportCard: {
    width: (width - 56) / 2,
    padding: 16,
    borderRadius: 16,
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "rgba(255, 178, 63, 0.1)",
  },
  reportLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  reportAmount: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  changeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  changeText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  categoryRow: {
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  percentageText: {
    position: "absolute",
    right: 0,
    top: 12,
    fontSize: 12,
  },
})
