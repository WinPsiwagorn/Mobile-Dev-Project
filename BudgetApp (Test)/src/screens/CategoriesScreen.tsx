"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { useTheme, globalStyles } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import {
  Plus,
  Search,
  Filter,
  ShoppingBag,
  Car,
  Home,
  Gamepad2,
  Plane,
  Utensils,
  ShoppingCart,
  Heart,
} from "lucide-react-native"

const { width } = Dimensions.get("window")

type Props = {
  navigation: MainTabNavigationProp
}

type Category = {
  id: string
  name: string
  icon: any
  color: string
  budget: number
  spent: number
  transactions: number
}

export default function CategoriesScreen({ navigation }: Props) {
  const { colors } = useTheme()
  const [activeFilter, setActiveFilter] = useState("all")

  const categories: Category[] = [
    {
      id: "1",
      name: "Shopping",
      icon: ShoppingBag,
      color: colors.primary,
      budget: 1000,
      spent: 750,
      transactions: 12,
    },
    {
      id: "2",
      name: "Food",
      icon: Utensils,
      color: colors.secondary,
      budget: 500,
      spent: 420,
      transactions: 28,
    },
    {
      id: "3",
      name: "Transport",
      icon: Car,
      color: colors.accent,
      budget: 300,
      spent: 275,
      transactions: 15,
    },
    {
      id: "4",
      name: "Housing",
      icon: Home,
      color: colors.gold,
      budget: 2000,
      spent: 1800,
      transactions: 3,
    },
    {
      id: "5",
      name: "Entertainment",
      icon: Gamepad2,
      color: colors.primary,
      budget: 400,
      spent: 385,
      transactions: 8,
    },
    {
      id: "6",
      name: "Travel",
      icon: Plane,
      color: colors.secondary,
      budget: 1500,
      spent: 1200,
      transactions: 2,
    },
    {
      id: "7",
      name: "Groceries",
      icon: ShoppingCart,
      color: colors.accent,
      budget: 800,
      spent: 650,
      transactions: 18,
    },
    {
      id: "8",
      name: "Healthcare",
      icon: Heart,
      color: colors.gold,
      budget: 500,
      spent: 320,
      transactions: 4,
    },
  ]

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0)
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.surface }]}>Categories</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.glass.background }]}>
              <Search size={20} color={colors.surface} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.glass.background }]}>
              <Filter size={20} color={colors.surface} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Overview Card */}
        <View style={[styles.overviewCard, globalStyles.glass]}>
          <View style={styles.overviewRow}>
            <View>
              <Text style={[styles.overviewLabel, { color: colors.surface }]}>Total Budget</Text>
              <Text style={[styles.overviewAmount, { color: colors.surface }]}>${totalBudget.toLocaleString()}</Text>
            </View>
            <View>
              <Text style={[styles.overviewLabel, { color: colors.surface }]}>Total Spent</Text>
              <Text style={[styles.overviewAmount, { color: colors.surface }]}>${totalSpent.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.glass.background }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${(totalSpent / totalBudget) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.surface }]}>
              {((totalSpent / totalBudget) * 100).toFixed(1)}% spent
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filter Tabs */}
        <View style={[styles.filterContainer, globalStyles.glass]}>
          {["all", "high", "medium", "low"].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, { backgroundColor: activeFilter === filter ? colors.primary : "transparent" }]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[styles.filterText, { color: activeFilter === filter ? colors.surface : colors.textSecondary }]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, globalStyles.glass]}
              onPress={() => navigation.navigate("CategoryDetails", { id: category.id })}
            >
              <View style={[styles.categoryHeader, { borderBottomColor: colors.glass.border }]}>
                <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15` }]}>
                  <category.icon size={24} color={category.color} />
                </View>
                <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
              </View>

              <View style={styles.categoryStats}>
                <View style={styles.statRow}>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Budget</Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>${category.budget}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Spent</Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>${category.spent}</Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: colors.glass.background }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: category.color,
                        width: `${(category.spent / category.budget) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                  {((category.spent / category.budget) * 100).toFixed(1)}% spent
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Add Category Button */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate("AddCategory")}
      >
        <Plus size={24} color={colors.surface} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  overviewCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  overviewLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  overviewAmount: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  filterContainer: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 4,
    marginBottom: 20,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: "center",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  categoryHeader: {
    padding: 12,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoryStats: {
    padding: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  progressContainer: {
    padding: 12,
    paddingTop: 0,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    textAlign: "right",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFB23F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
})
