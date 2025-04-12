"use client"

import { useEffect, useState } from "react"
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
} from "react-native"
import { useTheme } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import {
  ArrowLeft,
  CreditCard,
  PiggyBank,
  Utensils,
  ShoppingBag,
  Bus,
  Home,
  Tv,
  Briefcase,
  Gift,
  PartyPopper,
  AlertTriangle,
  Plane,
  Circle,
} from "lucide-react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useFinance } from "../context/FinanceContext"

const { width } = Dimensions.get("window")

const suggestionsMap = {
  general: [
    { name: "Food & Drinks", icon: Utensils, color: "#ff4d4d" },
    { name: "Shopping", icon: ShoppingBag, color: "#f4c542" },
    { name: "Transportation", icon: Bus, color: "#4caf50" },
    { name: "Housing", icon: Home, color: "#2196f3" },
    { name: "Entertainment", icon: Tv, color: "#e91e63" },
  ],
  savings: [
    { name: "Investment", icon: Briefcase, color: "#4caf50" },
    { name: "Traveling", icon: Plane, color: "#2196f3" },
    { name: "Gifts", icon: Gift, color: "#e91e63" },
    { name: "Party", icon: PartyPopper, color: "#f4c542" },
    { name: "Emergency", icon: AlertTriangle, color: "#ff4d4d" },
  ],
}

const ACCOUNT_TYPES = [
  { id: "general", icon: CreditCard, label: "General Account" },
  { id: "savings", icon: PiggyBank, label: "Savings Account" },
]

export default function AddAccountScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const route = useRoute()
  const { initialAccountType } = route.params as { initialAccountType?: "general" | "savings" } || {}
  const { colors } = useTheme()
  const { addAccount, accounts } = useFinance()
  const [accountName, setAccountName] = useState("")
  const [balance, setBalance] = useState("")
  const [goalAmount, setGoalAmount] = useState("")
  const [initialBalance, setInitialBalance] = useState("")
  const [selectedType, setSelectedType] = useState<"general" | "savings">(initialAccountType || "general")
  const [selectedSuggestion, setSelectedSuggestion] = useState<null | (typeof suggestionsMap)["general"][0]>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const matched = suggestionsMap[selectedType].find(
      (s: { name: string }) => s.name.toLowerCase() === accountName.trim().toLowerCase(),
    )
    setSelectedSuggestion(matched || null)
  }, [accountName, selectedType])

  const handleSave = async () => {
    try {
      if (!accountName.trim()) {
        alert("Please enter an account name")
        return
      }

      if (selectedType === "savings" && !goalAmount) {
        alert("Please enter a goal amount for savings account")
        return
      }

      const balance = parseFloat(initialBalance) || 0
      console.log("AddAccountScreen: Creating new account:", {
        name: accountName,
        type: selectedType,
        balance,
        goalAmount: selectedType === "savings" ? parseFloat(goalAmount) : undefined
      })

      // Create the account object
      const newAccount = {
        name: accountName.trim(),
        type: selectedType,
        balance: balance,
        goalAmount: selectedType === "savings" ? parseFloat(goalAmount) : undefined
      }

      // Add the account
      await addAccount(newAccount)
      console.log("AddAccountScreen: Account created successfully")

      // Navigate back to accounts screen
      navigation.goBack()
    } catch (error) {
      console.error("AddAccountScreen: Error creating account:", error)
      alert("Failed to create account. Please try again.")
    }
  }

  const renderIcon = () => {
    const Icon = selectedSuggestion?.icon || Circle
    const iconColor = selectedSuggestion?.color || colors.textSecondary
    return <Icon size={24} color={iconColor} />
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
        <Text style={[styles.headerTitle, { color: colors.surface }]}>Add Account</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>Account Type</Text>
          <View style={styles.accountTypesContainer}>
            {ACCOUNT_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.accountTypeButton,
                    {
                      backgroundColor: selectedType === type.id ? colors.primary : colors.glass.background,
                      borderColor: selectedType === type.id ? colors.primary : colors.glass.border,
                    },
                  ]}
                  onPress={() => setSelectedType(type.id as "general" | "savings")}
                >
                  <Icon size={24} color={selectedType === type.id ? colors.surface : colors.text} />
                  <Text
                    style={[
                      styles.accountTypeText,
                      {
                        color: selectedType === type.id ? colors.surface : colors.text,
                      },
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Account Name</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.glass.background,
                borderColor: colors.glass.border,
                color: colors.text,
              },
            ]}
            placeholder="Enter account name"
            placeholderTextColor={colors.textSecondary}
            value={accountName}
            onChangeText={setAccountName}
          />

          <View style={styles.suggestionsContainer}>
            {suggestionsMap[selectedType].map((suggestion) => {
              const isSelected = accountName === suggestion.name
              return (
                <TouchableOpacity
                  key={suggestion.name}
                  style={[
                    styles.suggestionCard,
                    {
                      backgroundColor: colors.glass.background,
                      borderColor: isSelected ? suggestion.color : colors.glass.border,
                    },
                  ]}
                  onPress={() => setAccountName(suggestion.name)}
                >
                  <suggestion.icon size={20} color={suggestion.color} />
                  <Text style={[styles.suggestionText, { color: colors.text }]}>{suggestion.name}</Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {selectedType === "savings" && (
            <>
              <Text style={[styles.label, { color: colors.text }]}>Goal Amount</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.glass.background,
                    borderColor: colors.glass.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Enter goal amount"
                placeholderTextColor={colors.textSecondary}
                value={goalAmount}
                onChangeText={setGoalAmount}
                keyboardType="numeric"
              />
            </>
          )}

          <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
            <Text style={[styles.saveButtonText, { color: colors.surface }]}>Save Account</Text>
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
  accountTypesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  accountTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    width: (width - 48) / 2,
  },
  accountTypeText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 24,
    fontSize: 16,
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
  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  suggestionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  suggestionText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "500",
  },
})
