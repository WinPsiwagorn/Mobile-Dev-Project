"use client"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { useTheme } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import { CreditCard, Plus, Trash2, Lock } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("window")

// Mock data - replace with actual data from your backend
const CARDS = [
  {
    id: "1",
    type: "credit",
    last4: "4242",
    expiry: "12/25",
    name: "John Doe",
    color: ["#FF6B6B", "#FF8E8E"],
  },
  {
    id: "2",
    type: "debit",
    last4: "8888",
    expiry: "09/24",
    name: "John Doe",
    color: ["#4ECDC4", "#45B7AF"],
  },
]

export default function CardsScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const { colors } = useTheme()

  const handleAddCard = () => {
    // TODO: Implement add card functionality
    console.log("Add card pressed")
  }

  const handleDeleteCard = (cardId: string) => {
    // TODO: Implement delete card functionality
    console.log("Delete card pressed for card:", cardId)
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.gradient[0], colors.gradient[1]]} style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.surface }]}>My Cards</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {CARDS.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.cardContainer]}
            onPress={() => {
              // TODO: Navigate to card details
              console.log("Card pressed:", card.id)
            }}
          >
            <LinearGradient colors={card.color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
              <View style={styles.cardHeader}>
                <CreditCard size={24} color="#FFFFFF" />
                <Text style={styles.cardType}>{card.type === "credit" ? "Credit Card" : "Debit Card"}</Text>
              </View>

              <View style={styles.cardNumber}>
                <Text style={styles.cardNumberText}>•••• •••• •••• {card.last4}</Text>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardLabel}>Card Holder</Text>
                  <Text style={styles.cardValue}>{card.name}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardLabel}>Expires</Text>
                  <Text style={styles.cardValue}>{card.expiry}</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={styles.cardActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.error }]}
                onPress={() => handleDeleteCard(card.id)}
              >
                <Trash2 size={20} color={colors.surface} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  // TODO: Implement lock card functionality
                  console.log("Lock card pressed for card:", card.id)
                }}
              >
                <Lock size={20} color={colors.surface} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={[styles.addCardButton, { backgroundColor: colors.primary }]} onPress={handleAddCard}>
          <Plus size={24} color={colors.surface} />
          <Text style={[styles.addCardText, { color: colors.surface }]}>Add New Card</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    height: 200,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardType: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  cardNumber: {
    marginVertical: 20,
  },
  cardNumberText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    color: "#FFFFFF",
    opacity: 0.8,
    fontSize: 12,
    marginBottom: 4,
  },
  cardValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  addCardText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
})
