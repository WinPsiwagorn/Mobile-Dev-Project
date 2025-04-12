"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, CreditCard, PiggyBank } from "lucide-react-native"
import type { MainTabNavigationProp } from "../types/navigation"
import { useTheme } from "../context/ThemeContext"
import { useFinance } from "../context/FinanceContext"
import ScreenLayout from "../components/ScreenLayout"

type RouteParams = {
  transaction: {
    id: string
    type: "income" | "expense"
    amount: number
    date: string
    description: string
    accountId: string
    category: string
    customCategoryDescription?: string
  }
}

export default function TransactionDetailsScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const route = useRoute()
  const { transaction } = route.params as RouteParams
  const { colors } = useTheme()
  const { accounts } = useFinance()

  // Get the account associated with this transaction
  const account = accounts.find(acc => acc.id === transaction.accountId)
  if (!account) return null

  // Get appropriate icon and color based on transaction type
  const StatusIcon = transaction.type === "income" ? TrendingUp : TrendingDown
  const AccountIcon = account.type === "savings" ? PiggyBank : CreditCard
  const statusColor = transaction.type === "income" ? colors.success : colors.danger

  return (
    <ScreenLayout backgroundColor={colors.background}>
      <LinearGradient
        colors={account.type === "savings" 
          ? [colors.accountTypes.savings.gradient[0], colors.accountTypes.savings.gradient[1]]
          : [colors.accountTypes.general.gradient[0], colors.accountTypes.general.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: "rgba(255,255,255,0.15)" }]} 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={colors.surface} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.surface }]}>Transaction Details</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={[styles.card, { 
          backgroundColor: colors.glass.background,
          borderColor: colors.glass.border 
        }]}>
          <View style={[styles.iconContainer, { backgroundColor: `${statusColor}15` }]}>
            <StatusIcon size={32} color={statusColor} />
          </View>

          <Text style={[styles.amount, { color: statusColor }]}>
            {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </Text>

          <Text style={[styles.description, { color: colors.text }]}>{transaction.description}</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {new Date(transaction.date).toLocaleDateString("en-US", {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.glass.border }]} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Type</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Category</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{transaction.category}</Text>
          </View>

          {transaction.category === "Custom" && transaction.customCategoryDescription && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Category Details</Text>
              <Text style={[styles.detailValue, { color: colors.text, maxWidth: '70%', textAlign: 'right' }]}>
                {transaction.customCategoryDescription}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Account</Text>
            <View style={styles.accountDetail}>
              <View style={[styles.accountIcon, { 
                backgroundColor: `${account.type === "savings" ? colors.accountTypes.savings.primary : colors.accountTypes.general.primary}15` 
              }]}>
                <AccountIcon 
                  size={16} 
                  color={account.type === "savings" ? colors.accountTypes.savings.primary : colors.accountTypes.general.primary} 
                />
              </View>
              <Text style={[styles.detailValue, { color: colors.text }]}>{account.name}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  amount: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  divider: {
    height: 1,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
  },
  accountDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  }
});
