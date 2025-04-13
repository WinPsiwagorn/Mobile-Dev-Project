"use client"

import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import type { MainTabNavigationProp } from "../types/navigation"
import { useTheme, globalStyles } from "../context/ThemeContext"
import { LinearGradient } from "expo-linear-gradient"
import { Plus, Calendar, CheckCircle2, Clock, AlertCircle, ArrowLeft } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import ScreenLayout from "../components/ScreenLayout"
import { useFinance } from "../context/FinanceContext"
import type { Bill } from "../utils/financeService"
import { formatCurrency } from "../utils/financeService"

const { width } = Dimensions.get("window")

type IconName = "flash" | "home" | "wifi" | "phone" | "shield" | "receipt"

export default function BillsScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const { colors } = useTheme()
  const { bills = [], loadingBills } = useFinance()
  const [activeFilter, setActiveFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return colors.success
      case "pending":
        return colors.warning
      case "overdue":
        return colors.danger
      default:
        return colors.textSecondary
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return CheckCircle2
      case "pending":
        return Clock
      case "overdue":
        return AlertCircle
      default:
        return Clock
    }
  }

  const getBillIcon = (bill: Bill): IconName => {
    if (!bill?.category) return "receipt"
    
    switch (bill.category.toLowerCase()) {
      case "utilities":
        return "flash"
      case "rent":
        return "home"
      case "internet":
        return "wifi"
      case "phone":
        return "phone"
      case "insurance":
        return "shield"
      default:
        return "receipt"
    }
  }

  const totalAmount = bills.reduce((sum: number, bill: Bill) => sum + (bill?.amount || 0), 0)
  const paidAmount = bills
    .filter((bill: Bill) => bill?.status === "paid")
    .reduce((sum: number, bill: Bill) => sum + (bill?.amount || 0), 0)
  const pendingAmount = bills
    .filter((bill: Bill) => bill?.status === "pending")
    .reduce((sum: number, bill: Bill) => sum + (bill?.amount || 0), 0)

  const filteredBills = bills.filter((bill: Bill) => {
    if (!bill) return false
    if (activeFilter === "all") return true
    return bill.status === activeFilter
  })

  if (loadingBills) {
    return (
      <ScreenLayout backgroundColor={colors.background}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading bills...</Text>
        </View>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout backgroundColor={colors.background}>
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.navigate("Main")}
            >
              <ArrowLeft size={24} color={colors.surface} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.surface }]}>Bills</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddBill")}>
            <Plus size={22} color={colors.surface} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.summaryContainer}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <View style={[styles.summaryCard, globalStyles.glass]}>
            <Text style={[styles.summaryLabel, { color: colors.surface }]}>Total Bills</Text>
            <Text style={[styles.summaryAmount, { color: colors.surface }]}>${totalAmount.toFixed(2)}</Text>
            <Text style={[styles.summarySubtext, { color: colors.surface }]}>
              {bills.length} bills this month
            </Text>
          </View>

          <View style={[styles.summaryCard, globalStyles.glass]}>
            <Text style={[styles.summaryLabel, { color: colors.surface }]}>Paid</Text>
            <Text style={[styles.summaryAmount, { color: colors.surface }]}>${paidAmount.toFixed(2)}</Text>
            <Text style={[styles.summarySubtext, { color: colors.surface }]}>
              {bills.filter((b: Bill) => b?.status === "paid").length} bills paid
            </Text>
          </View>

          <View style={[styles.summaryCard, globalStyles.glass]}>
            <Text style={[styles.summaryLabel, { color: colors.surface }]}>Pending</Text>
            <Text style={[styles.summaryAmount, { color: colors.surface }]}>${pendingAmount.toFixed(2)}</Text>
            <Text style={[styles.summarySubtext, { color: colors.surface }]}>
              {bills.filter((b: Bill) => b?.status === "pending").length} bills pending
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>

      <View style={styles.content}>
        <View style={[styles.filterContainer, globalStyles.glass]}>
          {["all", "pending", "paid", "overdue"].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, { backgroundColor: activeFilter === filter ? colors.primary : "transparent" }]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[styles.filterText, { color: activeFilter === filter ? colors.surface : colors.textSecondary }]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.billsContainer}>
          {filteredBills.map((bill: Bill) => (
            <TouchableOpacity
              key={bill?.id}
              style={[styles.billCard, globalStyles.glass]}
              onPress={() => navigation.navigate("BillDetails", { id: bill?.id || "" })}
            >
              <View style={styles.billHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${getStatusColor(bill?.status || "pending")}15` }]}>
                  <MaterialCommunityIcons 
                    name={getBillIcon(bill)} 
                    size={24} 
                    color={getStatusColor(bill?.status || "pending")} 
                  />
                </View>
                <View style={styles.billInfo}>
                  <Text style={[styles.billTitle, { color: colors.text }]}>{bill?.name || "Unnamed Bill"}</Text>
                  <Text style={[styles.billCategory, { color: colors.textSecondary }]}>
                    {bill?.status?.charAt(0).toUpperCase() + bill?.status?.slice(1) || "Pending"}
                  </Text>
                </View>
                <View style={styles.billAmount}>
                  <Text style={[styles.amountText, { color: colors.text }]}>${(bill?.amount || 0).toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.billFooter}>
                <View style={styles.dateContainer}>
                  <Calendar size={14} color={colors.textSecondary} />
                  <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                    Due {bill?.dueDate ? new Date(bill.dueDate).toLocaleDateString() : "No due date"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
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
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  summaryContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    width: 200,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  summarySubtext: {
    fontSize: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterContainer: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 4,
    marginBottom: 20,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: "center",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  billsContainer: {
    gap: 12,
  },
  billCard: {
    padding: 16,
    borderRadius: 16,
  },
  billHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  billCategory: {
    fontSize: 14,
  },
  billAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "600",
  },
  billFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
})
