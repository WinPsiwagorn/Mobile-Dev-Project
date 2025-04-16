"use client"

import { useState } from "react"
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
  ActivityIndicator,
  StatusBar,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import type { AuthScreenNavigationProp } from "../types/navigation"
import { theme } from "../theme"

const { width, height } = Dimensions.get("window")

type Props = {
  navigation: AuthScreenNavigationProp
}

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }

    return true
  }

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (!validatePassword()) {
      return
    }

    try {
      setError("")
      setIsLoading(true)
      await signUp(email, password, name)
      // Navigation will be handled by the auth state change in App.tsx
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Registration failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFB23F" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.topSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logo} />
            </View>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitleText}>Sign up to get started</Text>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.formContainer}>
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle-outline" size={18} color="#FF4D4F" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#FFB23F" />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="rgba(255, 178, 63, 0.5)"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  accessibilityLabel="Full Name input"
                  accessibilityHint="Enter your full name"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#FFB23F" />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="rgba(255, 178, 63, 0.5)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  accessibilityLabel="Email input"
                  accessibilityHint="Enter your email address"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#FFB23F" />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(255, 178, 63, 0.5)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  accessibilityLabel="Password input"
                  accessibilityHint="Create a password with at least 6 characters"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  accessibilityRole="button"
                >
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#FFB23F" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#FFB23F" />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="rgba(255, 178, 63, 0.5)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  accessibilityLabel="Confirm Password input"
                  accessibilityHint="Confirm your password"
                />
              </View>

              {password && confirmPassword && (
                <View style={styles.passwordMatchContainer}>
                  <Ionicons
                    name={password === confirmPassword ? "checkmark-circle-outline" : "close-circle-outline"}
                    size={16}
                    color={password === confirmPassword ? "#4CAF50" : "#FF4D4F"}
                  />
                  <Text
                    style={[styles.passwordMatchText, { color: password === confirmPassword ? "#4CAF50" : "#FF4D4F" }]}
                  >
                    {password === confirmPassword ? "Passwords match" : "Passwords don't match"}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
                accessibilityLabel="Sign Up button"
                accessibilityRole="button"
                accessibilityState={{ disabled: isLoading }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#1A1A1A" />
                ) : (
                  <Text style={styles.signUpButtonText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>
                  Already have an account?{" "}
                  <Text
                    style={styles.signInLink}
                    onPress={() => navigation.navigate("Login")}
                    accessibilityRole="button"
                    accessibilityLabel="Sign In"
                  >
                    Sign In
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topSection: {
    backgroundColor: "#FFB23F",
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFB23F",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: "rgba(26, 26, 26, 0.7)",
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  formContainer: {
    width: "100%",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 77, 79, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: "#FF4D4F",
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 178, 63, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 12,
  },
  eyeIcon: {
    padding: 8,
  },
  passwordMatchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  passwordMatchText: {
    marginLeft: 8,
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: "#FFB23F",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    color: "#1A1A1A",
    fontSize: 16,
    fontWeight: "600",
  },
  signInContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  signInText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  signInLink: {
    color: "#FFB23F",
    fontWeight: "600",
  },
})
