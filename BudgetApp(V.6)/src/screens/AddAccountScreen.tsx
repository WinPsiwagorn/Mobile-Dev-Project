import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MainTabNavigationProp } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Building,
  PiggyBank,
  DollarSign, Utensils,
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
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const suggestionsMap = {
  general: [
    { name: 'Food & Drinks', icon: Utensils, color: '#ff4d4d' },
    { name: 'Shopping', icon: ShoppingBag, color: '#f4c542' },
    { name: 'Transportation', icon: Bus, color: '#4caf50' },
    { name: 'Housing', icon: Home, color: '#2196f3' },
    { name: 'Entertainment', icon: Tv, color: '#e91e63' },
  ],
  savings: [
    { name: 'Investment', icon: Briefcase, color: '#4caf50' },
    { name: 'Traveling', icon: Plane, color: '#2196f3' },
    { name: 'Gifts', icon: Gift, color: '#e91e63' },
    { name: 'Party', icon: PartyPopper, color: '#f4c542' },
    { name: 'Emergency', icon: AlertTriangle, color: '#ff4d4d' },
  ],
};

const ACCOUNT_TYPES = [
  { id: 'general', icon: CreditCard, label: 'General Account' },
  { id: 'savings', icon: PiggyBank, label: 'Savings Account' }
];

export default function AddAccountScreen() {
  const navigation = useNavigation<MainTabNavigationProp>();
  const { colors } = useTheme();
  const [accountName, setAccountName] = useState('');
  const [balance, setBalance] = useState('');
  type AccountType = 'general' | 'savings';
  const [selectedType, setSelectedType] = useState<AccountType>('general');
  const [selectedSuggestion, setSelectedSuggestion] = useState<null | typeof suggestionsMap['general'][0]>(null);

  useEffect(() => {
    const matched = suggestionsMap[selectedType].find(
      (s: { name: string; }) => s.name.toLowerCase() === accountName.trim().toLowerCase()
    );
    setSelectedSuggestion(matched || null);
  }, [accountName, selectedType]);


  const handleSave = () => {
    // TODO: Implement account saving logic
    navigation.goBack();
  };

  const renderIcon = () => {
    const Icon = selectedSuggestion?.icon || Circle;
    const iconColor = selectedSuggestion?.color || colors.textSecondary;
    return <Icon size={24} color={iconColor} />;
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={colors.surface} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.surface }]}>
          Add Account
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>Account Type</Text>
          <View style={styles.accountTypesContainer}>
            {ACCOUNT_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.accountTypeButton,
                    {
                      backgroundColor:
                        selectedType === type.id
                          ? colors.primary
                          : colors.glass.background,
                      borderColor:
                        selectedType === type.id
                          ? colors.primary
                          : colors.glass.border,
                    },
                  ]}
                  onPress={() => setSelectedType(type.id as AccountType)}
                >
                  <Icon
                    size={24}
                    color={selectedType === type.id ? colors.surface : colors.text}
                  />
                  <Text
                    style={[
                      styles.accountTypeText,
                      {
                        color:
                          selectedType === type.id ? colors.surface : colors.text,
                      },
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
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
              const isSelected = accountName === suggestion.name;
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
                  <Text style={[styles.suggestionText, { color: colors.text }]}>
                    {suggestion.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>


          {selectedType === 'savings' && (
            <>
              <Text style={[styles.label, { color: colors.text }]}>Goal Balance</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.glass.background,
                    borderColor: colors.glass.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Enter goal balance"
                placeholderTextColor={colors.textSecondary}
                value={balance}
                onChangeText={setBalance}
                keyboardType="numeric"
              />
            </>
          )}


          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Text style={[styles.saveButtonText, { color: colors.surface }]}>
              Save Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
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
    fontWeight: '600',
    marginBottom: 8,
  },
  accountTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  accountTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    width: (width - 48) / 2,
  },
  accountTypeText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  suggestionText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },  
}); 