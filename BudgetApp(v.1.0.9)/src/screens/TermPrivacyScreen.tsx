"use client"

import React from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { useTheme } from "../context/ThemeContext"
import { LinearGradient } from "expo-linear-gradient"
import { ArrowLeft } from "lucide-react-native"
import type { MainTabNavigationProp } from "../types/navigation"

type Props = {
  navigation: MainTabNavigationProp
}

export default function TermPrivacyScreen({ navigation }: Props) {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.surface }]}>Terms & Privacy</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updateDate}>Last updated: March 27, 2025</Text>

        {renderSection("Privacy Policy", `This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.`)}

        {renderSection("Interpretation and Definitions", `The words with capital letters have meanings defined under specific conditions. These definitions apply whether they appear in singular or plural.`)}

        {renderSection("Definitions", `• Account: a unique account created for You to access our Service\n• Affiliate: any entity under common control\n• Application: refers to Budget\n• Company: refers to Budget\n• Country: Thailand\n• Device: any device that can access the Service\n• Personal Data: information that identifies an individual\n• Service: the Application\n• Service Provider: party who processes data for the Company\n• Usage Data: data collected automatically\n• You: the user or representative of a company using the Service`)}

        {renderSection("Collecting and Using Your Personal Data", `We collect Personal Data such as email and usage data to improve our Service. This includes information like IP address, device type, and time spent on pages.`)}

        {renderSection("Use of Your Personal Data", `We may use Personal Data for purposes like:\n• Providing and maintaining our Service\n• Managing your Account\n• Contacting you\n• Offering promotions\n• Improving services\n• Business transfers\n• Legal compliance`)}

        {renderSection("Sharing of Your Personal Data", `We may share your data with:\n• Service Providers\n• Affiliates\n• Business partners\n• Other users (in public areas)\n• With your consent`)}

        {renderSection("Retention", `We keep your data only as long as necessary to fulfill the purposes described. Usage Data may be stored longer for legal or analytical reasons.`)}

        {renderSection("Transfer", `Your data may be transferred to and stored outside your country. We ensure secure handling under this Policy.`)}

        {renderSection("Delete Your Personal Data", `You may request data deletion at any time. We may retain data where legally required.`)}

        {renderSection("Disclosure", `Your data may be disclosed:\n• During business transfers\n• For legal compliance\n• To protect rights, safety, or prevent fraud`)}

        {renderSection("Security", `We use commercially acceptable methods to protect your data but cannot guarantee 100% security.`)}

        {renderSection("Children’s Privacy", `We do not knowingly collect data from children under 13. If we become aware of it, we will delete it.`)}

        {renderSection("External Links", `Our Service may link to other websites. We are not responsible for their content or policies.`)}

        {renderSection("Changes to Policy", `We may update this policy. Changes will be posted on this page with updated date.`)}

      </ScrollView>
    </View>
  )
}

function renderSection(title: string, content: string) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.paragraph}>{content}</Text>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  updateDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#fff",
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#ccc",
  },
})
