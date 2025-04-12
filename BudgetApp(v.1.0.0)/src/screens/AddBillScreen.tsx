"use client"

import { useState } from "react"
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
  const [billName, setBillName] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [category, setCategory] = useState("utilities")
  const [paymentMethod, setPaymentMethod] = useState("credit")
  const [isRecurring, setIsRecurring] = useState(false)
  const [frequency, setFrequency] = useState("monthly")
  const [notes, setNotes] = useState("")

  const handleSave = () => {
    // TODO: Implement bill saving logic
    navigation.goBack()
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
        <Text style={[styles.headerTitle, { color: colors.surface }]}>Add New Bill</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          {/* Bill Name */}
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

          {/* Amount */}
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
            keyboardType="numeric"
          />

          {/* Due Date */}
          <Text style={[styles.label, { color: colors.text }]}>Due Date</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.glass.background,
                borderColor: colors.glass.border,
                color: colors.text,
              },
            ]}
            placeholder="Enter due date"
            placeholderTextColor={colors.textSecondary}
            value={dueDate}
            onChangeText={setDueDate}
          />

          {/* Category */}
          <Text style={[styles.label, { color: colors.text }]}>Category</Text>
          <View style={styles.optionsContainer}>
            {BILL_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: category === cat.id ? colors.primary : colors.glass.background,
                    borderColor: category === cat.id ? colors.primary : colors.glass.border,
                  },
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.optionText,
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

          {/* Payment Method */}
          <Text style={[styles.label, { color: colors.text }]}>Payment Method</Text>
          <View style={styles.optionsContainer}>
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: paymentMethod === method.id ? colors.primary : colors.glass.background,
                    borderColor: paymentMethod === method.id ? colors.primary : colors.glass.border,
                  },
                ]}
                onPress={() => setPaymentMethod(method.id)}
              >
                <Text
                  style={[
                    styles.optionText,
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

          {/* Recurring Bill */}
          <View style={styles.recurringContainer}>
            <View style={styles.recurringHeader}>
              <Text style={[styles.label, { color: colors.text }]}>Recurring Bill</Text>
              <Switch
                value={isRecurring}
                onValueChange={setIsRecurring}
                trackColor={{ false: colors.glass.border, true: colors.primary }}
                thumbColor={colors.surface}
              />
            </View>
            {isRecurring && (
              <View style={styles.optionsContainer}>
                {FREQUENCIES.map((freq) => (
                  <TouchableOpacity
                    key={freq.id}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: frequency === freq.id ? colors.primary : colors.glass.background,
                        borderColor: frequency === freq.id ? colors.primary : colors.glass.border,
                      },
                    ]}
                    onPress={() => setFrequency(freq.id)}
                  >
                    <Text
                      style={[
                        styles.optionText,
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
            )}
          </View>

          {/* Notes */}
          <Text style={[styles.label, { color: colors.text }]}>Notes</Text>
          <TextInput
            style={[
              styles.input,
              styles.notesInput,
              {
                backgroundColor: colors.glass.background,
                borderColor: colors.glass.border,
                color: colors.text,
              },
            ]}
            placeholder="Enter notes"
            placeholderTextColor={colors.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />

          {/* Save Button */}
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
            <Text style={[styles.saveButtonText, { color: colors.surface }]}>Save Bill</Text>
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
    marginLeft: 8,
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
  notesInput: {
    height: 120,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  recurringContainer: {
    marginBottom: 24,
  },
  recurringHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
