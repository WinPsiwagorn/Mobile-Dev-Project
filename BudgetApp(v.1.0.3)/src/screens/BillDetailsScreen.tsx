"use client"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal } from "react-native"
import { useTheme } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  CreditCard,
  Bell,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useFinance } from "../context/FinanceContext"
import { useState } from "react"

const { width } = Dimensions.get("window")

// Mock data - replace with actual data from your backend
const BILL_DATA = {
  id: "1",
  name: "Electricity Bill",
  amount: 150.5,
  dueDate: "2024-04-15",
  status: "pending",
  category: "Utilities",
  paymentMethod: "Credit Card",
  recurring: true,
  frequency: "Monthly",
  lastPaid: "2024-03-15",
  nextPayment: "2024-04-15",
  notes: "Pay before due date to avoid late fees",
}

export default function BillDetailsScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const route = useRoute()
  const { colors } = useTheme()
  const { id } = route.params as { id: string }
  const { accounts } = useFinance()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState("")

  // In a real app, you would fetch bill details using the id
  const bill = BILL_DATA

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return colors.success
      case "pending":
        return colors.warning
      case "overdue":
        return colors.error
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
        return XCircle
    }
  }

  const StatusIcon = getStatusIcon(bill.status)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handlePayBill = async () => {
    if (!selectedAccountId) return

    try {
      // Here you would implement the actual bill payment logic
      // For example:
      // await payBill(bill.id, selectedAccountId)
      console.log("Paying bill", bill.id, "with account", selectedAccountId)
      navigation.goBack()
    } catch (error) {
      console.error("Error paying bill:", error)
    }
  }

  const PaymentModal = () => (
    <Modal
      visible={showPaymentModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowPaymentModal(false)}
    >
      <View style={[styles.modalOverlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Select Payment Account</Text>
          <ScrollView style={styles.accountList}>
            {accounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountItem,
                  {
                    backgroundColor: selectedAccountId === account.id ? `${colors.primary}15` : "transparent",
                    borderColor: selectedAccountId === account.id ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedAccountId(account.id)}
              >
                <View style={styles.accountInfo}>
                  <Text style={[styles.accountName, { color: colors.text }]}>{account.name}</Text>
                  <Text style={[styles.accountBalance, { color: colors.textSecondary }]}>
                    Balance: ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </Text>
                </View>
                {selectedAccountId === account.id && (
                  <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                    <CheckCircle2 size={16} color={colors.surface} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
              onPress={() => setShowPaymentModal(false)}
            >
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.confirmButton,
                { backgroundColor: colors.primary, opacity: selectedAccountId ? 1 : 0.5 },
              ]}
              onPress={handlePayBill}
              disabled={!selectedAccountId}
            >
              <Text style={[styles.modalButtonText, { color: colors.surface }]}>Confirm Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.gradient[0], colors.gradient[1]]} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.surface} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.surface }]}>Bill Details</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Bill Status */}
        <View style={[styles.card, { backgroundColor: colors.glass.background }]}>
          <View style={styles.statusContainer}>
            <StatusIcon size={24} color={getStatusColor(bill.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(bill.status) }]}>
              {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
            </Text>
          </View>
          <Text style={[styles.billName, { color: colors.text }]}>{bill.name}</Text>
          <Text style={[styles.billAmount, { color: colors.text }]}>{formatCurrency(bill.amount)}</Text>
        </View>

        {/* Bill Details */}
        <View style={[styles.card, { backgroundColor: colors.glass.background }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Bill Details</Text>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Calendar size={20} color={colors.textSecondary} />
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Due Date</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {new Date(bill.dueDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <CreditCard size={20} color={colors.textSecondary} />
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Payment Method</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{bill.paymentMethod}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Bell size={20} color={colors.textSecondary} />
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Frequency</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{bill.frequency}</Text>
            </View>
            <View style={styles.detailItem}>
              <DollarSign size={20} color={colors.textSecondary} />
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Category</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{bill.category}</Text>
            </View>
          </View>
        </View>

        {/* Payment History */}
        <View style={[styles.card, { backgroundColor: colors.glass.background }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Payment History</Text>
          <View style={styles.paymentHistory}>
            <View style={styles.paymentItem}>
              <Text style={[styles.paymentDate, { color: colors.textSecondary }]}>Last Paid</Text>
              <Text style={[styles.paymentValue, { color: colors.text }]}>
                {new Date(bill.lastPaid).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.paymentItem}>
              <Text style={[styles.paymentDate, { color: colors.textSecondary }]}>Next Payment</Text>
              <Text style={[styles.paymentValue, { color: colors.text }]}>
                {new Date(bill.nextPayment).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        <View style={[styles.card, { backgroundColor: colors.glass.background }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Notes</Text>
          <Text style={[styles.notes, { color: colors.textSecondary }]}>{bill.notes}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowPaymentModal(true)}
          >
            <Text style={[styles.actionButtonText, { color: colors.surface }]}>Pay Bill</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error }]}
            onPress={() => {
              // TODO: Implement delete bill functionality
              console.log("Delete bill pressed")
            }}
          >
            <Text style={[styles.actionButtonText, { color: colors.surface }]}>Delete Bill</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <PaymentModal />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  billName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  billAmount: {
    fontSize: 32,
    fontWeight: "700",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  paymentHistory: {
    gap: 12,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentDate: {
    fontSize: 14,
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  notes: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionButtons: {
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  accountList: {
    maxHeight: 300,
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 14,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    borderWidth: 0,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
})
