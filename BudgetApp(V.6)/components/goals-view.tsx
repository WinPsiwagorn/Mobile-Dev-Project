import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface FinancialGoal {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'savings' | 'investment' | 'debt';
  icon: string;
}

export default function GoalsView() {
  const [goals, setGoals] = useState<FinancialGoal[]>([
    {
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: 'Dec 2024',
      category: 'savings',
      icon: '💰',
    },
    {
      name: 'New Car',
      targetAmount: 25000,
      currentAmount: 12000,
      deadline: 'Jun 2025',
      category: 'savings',
      icon: '🚗',
    },
    {
      name: 'Student Loan',
      targetAmount: 15000,
      currentAmount: 8000,
      deadline: 'Mar 2025',
      category: 'debt',
      icon: '📚',
    },
  ]);

  const calculateProgress = (current: number, target: number) => {
    return (current / target) * 100;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'savings':
        return '#4CAF50';
      case 'investment':
        return '#2196F3';
      case 'debt':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#388E3C']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Financial Goals</Text>
        <Text style={styles.headerSubtitle}>Track your progress</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Progress</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Goals</Text>
              <Text style={styles.summaryValue}>{goals.length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Target</Text>
              <Text style={styles.summaryValue}>
                ${goals.reduce((acc, goal) => acc + goal.targetAmount, 0).toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Achieved</Text>
              <Text style={styles.summaryValue}>
                ${goals.reduce((acc, goal) => acc + goal.currentAmount, 0).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Goals</Text>
        {goals.map((goal, index) => (
          <View key={index} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalIcon}>{goal.icon}</Text>
              <View style={styles.goalInfo}>
                <Text style={styles.goalName}>{goal.name}</Text>
                <Text style={styles.goalDeadline}>Due: {goal.deadline}</Text>
              </View>
              <View style={styles.goalAmount}>
                <Text style={styles.goalCurrentAmount}>
                  ${goal.currentAmount.toLocaleString()}
                </Text>
                <Text style={styles.goalTargetAmount}>
                  of ${goal.targetAmount.toLocaleString()}
                </Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${calculateProgress(goal.currentAmount, goal.targetAmount)}%`,
                    backgroundColor: getCategoryColor(goal.category),
                  },
                ]}
              />
            </View>
            <View style={styles.goalFooter}>
              <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(goal.category) }]}>
                <Text style={styles.categoryText}>{goal.category}</Text>
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Contribution</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.createGoalButton}>
          <Text style={styles.createGoalButtonText}>Create New Goal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2D3436',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2D3436',
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3436',
  },
  goalDeadline: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 2,
  },
  goalAmount: {
    alignItems: 'flex-end',
  },
  goalCurrentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  goalTargetAmount: {
    fontSize: 12,
    color: '#636E72',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F1F2F6',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: '500',
  },
  createGoalButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  createGoalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 