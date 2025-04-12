"use client"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { useTheme } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import { PiggyBank, Plus, Target, TrendingUp, Calendar, ChevronRight } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("window")

// Mock data - replace with actual data from your backend
const SAVINGS_GOALS = [
  {
    id: "1",
    name: "Emergency Fund",
    target: 10000,
    current: 5000,
    deadline: "2024-12-31",
    icon: PiggyBank,
    color: ["#FF6B6B", "#FF8E8E"],
  },
  {
    id: "2",
    name: "Vacation",
    target: 5000,
    current: 2000,
    deadline: "2024-08-31",
    icon: Target,
    color: ["#4ECDC4", "#45B7AF"],
  },
  {
    id: "3",
    name: "New Car",
    target: 25000,
    current: 5000,
    deadline: "2025-06-30",
    icon: TrendingUp,
    color: ["#FFD93D", "#FFE566"],
  },
]

export default function SavingsScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const { colors } = useTheme()

  const handleAddGoal = () => {
    // TODO: Implement add goal functionality
    console.log("Add goal pressed")
  }

  const calculateProgress = (current: number, target: number) => {
    return (current / target) * 100
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.gradient[0], colors.gradient[1]]} style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.surface }]}>Savings Goals</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {SAVINGS_GOALS.map((goal) => {
          const Icon = goal.icon
          const progress = calculateProgress(goal.current, goal.target)
          const deadline = new Date(goal.deadline)
          const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

          return (
            <TouchableOpacity
              key={goal.id}
              style={[styles.goalCard, { backgroundColor: colors.glass.background }]}
              onPress={() => {
                // TODO: Navigate to goal details
                console.log("Goal pressed:", goal.id)
              }}
            >
              <View style={styles.goalHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${goal.color[0]}15` }]}>
                  <Icon size={24} color={goal.color[0]} />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalName, { color: colors.text }]}>{goal.name}</Text>
                  <Text style={[styles.goalDeadline, { color: colors.textSecondary }]}>{daysLeft} days left</Text>
                </View>
                <ChevronRight size={24} color={colors.textSecondary} />
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${progress}%`,
                        backgroundColor: goal.color[0],
                      },
                    ]}
                  />
                </View>
                <View style={styles.progressText}>
                  <Text style={[styles.progressAmount, { color: colors.text }]}>{formatCurrency(goal.current)}</Text>
                  <Text style={[styles.progressTarget, { color: colors.textSecondary }]}>
                    of {formatCurrency(goal.target)}
                  </Text>
                </View>
              </View>

              <View style={styles.goalFooter}>
                <View style={styles.goalStat}>
                  <Calendar size={16} color={colors.textSecondary} />
                  <Text style={[styles.goalStatText, { color: colors.textSecondary }]}>
                    {deadline.toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.goalStat}>
                  <TrendingUp size={16} color={colors.textSecondary} />
                  <Text style={[styles.goalStatText, { color: colors.textSecondary }]}>{progress.toFixed(1)}%</Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        })}

        <TouchableOpacity style={[styles.addGoalButton, { backgroundColor: colors.primary }]} onPress={handleAddGoal}>
          <Plus size={24} color={colors.surface} />
          <Text style={[styles.addGoalText, { color: colors.surface }]}>Add New Goal</Text>
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
  goalCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  goalDeadline: {
    fontSize: 14,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  progressAmount: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 4,
  },
  progressTarget: {
    fontSize: 14,
  },
  goalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goalStat: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalStatText: {
    marginLeft: 4,
    fontSize: 14,
  },
  addGoalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  addGoalText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
})
