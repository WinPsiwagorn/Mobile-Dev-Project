"use client"

import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Switch,
  Modal,
} from "react-native"
import { useTheme } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import { useFinance } from "../context/FinanceContext"

const { width } = Dimensions.get("window")

const BILL_CATEGORIES = [
  { id: "utilities", label: "Utilities" },
  { id: "housing", label: "Housing" },
  { id: "transportation", label: "Transportation" },
  { id: "insurance", label: "Insurance" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "other", label: "Other" },
]

const FREQUENCIES = [
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "yearly", label: "Yearly" },
  { id: "weekly", label: "Weekly" },
]

export default function AddBillScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const { colors } = useTheme()
  const { addBill, accounts } = useFinance()
  const [billName, setBillName] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [category, setCategory] = useState("utilities")
  const [recurring, setRecurring] = useState(false)
  const [frequency, setFrequency] = useState("monthly")
  const [automaticPayment, setAutomaticPayment] = useState(false)
  const [paymentAccountId, setPaymentAccountId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const handleMonthChange = (months: number) => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + months)
    setCurrentMonth(newDate)
  }

  const handleDateSelect = (date: Date) => {
    setDueDate(date)
    setShowDatePicker(false)
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const handleSave = async () => {
    if (!billName.trim() || !amount) {
      setError("Please fill in all required fields")
      return
    }

    // Validate due date is in the future
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set time to start of day for comparison
    
    if (dueDate < today) {
      setError("Due date must be in the future")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      console.log("AddBillScreen: Creating new bill")
      
      // Create bill object
      const newBill = {
        name: billName.trim(),
        amount: parseFloat(amount),
        dueDate: dueDate.toISOString(),
        category,
        status: "pending" as const,
        recurring,
        frequency: recurring ? frequency as "monthly" | "quarterly" | "yearly" : undefined,
        automaticPayment,
        paymentAccountId,
      }

      console.log("AddBillScreen: New bill object:", newBill)

      // Save bill using finance context
      await addBill(newBill)
      
      console.log("AddBillScreen: Bill added successfully")
      
      // Navigate back
      navigation.goBack()
    } catch (error) {
      console.error("AddBillScreen: Error adding bill:", error)
      setError("Failed to add bill. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <LinearGradient colors={[colors.gradient[0], colors.gradient[1]]} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.surface} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.surface }]}>Add Bill</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>Bill Name</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.glass.background,
                borderColor: colors.glass.border,
                color: colors.text,
              },
            ]}
            placeholder="Enter bill name"
            placeholderTextColor={colors.textSecondary}
            value={billName}
            onChangeText={setBillName}
          />

          <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.glass.background,
                borderColor: colors.glass.border,
                color: colors.text,
              },
            ]}
            placeholder="Enter amount"
            placeholderTextColor={colors.textSecondary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <Text style={[styles.label, { color: colors.text }]}>Due Date</Text>
          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: colors.glass.background,
                borderColor: colors.glass.border,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: 16,
              },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: colors.text }}>
              {dueDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            <Calendar size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
              <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                <View style={styles.datePickerHeader}>
                  <TouchableOpacity onPress={() => handleMonthChange(-1)}>
                    <ChevronLeft size={24} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={[styles.monthText, { color: colors.text }]}>
                    {currentMonth.toLocaleDateString('en-US', { 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Text>
                  <TouchableOpacity onPress={() => handleMonthChange(1)}>
                    <ChevronRight size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <View style={styles.calendarGrid}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <Text key={day} style={[styles.weekDay, { color: colors.textSecondary }]}>
                      {day}
                    </Text>
                  ))}
                  {getDaysInMonth(currentMonth).map((date, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayButton,
                        date && {
                          backgroundColor: isSameDay(date, dueDate) ? colors.primary : 'transparent',
                          opacity: isPastDate(date) ? 0.5 : 1,
                        },
                      ]}
                      onPress={() => date && !isPastDate(date) && handleDateSelect(date)}
                      disabled={!date || isPastDate(date)}
                    >
                      <Text style={[
                        styles.dayText,
                        { 
                          color: date ? (isSameDay(date, dueDate) ? colors.surface : colors.text) : 'transparent',
                        }
                      ]}>
                        {date ? date.getDate() : ''}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity 
                  style={[styles.doneButton, { backgroundColor: colors.primary }]}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={[styles.doneButtonText, { color: colors.surface }]}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Text style={[styles.label, { color: colors.text }]}>Category</Text>
          <View style={styles.categoriesContainer}>
            {BILL_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: category === cat.id ? colors.primary : colors.glass.background,
                    borderColor: category === cat.id ? colors.primary : colors.glass.border,
                  },
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: category === cat.id ? colors.surface : colors.text,
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.switchContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Recurring Bill</Text>
            <Switch
              value={recurring}
              onValueChange={setRecurring}
              trackColor={{ false: colors.glass.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>

          {recurring && (
            <>
              <Text style={[styles.label, { color: colors.text }]}>Frequency</Text>
              <View style={styles.frequenciesContainer}>
                {FREQUENCIES.map((freq) => (
                  <TouchableOpacity
                    key={freq.id}
                    style={[
                      styles.frequencyButton,
                      {
                        backgroundColor: frequency === freq.id ? colors.primary : colors.glass.background,
                        borderColor: frequency === freq.id ? colors.primary : colors.glass.border,
                      },
                    ]}
                    onPress={() => setFrequency(freq.id)}
                  >
                    <Text
                      style={[
                        styles.frequencyText,
                        {
                          color: frequency === freq.id ? colors.surface : colors.text,
                        },
                      ]}
                    >
                      {freq.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <View style={styles.switchContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Automatic Payment</Text>
            <Switch
              value={automaticPayment}
              onValueChange={setAutomaticPayment}
              trackColor={{ false: colors.glass.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>

          {automaticPayment && (
            <>
              <Text style={[styles.label, { color: colors.text }]}>Payment Account</Text>
              <View style={styles.accountsContainer}>
                {accounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.accountButton,
                      {
                        backgroundColor: paymentAccountId === account.id ? colors.primary : colors.glass.background,
                        borderColor: paymentAccountId === account.id ? colors.primary : colors.glass.border,
                      },
                    ]}
                    onPress={() => setPaymentAccountId(account.id)}
                  >
                    <Text
                      style={[
                        styles.accountText,
                        {
                          color: paymentAccountId === account.id ? colors.surface : colors.text,
                        },
                      ]}
                    >
                      {account.name} (${account.balance.toFixed(2)})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {error && (
            <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
          )}

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={[styles.saveButtonText, { color: colors.surface }]}>
              {isLoading ? "Saving..." : "Save Bill"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 24,
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  frequenciesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  frequencyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: "500",
  },
  accountsContainer: {
    gap: 8,
    marginBottom: 24,
  },
  accountButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  accountText: {
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  saveButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  weekDay: {
    width: '14%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  dayButton: {
    width: '14%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 4,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  doneButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
})
