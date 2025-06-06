"use client"

import React, { useEffect, useState } from "react"
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

type AccountType = "general" | "savings"

export default function AddAccountScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const route = useRoute()
  const { colors } = useTheme()
  const { addAccount, accounts } = useFinance()
  const [accountName, setAccountName] = useState("")
  const [currentBalance, setCurrentBalance] = useState("")
  const [goalBalance, setGoalBalance] = useState("")
  const [selectedType, setSelectedType] = useState<AccountType>("general")
  const [selectedSuggestion, setSelectedSuggestion] = useState<null | (typeof suggestionsMap)["general"][0]>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get the current screen from navigation state
  const currentScreen = route.params?.fromScreen || "general"

  // Set initial account type based on current screen
  useEffect(() => {
    setSelectedType(currentScreen as AccountType)
  }, [currentScreen])

  // Update suggestions when account type changes
  useEffect(() => {
    const matched = suggestionsMap[selectedType].find(
      (s: { name: string }) => s.name.toLowerCase() === accountName.trim().toLowerCase(),
    )
    setSelectedSuggestion(matched || null)
  }, [accountName, selectedType])

  const handleSave = async () => {
    if (!accountName.trim()) {
      setError("Please enter an account name")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      console.log("AddAccountScreen: Creating new account with type:", selectedType)
      
      // Create account object
      const newAccount = {
        name: accountName.trim(),
        type: selectedType as "general" | "savings",
        balance: selectedType === "general" ? parseFloat(currentBalance) || 0 : 0,
        currentBalance: selectedType === "general" ? parseFloat(currentBalance) || 0 : 0,
        goalBalance: selectedType === "savings" ? parseFloat(goalBalance) || 0 : undefined,
        icon: selectedSuggestion?.icon.displayName?.toLowerCase() || "circle",
        color: selectedSuggestion?.color || colors.textSecondary,
      }

      console.log("AddAccountScreen: New account object:", newAccount)

      // Save account using finance context
      await addAccount(newAccount)
      
      console.log("AddAccountScreen: Account added successfully")
      console.log("AddAccountScreen: Current accounts:", accounts)
      
      // Navigate back
      navigation.goBack()
    } catch (error) {
      console.error("AddAccountScreen: Error adding account:", error)
      setError("Failed to add account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCurrentBalanceChange = (text: string) => {
    const cleanedText = text.replace(/[^0-9.]/g, ''); // Only allow numbers and decimal point
    setCurrentBalance(cleanedText);
  };

  const handleGoalBalanceChange = (text: string) => {
    const cleanedText = text.replace(/[^0-9.]/g, ''); // Only allow numbers and decimal point
    setGoalBalance(cleanedText);
  };

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
                  onPress={() => setSelectedType(type.id as AccountType)}
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
            style={[styles.input, { backgroundColor: colors.glass.background, borderColor: colors.glass.border, color: colors.text }]}
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

          {selectedType === "general" ? (
            <>
              <Text style={[styles.label, { color: colors.text }]}>Current Balance</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.glass.background, borderColor: colors.glass.border, color: colors.text }]}
                placeholder="Enter current balance"
                placeholderTextColor={colors.textSecondary}
                value={currentBalance}
                onChangeText={handleCurrentBalanceChange}
                keyboardType="decimal-pad"
              />
            </>
          ) : (
            <>
              <Text style={[styles.label, { color: colors.text }]}>Goal Balance</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.glass.background, borderColor: colors.glass.border, color: colors.text }]}
                placeholder="Enter goal balance"
                placeholderTextColor={colors.textSecondary}
                value={goalBalance}
                onChangeText={handleGoalBalanceChange}
                keyboardType="decimal-pad"
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
