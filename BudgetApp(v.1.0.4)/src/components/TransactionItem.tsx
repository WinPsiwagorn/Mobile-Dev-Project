import type React from "react"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { theme } from "../theme"
import { Card } from "./Card"

interface TransactionItemProps {
  type: "income" | "expense"
  category: string
  amount: number
  date: string
  description: string
  icon: string
  onPress?: () => void
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  type,
  category,
  amount,
  date,
  description,
  icon,
  onPress,
}) => {
  const isIncome = type === "income"
  const iconColor = isIncome ? theme.colors.success : theme.colors.error
  const amountColor = isIncome ? theme.colors.success : theme.colors.error
  const amountPrefix = isIncome ? "+" : "-"

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
      <Card variant="default" style={styles.card}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
            <Ionicons name={icon} size={24} color={iconColor} />
          </View>
          <View style={styles.details}>
            <Text style={styles.category}>{category}</Text>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={[styles.amount, { color: amountColor }]}>
              {amountPrefix}${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  details: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  category: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  description: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  date: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    ...theme.typography.h3,
    fontWeight: "600",
  },
})
