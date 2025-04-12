"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

interface BudgetCategory {
  name: string
  allocated: number
  spent: number
  color: string
}

export default function BudgetPlanningView() {
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { name: "Housing", allocated: 2000, spent: 1800, color: "#FF6B6B" },
    { name: "Food", allocated: 800, spent: 750, color: "#4ECDC4" },
    { name: "Transportation", allocated: 400, spent: 350, color: "#45B7D1" },
    { name: "Entertainment", allocated: 300, spent: 250, color: "#96CEB4" },
    { name: "Utilities", allocated: 500, spent: 480, color: "#FFEEAD" },
  ])

  const calculateProgress = (spent: number, allocated: number) => {
    return (spent / allocated) * 100
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#4A90E2", "#357ABD"]} style={styles.header}>
        <Text style={styles.headerTitle}>Budget Planning</Text>
        <Text style={styles.headerSubtitle}>March 2024</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Monthly Overview</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Budget</Text>
              <Text style={styles.summaryValue}>$4,000</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Spent</Text>
              <Text style={styles.summaryValue}>$3,630</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Remaining</Text>
              <Text style={styles.summaryValue}>$370</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Categories</Text>
        {categories.map((category, index) => (
          <View key={index} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryAmount}>
                ${category.spent} / ${category.allocated}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${calculateProgress(category.spent, category.allocated)}%`,
                    backgroundColor: category.color,
                  },
                ]}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add New Category</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.8,
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#2D3436",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#636E72",
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3436",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#2D3436",
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#2D3436",
  },
  categoryAmount: {
    fontSize: 14,
    color: "#636E72",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#F1F2F6",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  addButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})
