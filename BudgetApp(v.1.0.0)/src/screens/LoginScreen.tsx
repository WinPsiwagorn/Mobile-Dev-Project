"use client"

import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import type { AuthNavigationProp } from "../types/navigation"
import { theme } from "../theme"

const { width, height } = Dimensions.get("window")

type Props = {
  navigation: AuthNavigationProp
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      setError("")
      setIsLoading(true)
      await signIn(email, password)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An error occurred during sign in")
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
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.subtitleText}>Sign in to continue</Text>
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
                  accessibilityHint="Enter your password"
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

              <TouchableOpacity
                style={styles.forgotPassword}
                accessibilityLabel="Forgot Password"
                accessibilityRole="button"
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                accessibilityLabel="Sign In button"
                accessibilityRole="button"
                accessibilityState={{ disabled: isLoading }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#1A1A1A" />
                ) : (
                  <Text style={styles.signInButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>
                  Don't have an account?{" "}
                  <Text
                    style={styles.signUpLink}
                    onPress={() => navigation.navigate("Register")}
                    accessibilityRole="button"
                    accessibilityLabel="Sign Up"
                  >
                    Sign Up
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#FFB23F",
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: "#FFB23F",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    color: "#1A1A1A",
    fontSize: 16,
    fontWeight: "600",
  },
  signUpContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  signUpText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  signUpLink: {
    color: "#FFB23F",
    fontWeight: "600",
  },
})
