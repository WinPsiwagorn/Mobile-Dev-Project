"use client"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal, Alert } from "react-native"
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
import { useState, useEffect } from "react"
import { Ionicons } from "@expo/vector-icons"
import { sharedStyles } from "../utils/animations"

const { width } = Dimensions.get("window")

type RouteParams = {
  id: string
}

export default function BillDetailsScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const route = useRoute()
  const { colors } = useTheme()
  const { id } = route.params as RouteParams
  const { bills, accounts, updateBill, updateAccount, deleteBill } = useFinance()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showInsufficientFundsModal, setShowInsufficientFundsModal] = useState(false)
  const [showPaymentConfirmationModal, setShowPaymentConfirmationModal] = useState(false)
  const [insufficientFundsData, setInsufficientFundsData] = useState({ balance: 0, amount: 0 })
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)

  // Find the bill with the matching ID
  const bill = bills.find(b => b.id === id)

  useEffect(() => {
    if (!bill) {
      console.error("Bill not found:", id)
      navigation.goBack()
    }
  }, [bill, id, navigation])

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
        return XCircle
    }
  }

  const StatusIcon = bill ? getStatusIcon(bill.status) : XCircle

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handlePayBill = async () => {
    if (!selectedAccountId) {
      Alert.alert("Error", "Please select a payment account")
      return
    }

    const selectedAccount = accounts.find(acc => acc.id === selectedAccountId)
    if (!selectedAccount) {
      Alert.alert("Error", "Selected account not found")
      return
    }

    // Check if account has sufficient balance
    if (selectedAccount.balance < bill.amount) {
      setInsufficientFundsData({
        balance: selectedAccount.balance,
        amount: bill.amount
      })
      setShowPaymentModal(false)
      setShowInsufficientFundsModal(true)
      return
    }

    // Show payment confirmation modal
    setShowPaymentConfirmationModal(true)
  }

  const Payment = async () => {
    if (!bill) return
    
    setIsLoading(true)
    try {
      // Update bill status
      await updateBill(bill.id, {
        ...bill,
        status: "paid",
        paymentAccountId: selectedAccountId,
        paidAt: new Date().toISOString()
      })

      // Update account balance
      const selectedAccount = accounts.find(acc => acc.id === selectedAccountId)
      if (selectedAccount) {
        await updateAccount(selectedAccountId, {
          balance: selectedAccount.balance - bill.amount
        })
      }

      setShowPaymentConfirmationModal(false)
      navigation.goBack()
    } catch (error) {
      console.error("Error paying bill:", error)
      Alert.alert("Error", "Failed to pay bill. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBill = async () => {
    if (!bill) return
    
    setIsLoading(true)
    try {
      await deleteBill(bill.id)
      setShowDeleteConfirmationModal(false)
      navigation.goBack()
    } catch (error) {
      console.error("Error deleting bill:", error)
      Alert.alert("Error", "Failed to delete bill. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!bill) {
    return null
  }

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
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {bill.paymentMethod || "Not specified"}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Bell size={20} color={colors.textSecondary} />
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Frequency</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {bill.recurring ? (bill.frequency || "Monthly") : "One-time"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <DollarSign size={20} color={colors.textSecondary} />
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Category</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{bill.category}</Text>
            </View>
          </View>
        </View>

        {/* Payment History */}
        {bill.paidAt && (
        <View style={[styles.card, { backgroundColor: colors.glass.background }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Payment History</Text>
          <View style={styles.paymentHistory}>
            <View style={styles.paymentItem}>
              <Text style={[styles.paymentDate, { color: colors.textSecondary }]}>Last Paid</Text>
              <Text style={[styles.paymentValue, { color: colors.text }]}>
                  {new Date(bill.paidAt).toLocaleDateString()}
              </Text>
            </View>
              {bill.paymentAccountId && (
            <View style={styles.paymentItem}>
                  <Text style={[styles.paymentDate, { color: colors.textSecondary }]}>Paid From</Text>
              <Text style={[styles.paymentValue, { color: colors.text }]}>
                    {accounts.find(acc => acc.id === bill.paymentAccountId)?.name || "Unknown Account"}
              </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {bill.status !== "paid" && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowPaymentModal(true)}
          >
            <Text style={[styles.actionButtonText, { color: colors.surface }]}>Pay Bill</Text>
          </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.danger }]}
            onPress={() => setShowDeleteConfirmationModal(true)}
          >
            <Text style={[styles.actionButtonText, { color: colors.surface }]}>Delete Bill</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Payment Account Selection Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}>
          <View style={[styles.modalContent, { backgroundColor: "#1A1A1A" }]}>
            <Text style={[styles.modalTitle, { color: "#FFFFFF" }]}>Select Payment Account</Text>
            <ScrollView style={styles.accountsList}>
              {accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.accountItem,
                    {
                      backgroundColor: selectedAccountId === account.id ? "#FF3B30" : "#333333",
                      borderColor: selectedAccountId === account.id ? "#FF3B30" : "#333333",
                    },
                  ]}
                  onPress={() => setSelectedAccountId(account.id)}
                >
                  <Text
                    style={[
                      styles.accountText,
                      { color: selectedAccountId === account.id ? "#FFFFFF" : "#FFFFFF" },
                    ]}
                  >
                    {account.name} (${account.balance.toFixed(2)})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#333333" }]}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: "#FFFFFF" }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#FF3B30" }]}
                onPress={handlePayBill}
                disabled={!selectedAccountId || isLoading}
              >
                <Text style={[styles.modalButtonText, { color: "#FFFFFF" }]}>
                  {isLoading ? "Processing..." : "Pay Bill"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Confirmation Modal */}
      <Modal
        visible={showPaymentConfirmationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaymentConfirmationModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: "rgba(0, 0, 0, 0.7)" }]}>
          <View style={[styles.modalContentpopup, { 
            backgroundColor: colors.background,
            width: "85%",
            maxWidth: 400,
            padding: 24,
          }]}>
            <View style={styles.modalHeader}>
              <Ionicons name="checkmark-circle-outline" size={48} color={colors.success} style={styles.modalIcon} />
              <Text style={[styles.modalTitle, { 
                color: colors.text,
                fontSize: 24,
                marginTop: 12,
              }]}>Confirm Payment</Text>
            </View>
            
            <View style={[styles.modalBodypopup, { marginVertical: 24 }]}>
              <View style={styles.modalInfoRow}>
                <Text style={[styles.modalLabel, { 
                  color: colors.textSecondary,
                  fontSize: 16,
                }]}>Bill Name:</Text>
                <Text style={[styles.modalValue, { 
                  color: colors.text,
                  fontSize: 16,
                }]}>{bill?.name}</Text>
              </View>
              
              <View style={styles.modalInfoRow}>
                <Text style={[styles.modalLabel, { 
                  color: colors.textSecondary,
                  fontSize: 16,
                }]}>Amount:</Text>
                <Text style={[styles.modalValue, { 
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: "600",
                }]}>{formatCurrency(bill?.amount || 0)}</Text>
              </View>
              
              <View style={styles.modalInfoRow}>
                <Text style={[styles.modalLabel, { 
                  color: colors.textSecondary,
                  fontSize: 16,
                }]}>From Account:</Text>
                <Text style={[styles.modalValue, { 
                  color: colors.text,
                  fontSize: 16,
                }]}>
                  {accounts.find(acc => acc.id === selectedAccountId)?.name}
                </Text>
              </View>
            </View>

            <View style={[styles.modalFooter, { marginTop: 16 }]}>
              <TouchableOpacity
                style={[styles.modalButton, { 
                  backgroundColor: colors.glass.background,
                  height: 48,
                }]}
                onPress={() => setShowPaymentConfirmationModal(false)}
                disabled={isLoading}
              >
                <Text style={[styles.modalButtonText, { 
                  color: colors.text,
                  fontSize: 16,
                }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { 
                  backgroundColor: colors.primary,
                  height: 48,
                }]}
                onPress={Payment}
                disabled={isLoading}
              >
                <Text style={[styles.modalButtonText, { 
                  color: colors.surface,
                  fontSize: 16,
                }]}>
                  {isLoading ? "Processing..." : "Payment"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Insufficient Funds Modal */}
      <Modal
        visible={showInsufficientFundsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInsufficientFundsModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: "rgba(0, 0, 0, 0.7)" }]}>
          <View style={[styles.modalContentpopup, { 
            backgroundColor: colors.background,
            width: "85%",
            maxWidth: 400,
            padding: 24,
          }]}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning-outline" size={48} color={colors.danger} style={styles.modalIcon} />
              <Text style={[styles.modalTitle, { 
                color: colors.text,
                fontSize: 24,
                marginTop: 12,
              }]}>Insufficient Funds</Text>
            </View>
            
            <View style={[styles.modalBodypopup, { marginVertical: 24 }]}>
              <View style={styles.modalInfoRow}>
                <Text style={[styles.modalLabel, { 
                  color: colors.textSecondary,
                  fontSize: 16,
                }]}>Account Balance:</Text>
                <Text style={[styles.modalValue, { 
                  color: colors.text,
                  fontSize: 16,
                }]}>{formatCurrency(insufficientFundsData.balance)}</Text>
              </View>
              
              <View style={styles.modalInfoRow}>
                <Text style={[styles.modalLabel, { 
                  color: colors.textSecondary,
                  fontSize: 16,
                }]}>Bill Amount:</Text>
                <Text style={[styles.modalValue, { 
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: "600",
                }]}>{formatCurrency(insufficientFundsData.amount)}</Text>
              </View>
              
              <View style={styles.modalInfoRow}>
                <Text style={[styles.modalLabel, { 
                  color: colors.textSecondary,
                  fontSize: 16,
                }]}>Difference:</Text>
                <Text style={[styles.modalValue, { 
                  color: colors.danger,
                  fontSize: 16,
                  fontWeight: "600",
                }]}>
                  {formatCurrency(insufficientFundsData.amount - insufficientFundsData.balance)}
                </Text>
              </View>
            </View>

            <View style={[styles.modalFooter, { marginTop: 16 }]}>
              <TouchableOpacity
                style={[styles.modalButton, { 
                  backgroundColor: colors.glass.background,
                  height: 48,
                }]}
                onPress={() => setShowInsufficientFundsModal(false)}
              >
                <Text style={[styles.modalButtonText, { 
                  color: colors.text,
                  fontSize: 16,
                }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirmationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirmationModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: "rgba(0, 0, 0, 0.7)" }]}>
          <View style={[styles.modalContentpopup, { 
            backgroundColor: colors.background,
            width: "85%",
            maxWidth: 400,
            padding: 24,
          }]}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning-outline" size={48} color={colors.danger} style={styles.modalIcon} />
              <Text style={[styles.modalTitle, { 
                color: colors.text,
                fontSize: 24,
                marginTop: 12,
              }]}>Delete Bill</Text>
            </View>
            
            <View style={[styles.modalBodypopup, { marginVertical: 24 }]}>
              <View style={styles.modalInfoRow}>
                <Text style={[styles.modalLabel, { 
                  color: colors.textSecondary,
                  fontSize: 16,
                }]}>Bill Name:</Text>
                <Text style={[styles.modalValue, { 
                  color: colors.text,
                  fontSize: 16,
                }]}>{bill?.name}</Text>
              </View>
              
              <View style={styles.modalInfoRow}>
                <Text style={[styles.modalLabel, { 
                  color: colors.textSecondary,
                  fontSize: 16,
                }]}>Amount:</Text>
                <Text style={[styles.modalValue, { 
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: "600",
                }]}>{formatCurrency(bill?.amount || 0)}</Text>
              </View>
              
              <Text style={[styles.modalText, { 
                color: colors.textSecondary,
                fontSize: 16,
                textAlign: "center",
                marginTop: 16,
              }]}>
                Are you sure you want to delete this bill? This action cannot be undone.
              </Text>
            </View>

            <View style={[styles.modalFooter, { marginTop: 16 }]}>
              <TouchableOpacity
                style={[styles.modalButton, { 
                  backgroundColor: colors.glass.background,
                  height: 48,
                }]}
                onPress={() => setShowDeleteConfirmationModal(false)}
                disabled={isLoading}
              >
                <Text style={[styles.modalButtonText, { 
                  color: colors.text,
                  fontSize: 16,
                }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { 
                  backgroundColor: colors.danger,
                  height: 48,
                }]}
                onPress={handleDeleteBill}
                disabled={isLoading}
              >
                <Text style={[styles.modalButtonText, { 
                  color: colors.surface,
                  fontSize: 16,
                }]}>
                  {isLoading ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    fontWeight: "bold",
    marginBottom: 8,
  },
  billAmount: {
    fontSize: 32,
    fontWeight: "bold",
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
    marginTop: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
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
    fontWeight: "500",
  },
  actionButtons: {
    gap: 12,
    marginTop: 24,
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
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderRadius: 20,
    padding: 30,
    maxHeight: "80%",
  },
  modalContentpopup: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    alignItems: "center",
  },
  modalIcon: {
    marginBottom: 8,
  },
  modalTitle: {
    fontWeight: "600",
    textAlign: "center",
  },
  accountsList: {
    maxHeight: 300,
  },
  accountItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
  },
  accountText: {
    fontSize: 16,
    fontWeight: "500",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 24,
  },
  modalBodypopup: {
    gap: 16,
  },
  modalInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalLabel: {
    fontWeight: "500",
  },
  modalValue: {
    fontWeight: "500",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
})
