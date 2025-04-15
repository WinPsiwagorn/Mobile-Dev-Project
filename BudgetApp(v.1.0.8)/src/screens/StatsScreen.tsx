"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { useTheme, globalStyles } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import { DollarSign, PieChart, BarChart3, LineChart, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react-native"

const { width } = Dimensions.get("window")

type Props = {
  navigation: MainTabNavigationProp
}

type TimeRange = "week" | "month" | "year"
type ChartType = "bar" | "line" | "pie"

export default function StatsScreen({ navigation }: Props) {
  const { colors } = useTheme()
  const [timeRange, setTimeRange] = useState<TimeRange>("month")
  const [chartType, setChartType] = useState<ChartType>("bar")

  const stats = {
    income: 8500,
    expenses: 4200,
    savings: 4300,
    incomeChange: 12.5,
    expensesChange: -8.3,
    savingsChange: 15.2,
    topCategories: [
      { name: "Housing", amount: 1800, percentage: 42.9, color: colors.primary },
      { name: "Food", amount: 850, percentage: 20.2, color: colors.secondary },
      { name: "Transport", amount: 650, percentage: 15.5, color: colors.accent },
      { name: "Shopping", amount: 500, percentage: 11.9, color: colors.gold },
      { name: "Entertainment", amount: 400, percentage: 9.5, color: colors.warning },
    ],
    insights: [
      {
        title: "Spending Pattern",
        message: "Your housing expenses are 15% higher than last month.",
        type: "warning",
      },
      {
        title: "Savings Goal",
        message: "You're on track to reach your savings goal by December.",
        type: "success",
      },
      {
        title: "Budget Alert",
        message: "You've stayed under budget in 7 out of 8 categories.",
        type: "info",
      },
    ],
  }

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
          <Text style={[styles.headerTitle, { color: colors.surface }]}>Statistics</Text>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.glass.background }]}>
            <Filter size={20} color={colors.surface} />
          </TouchableOpacity>
        </View>

        {/* Time Range Selector */}
        <View style={[styles.timeRangeContainer, globalStyles.glass]}>
          {(["week", "month", "year"] as TimeRange[]).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                { backgroundColor: timeRange === range ? colors.primary : "transparent" },
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                style={[styles.timeRangeText, { color: timeRange === range ? colors.surface : colors.textSecondary }]}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.overviewContainer}>
          <View style={[styles.overviewCard, globalStyles.glass]}>
            <View style={styles.overviewHeader}>
              <DollarSign size={20} color={colors.primary} />
              <Text style={[styles.overviewLabel, { color: colors.text }]}>Income</Text>
            </View>
            <Text style={[styles.overviewAmount, { color: colors.text }]}>${stats.income.toLocaleString()}</Text>
            <View
              style={[
                styles.changeContainer,
                { backgroundColor: stats.incomeChange > 0 ? "rgba(0,255,0,0.1)" : "rgba(255,0,0,0.1)" },
              ]}
            >
              {stats.incomeChange > 0 ? (
                <ArrowUpRight size={16} color={colors.success} />
              ) : (
                <ArrowDownRight size={16} color={colors.danger} />
              )}
              <Text style={[styles.changeText, { color: stats.incomeChange > 0 ? colors.success : colors.danger }]}>
                {Math.abs(stats.incomeChange)}%
              </Text>
            </View>
          </View>

          <View style={[styles.overviewCard, globalStyles.glass]}>
            <View style={styles.overviewHeader}>
              <DollarSign size={20} color={colors.secondary} />
              <Text style={[styles.overviewLabel, { color: colors.text }]}>Expenses</Text>
            </View>
            <Text style={[styles.overviewAmount, { color: colors.text }]}>${stats.expenses.toLocaleString()}</Text>
            <View
              style={[
                styles.changeContainer,
                { backgroundColor: stats.expensesChange > 0 ? "rgba(255,0,0,0.1)" : "rgba(0,255,0,0.1)" },
              ]}
            >
              {stats.expensesChange > 0 ? (
                <ArrowUpRight size={16} color={colors.danger} />
              ) : (
                <ArrowDownRight size={16} color={colors.success} />
              )}
              <Text style={[styles.changeText, { color: stats.expensesChange > 0 ? colors.danger : colors.success }]}>
                {Math.abs(stats.expensesChange)}%
              </Text>
            </View>
          </View>

          <View style={[styles.overviewCard, globalStyles.glass]}>
            <View style={styles.overviewHeader}>
              <DollarSign size={20} color={colors.accent} />
              <Text style={[styles.overviewLabel, { color: colors.text }]}>Savings</Text>
            </View>
            <Text style={[styles.overviewAmount, { color: colors.text }]}>${stats.savings.toLocaleString()}</Text>
            <View
              style={[
                styles.changeContainer,
                { backgroundColor: stats.savingsChange > 0 ? "rgba(0,255,0,0.1)" : "rgba(255,0,0,0.1)" },
              ]}
            >
              {stats.savingsChange > 0 ? (
                <ArrowUpRight size={16} color={colors.success} />
              ) : (
                <ArrowDownRight size={16} color={colors.danger} />
              )}
              <Text style={[styles.changeText, { color: stats.savingsChange > 0 ? colors.success : colors.danger }]}>
                {Math.abs(stats.savingsChange)}%
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Chart Type Selector */}
        <View style={[styles.chartTypeContainer, globalStyles.glass]}>
          {(["bar", "line", "pie"] as ChartType[]).map((type) => {
            const Icon = type === "bar" ? BarChart3 : type === "line" ? LineChart : PieChart
            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chartTypeButton,
                  { backgroundColor: chartType === type ? colors.primary : "transparent" },
                ]}
                onPress={() => setChartType(type)}
              >
                <Icon size={20} color={chartType === type ? colors.surface : colors.textSecondary} />
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Chart Placeholder */}
        <View style={[styles.chartContainer, globalStyles.glass]}>
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>Chart Visualization</Text>
        </View>

        {/* Top Categories */}
        <View style={[styles.categoriesCard, globalStyles.glass]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Categories</Text>
          {stats.topCategories.map((category, index) => (
            <View key={index} style={styles.categoryRow}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
              </View>
              <View style={styles.categoryRight}>
                <Text style={[styles.categoryAmount, { color: colors.text }]}>${category.amount}</Text>
                <Text style={[styles.categoryPercentage, { color: colors.textSecondary }]}>{category.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Insights */}
        <View style={[styles.insightsCard, globalStyles.glass]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Smart Insights</Text>
          {stats.insights.map((insight, index) => (
            <View
              key={index}
              style={[
                styles.insightItem,
                index < stats.insights.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.glass.border,
                },
              ]}
            >
              <Text style={[styles.insightTitle, { color: colors.text }]}>{insight.title}</Text>
              <Text style={[styles.insightMessage, { color: colors.textSecondary }]}>{insight.message}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  timeRangeContainer: {
    flexDirection: "row",
    margin: 20,
    padding: 4,
    borderRadius: 20,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: "center",
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  overviewContainer: {
    marginBottom: 20,
  },
  overviewCard: {
    width: width * 0.7,
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
  },
  overviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  overviewLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  overviewAmount: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  chartTypeContainer: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 20,
    marginBottom: 20,
  },
  chartTypeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: "center",
  },
  chartContainer: {
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
  },
  categoriesCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
  },
  categoryRight: {
    alignItems: "flex-end",
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
  },
  insightsCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  insightItem: {
    paddingVertical: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  insightMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
})
