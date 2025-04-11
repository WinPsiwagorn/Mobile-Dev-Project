import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget: number;
  spent: number;
  type: 'expense' | 'income';
}

export default function CategoriesView() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Housing',
      icon: '🏠',
      color: '#FF6B6B',
      budget: 2000,
      spent: 1800,
      type: 'expense',
    },
    {
      id: '2',
      name: 'Food & Dining',
      icon: '🍽️',
      color: '#4ECDC4',
      budget: 800,
      spent: 750,
      type: 'expense',
    },
    {
      id: '3',
      name: 'Transportation',
      icon: '🚗',
      color: '#45B7D1',
      budget: 400,
      spent: 350,
      type: 'expense',
    },
    {
      id: '4',
      name: 'Salary',
      icon: '💰',
      color: '#4CAF50',
      budget: 5000,
      spent: 5000,
      type: 'income',
    },
    {
      id: '5',
      name: 'Freelance',
      icon: '💻',
      color: '#FFB900',
      budget: 1000,
      spent: 800,
      type: 'income',
    },
  ]);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '',
    color: '#4A90E2',
    budget: '',
    type: 'expense' as const,
  });

  const calculateProgress = (spent: number, budget: number) => {
    return (spent / budget) * 100;
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Categories</Text>
        <Text style={styles.headerSubtitle}>Manage your spending categories</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Category Overview</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Categories</Text>
              <Text style={styles.summaryValue}>{categories.length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Expense Categories</Text>
              <Text style={styles.summaryValue}>
                {categories.filter(c => c.type === 'expense').length}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Income Categories</Text>
              <Text style={styles.summaryValue}>
                {categories.filter(c => c.type === 'income').length}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Expense Categories</Text>
        {categories
          .filter(category => category.type === 'expense')
          .map(category => (
            <View key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Text style={styles.iconText}>{category.icon}</Text>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryBudget}>
                    Budget: ${category.budget.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.categoryAmount}>
                  <Text style={styles.categorySpent}>
                    ${category.spent.toLocaleString()}
                  </Text>
                  <Text style={styles.categoryRemaining}>
                    ${(category.budget - category.spent).toLocaleString()} left
                  </Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${calculateProgress(category.spent, category.budget)}%`,
                      backgroundColor: category.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}

        <Text style={styles.sectionTitle}>Income Categories</Text>
        {categories
          .filter(category => category.type === 'income')
          .map(category => (
            <View key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Text style={styles.iconText}>{category.icon}</Text>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryBudget}>
                    Expected: ${category.budget.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.categoryAmount}>
                  <Text style={styles.categorySpent}>
                    ${category.spent.toLocaleString()}
                  </Text>
                  <Text style={styles.categoryRemaining}>
                    ${(category.budget - category.spent).toLocaleString()} remaining
                  </Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${calculateProgress(category.spent, category.budget)}%`,
                      backgroundColor: category.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}

        {isAddingCategory ? (
          <View style={styles.addCategoryForm}>
            <Text style={styles.formTitle}>Add New Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Category Name"
              value={newCategory.name}
              onChangeText={text => setNewCategory({ ...newCategory, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Icon (emoji)"
              value={newCategory.icon}
              onChangeText={text => setNewCategory({ ...newCategory, icon: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Budget Amount"
              value={newCategory.budget}
              onChangeText={text => setNewCategory({ ...newCategory, budget: text })}
              keyboardType="numeric"
            />
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newCategory.type === 'expense' && styles.typeButtonActive,
                ]}
                onPress={() => setNewCategory({ ...newCategory, type: 'expense' })}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    newCategory.type === 'expense' && styles.typeButtonTextActive,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newCategory.type === 'income' && styles.typeButtonActive,
                ]}
                onPress={() => setNewCategory({ ...newCategory, type: 'income' })}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    newCategory.type === 'income' && styles.typeButtonTextActive,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => setIsAddingCategory(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.formButton, styles.saveButton]}>
                <Text style={styles.saveButtonText}>Save Category</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddingCategory(true)}
          >
            <Text style={styles.addButtonText}>Add New Category</Text>
          </TouchableOpacity>
        )}
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
  categoryCard: {
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
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconText: {
    fontSize: 20,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3436',
  },
  categoryBudget: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 2,
  },
  categoryAmount: {
    alignItems: 'flex-end',
  },
  categorySpent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  categoryRemaining: {
    fontSize: 12,
    color: '#636E72',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F1F2F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  addCategoryForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2D3436',
  },
  input: {
    backgroundColor: '#F5F6FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F5F6FA',
    marginHorizontal: 5,
  },
  typeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  typeButtonText: {
    textAlign: 'center',
    color: '#636E72',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#F5F6FA',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
  },
  cancelButtonText: {
    color: '#636E72',
    textAlign: 'center',
    fontWeight: '500',
  },
  saveButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 