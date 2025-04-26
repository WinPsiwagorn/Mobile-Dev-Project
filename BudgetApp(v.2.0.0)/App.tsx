"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { ThemeProvider } from "./src/context/ThemeContext"
import { AuthProvider, useAuth } from "./src/context/AuthContext"
import { FinanceProvider } from "./src/context/FinanceContext"
import type { RootStackParamList, AuthStackParamList, AppStackParamList } from "./src/types/navigation"
import "react-native-reanimated"
import { CommonActions } from "@react-navigation/native"
import { useEffect } from "react"
    
// Screens
import OnboardingScreen from "./src/screens/OnboardingScreen"
import LoginScreen from "./src/screens/LoginScreen"
import RegisterScreen from "./src/screens/RegisterScreen"
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen"
import AddTransactionScreen from "./src/screens/AddTransactionScreen"
import CategoriesScreen from "./src/screens/CategoriesScreen"
import TransactionsScreen from "./src/screens/TransactionsScreen"
import TransactionDetailsScreen from "./src/screens/TransactionDetailsScreen"
import CategoryDetailsScreen from "./src/screens/CategoryDetailsScreen"
import BillDetailsScreen from "./src/screens/BillDetailsScreen"
import AddBillScreen from "./src/screens/AddBillScreen"
import BillsScreen from "./src/screens/BillsScreen"
import CardsScreen from "./src/screens/CardsScreen"
import SavingsScreen from "./src/screens/SavingsScreen"
import AddAccountScreen from "./src/screens/AddAccountScreen"
import EditProfileScreen from "./src/screens/EditProfileScreen"
import NotificationsScreen from "./src/screens/NotificationsScreen"
import ContactUsScreen from "./src/screens/ContactUsScreen"
import TermPrivacyScreen from "./src/screens/TermPrivacyScreen"
import AccountDetailsScreen from "./src/screens/AccountDetailsScreen"
import PremiumAccountDetailsScreen from "./src/screens/PremiumAccountDetailsScreen"

// Import MainTabNavigator
import MainTabNavigator from "./src/navigation/MainTabNavigator"

const Stack = createNativeStackNavigator<RootStackParamList>()
const AuthStack = createNativeStackNavigator<AuthStackParamList>()
const AppStack = createNativeStackNavigator<AppStackParamList>()

function MainScreen() {
  return (
    <FinanceProvider>
      <MainTabNavigator />
    </FinanceProvider>
  )
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  )
}

function AppNavigator() {
  const { user, isLoading } = useAuth()

  // Add a useEffect to log auth state changes
  useEffect(() => {
    console.log("Auth state changed:", user ? "User logged in" : "No user")
  }, [user])

  if (isLoading) {
    console.log("App is loading...")
    return null
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
              listeners={{
                focus: () => console.log("Auth navigator focused"),
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={MainScreen}
              listeners={{
                focus: () => console.log("Main screen focused"),
              }}
              options={{
                gestureEnabled: false, // Disable gesture navigation to prevent going back to onboarding
              }}
            />
            <Stack.Screen name="Categories" component={CategoriesScreen} />
            <Stack.Screen name="Transactions" component={TransactionsScreen} />
            <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
            <Stack.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
            <Stack.Screen name="Bills" component={BillsScreen} />
            <Stack.Screen name="BillDetails" component={BillDetailsScreen} />
            <Stack.Screen name="AddBill" component={AddBillScreen} />
            <Stack.Screen name="Cards" component={CardsScreen} />
            <Stack.Screen name="Savings" component={SavingsScreen} />
            <Stack.Screen name="AddAccount" component={AddAccountScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="ContactUs" component={ContactUsScreen} />
            <Stack.Screen name="TermPrivacy" component={TermPrivacyScreen} />
            <Stack.Screen name="AccountDetails" component={AccountDetailsScreen} />
            <Stack.Screen name="PremiumAccountDetails" component={PremiumAccountDetailsScreen} />
            <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <FinanceProvider>
            <AppNavigator />
          </FinanceProvider>
        </AuthProvider>
      </ThemeProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  )
}
