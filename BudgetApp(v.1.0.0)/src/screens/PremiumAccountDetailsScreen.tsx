"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from "react-native"
import { useTheme } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import { ArrowLeft, Crown, Check, Star, Zap, Shield, CreditCard, BarChart3, Download, Gift, Sparkles } from "lucide-react-native"

const { width } = Dimensions.get("window")

type Props = {
  navigation: MainTabNavigationProp
}

export default function PremiumAccountDetailsScreen({ navigation }: Props) {
  const { colors } = useTheme()
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly")

  const premiumFeatures = [
    {
      id: "1",
      title: "Advanced Analytics",
      description: "Get detailed insights with premium charts and reports",
      icon: BarChart3,
      color: colors.primary,
    },
    {
      id: "2",
      title: "Priority Support",
      description: "24/7 dedicated support for premium members",
      icon: Star,
      color: colors.gold,
    },
    {
      id: "3",
      title: "Unlimited Budgets",
      description: "Create unlimited budgets and savings goals",
      icon: Zap,
      color: colors.success,
    },
    {
      id: "4",
      title: "Enhanced Security",
      description: "Advanced security features to protect your data",
      icon: Shield,
      color: colors.secondary,
    },
    {
      id: "5",
      title: "Premium Cards",
      description: "Exclusive card designs and features",
      icon: CreditCard,
      color: colors.accent,
    },
    {
      id: "6",
      title: "Data Export",
      description: "Export your data in multiple formats",
      icon: Download,
      color: colors.warning,
    },
    {
      id: "7",
      title: "Exclusive Rewards",
      description: "Access to premium rewards and cashback",
      icon: Gift,
      color: colors.danger,
    },
    {
      id: "8",
      title: "Custom Themes",
      description: "Exclusive premium themes and customization",
      icon: Sparkles,
      color: colors.primary,
    },
  ]

  const handleSubscribe = () => {
    // TODO: Implement subscription logic
    console.log("Subscribe to premium plan:", selectedPlan)
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gold, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.surface }]}>Premium Account</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Premium Badge */}
        <View style={styles.premiumBadgeContainer}>
          <LinearGradient
            colors={[colors.gold, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumBadge}
          >
            <Crown size={32} color={colors.surface} />
            <Text style={[styles.premiumBadgeText, { color: colors.surface }]}>ELITE</Text>
          </LinearGradient>
        </View>

        {/* Subscription Plans */}
        <View style={[styles.plansContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Your Plan</Text>
          
          <View style={styles.planOptions}>
            <TouchableOpacity 
              style={[
                styles.planOption, 
                selectedPlan === "monthly" && { borderColor: colors.gold, borderWidth: 2 }
              ]}
              onPress={() => setSelectedPlan("monthly")}
            >
              <Text style={[styles.planTitle, { color: colors.text }]}>Monthly</Text>
              <Text style={[styles.planPrice, { color: colors.text }]}>$9.99</Text>
              <Text style={[styles.planPeriod, { color: colors.textSecondary }]}>per month</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.planOption, 
                selectedPlan === "yearly" && { borderColor: colors.gold, borderWidth: 2 }
              ]}
              onPress={() => setSelectedPlan("yearly")}
            >
              <View style={styles.savingsBadge}>
                <Text style={[styles.savingsText, { color: colors.surface }]}>Save 50%</Text>
              </View>
              <Text style={[styles.planTitle, { color: colors.text }]}>Yearly</Text>
              <Text style={[styles.planPrice, { color: colors.text }]}>$59.99</Text>
              <Text style={[styles.planPeriod, { color: colors.textSecondary }]}>per year</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Premium Features */}
        <View style={[styles.featuresContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Premium Features</Text>
          
          <View style={styles.featuresGrid}>
            {premiumFeatures.map((feature) => (
              <View key={feature.id} style={[styles.featureCard, { backgroundColor: `${feature.color}15` }]}>
                <View style={[styles.featureIconContainer, { backgroundColor: `${feature.color}30` }]}>
                  <feature.icon size={24} color={feature.color} />
                </View>
                <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity 
          style={[styles.subscribeButton, { backgroundColor: colors.gold }]}
          onPress={handleSubscribe}
        >
          <Text style={[styles.subscribeButtonText, { color: colors.surface }]}>
            Subscribe Now
          </Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={[styles.termsText, { color: colors.textSecondary }]}>
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          You can cancel anytime.
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  premiumBadgeContainer: {
    alignItems: "center",
    marginTop: -30,
    marginBottom: 20,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  premiumBadgeText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  plansContainer: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  planOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  planOption: {
    width: (width - 80) / 2,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  planPeriod: {
    fontSize: 14,
  },
  savingsBadge: {
    position: "absolute",
    top: -12,
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  featuresContainer: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: (width - 80) / 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  subscribeButton: {
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
  },
}) 