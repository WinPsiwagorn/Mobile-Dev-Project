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
  SafeAreaView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { MainTabNavigationProp } from "../types/navigation"
import { useTheme } from "../context/ThemeContext"
import { LinearGradient } from "expo-linear-gradient"
import {
  ArrowLeft,
  // Removed unused Lucide icons
  // ShoppingBag,
  // Utensils,
  // Bus,
  // Home,
  // Gamepad2,
  // Activity,
  // Zap,
  // Briefcase,
  // Gift,
} from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("window")

// Add constants for bottom spacing
const TAB_BAR_HEIGHT = 88
const BOTTOM_SPACING = Platform.select({
  ios: 24,
  android: 16,
  default: 16,
})
const TOTAL_BOTTOM_HEIGHT = TAB_BAR_HEIGHT + BOTTOM_SPACING

const EXPENSE_CATEGORIES = [
  { id: "shopping", icon: "cart-outline" as const, label: "Shopping", color: "#f4c542" },
  { id: "food", icon: "restaurant-outline" as const, label: "Food & Drinks", color: "#ff4d4d" },
  { id: "transport", icon: "car-outline" as const, label: "Transport", color: "#4caf50" },
  { id: "utilities", icon: "flash-outline" as const, label: "Utilities", color: "#2196f3" },
  { id: "entertainment", icon: "game-controller-outline" as const, label: "Entertainment", color: "#e91e63" },
  { id: "health", icon: "medical-outline" as const, label: "Health", color: "#9c27b0" },
]

const INCOME_CATEGORIES = [
  { id: "salary", icon: "briefcase-outline" as const, label: "Salary", color: "#4caf50" },
  { id: "gifts", icon: "gift-outline" as const, label: "Gifts", color: "#e91e63" },
]

type TransactionType = "income" | "expense"

export default function AddTransactionScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const { colors } = useTheme()
  const [amount, setAmount] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [transactionType, setTransactionType] = useState<TransactionType>("expense")
  const [note, setNote] = useState("")

  const handleSave = () => {
    console.log({ type: transactionType, amount, category: selectedCategory, note })
    navigation.goBack()
  }

  const currentCategories = transactionType === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
  const gradientColors: Readonly<[string, string]> =
    transactionType === "expense" ? [colors.gradient[0], colors.gradient[1]] : [colors.success, colors.success]

  const amountInputBorderColor = transactionType === "expense" ? colors.primary : colors.success

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <LinearGradient colors={gradientColors} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.surface} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.surface }]}>Add Transaction</Text>
      </LinearGradient>

      <View style={[styles.mainContent, { backgroundColor: colors.background }]}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.contentContainer}>
            <View style={styles.typeSelectorContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  {
                    backgroundColor: transactionType === "expense" ? colors.primary : colors.glass.background,
                    borderColor: transactionType === "expense" ? colors.primary : colors.glass.border,
                  },
                ]}
                onPress={() => setTransactionType("expense")}
              >
                <Text
                  style={[styles.typeButtonText, { color: transactionType === "expense" ? colors.surface : colors.text }]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  {
                    backgroundColor: transactionType === "income" ? colors.success : colors.glass.background,
                    borderColor: transactionType === "income" ? colors.success : colors.glass.border,
                  },
                ]}
                onPress={() => setTransactionType("income")}
              >
                <Text
                  style={[styles.typeButtonText, { color: transactionType === "income" ? colors.surface : colors.text }]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
              <TextInput
                style={[
                  styles.amountInput,
                  {
                    color: colors.text,
                    borderBottomColor: amountInputBorderColor,
                  },
                ]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Category</Text>
              <View style={styles.categoriesGrid}>
                {currentCategories.map((category) => {
                  const isSelected = selectedCategory === category.id
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        {
                          backgroundColor: isSelected ? category.color + "33" : colors.glass.background,
                          borderColor: isSelected ? category.color : colors.glass.border,
                        },
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <Ionicons name={category.icon} size={32} color={isSelected ? category.color : colors.text} />
                      <Text
                        style={[
                          styles.categoryLabel,
                          {
                            color: isSelected ? category.color : colors.text,
                            fontWeight: isSelected ? "600" : "500",
                          },
                        ]}
                      >
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Note</Text>
              <TextInput
                style={[
                  styles.noteInput,
                  {
                    backgroundColor: colors.glass.background,
                    borderColor: colors.glass.border,
                    color: colors.text,
                  },
                ]}
                value={note}
                onChangeText={setNote}
                placeholder="Add a note (optional)"
                placeholderTextColor={colors.textSecondary}
                multiline
              />
            </View>

            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: transactionType === "expense" ? colors.primary : colors.success },
              ]}
              onPress={handleSave}
            >
              <Text style={[styles.addButtonText, { color: colors.surface }]}>
                {`Add ${transactionType === "expense" ? "Expense" : "Income"}`}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
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
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  typeSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  amountInput: {
    fontSize: 36,
    fontWeight: "700",
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "flex-start",
  },
  categoryButton: {
    width: (width - 32 - 12) / 2,
    height: (width - 32 - 12) / 2,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    padding: 8,
  },
  categoryLabel: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  noteInput: {
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    fontSize: 16,
    textAlignVertical: "top",
  },
  addButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  mainContent: {
    flex: 1,
  },
})
