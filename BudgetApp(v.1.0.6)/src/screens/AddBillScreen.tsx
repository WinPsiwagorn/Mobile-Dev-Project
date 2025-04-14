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
} from "react-native"
import { useTheme } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import { ArrowLeft } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import { useFinance } from "../context/FinanceContext"
import DateTimePicker from '@react-native-community/datetimepicker'

const { width } = Dimensions.get("window")

const BILL_CATEGORIES = [
  { id: "utilities", label: "Utilities" },
  { id: "housing", label: "Housing" },
  { id: "transportation", label: "Transportation" },
  { id: "insurance", label: "Insurance" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "other", label: "Other" },
]

const PAYMENT_METHODS = [
  { id: "credit", label: "Credit Card" },
  { id: "debit", label: "Debit Card" },
  { id: "bank", label: "Bank Transfer" },
  { id: "cash", label: "Cash" },
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
  const [category, setCategory] = useState("utilities")
  const [recurring, setRecurring] = useState(false)
  const [frequency, setFrequency] = useState("monthly")
  const [automaticPayment, setAutomaticPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit")
  const [paymentAccountId, setPaymentAccountId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleSave = async () => {
    if (!billName.trim() || !amount || !dueDate) {
      setError("Please fill in all required fields")
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
        paymentMethod,
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

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
                justifyContent: "center",
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
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}

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
              <Text style={[styles.label, { color: colors.text }]}>Payment Method</Text>
              <View style={styles.paymentMethodsContainer}>
                {PAYMENT_METHODS.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.paymentMethodButton,
                      {
                        backgroundColor: paymentMethod === method.id ? colors.primary : colors.glass.background,
                        borderColor: paymentMethod === method.id ? colors.primary : colors.glass.border,
                      },
                    ]}
                    onPress={() => setPaymentMethod(method.id)}
                  >
                    <Text
                      style={[
                        styles.paymentMethodText,
                        {
                          color: paymentMethod === method.id ? colors.surface : colors.text,
                        },
                      ]}
                    >
                      {method.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

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
  paymentMethodsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  paymentMethodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  paymentMethodText: {
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
})
