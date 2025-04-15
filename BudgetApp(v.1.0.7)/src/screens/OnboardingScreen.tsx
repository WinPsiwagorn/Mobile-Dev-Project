"use client"

import type React from "react"
import { useState, useRef } from "react"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, type ScrollView, Animated } from "react-native"
import { useTheme } from "../context/ThemeContext"
import type { RootStackNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import { Wallet, ChartBar, Shield, CreditCard } from "lucide-react-native"

const { width, height } = Dimensions.get("window")

type Props = {
  navigation: RootStackNavigationProp
}

type OnboardingSlide = {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  gradient: [string, string]
}

const slides: OnboardingSlide[] = [
  {
    id: "1",
    title: "Track Your Expenses",
    description: "Keep track of your daily expenses and income with our intuitive interface.",
    icon: Wallet,
    gradient: ["#FFB23F", "#FF8F3F"],
  },
  {
    id: "2",
    title: "Smart Analytics",
    description: "Get detailed insights about your spending habits with beautiful charts.",
    icon: ChartBar,
    gradient: ["#3FBAFF", "#3F8FFF"],
  },
]

export default function OnboardingScreen({ navigation }: Props) {
  const { colors } = useTheme()
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollX = useRef(new Animated.Value(0)).current
  const scrollViewRef = useRef<ScrollView>(null)

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })

  const handleNext = () => {
    if (activeIndex === slides.length - 1) {
      navigation.navigate("Auth")
    } else {
      scrollViewRef.current?.scrollTo({
        x: (activeIndex + 1) * width,
        animated: true,
      })
      setActiveIndex(activeIndex + 1)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width)
          setActiveIndex(newIndex)
        }}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            <LinearGradient
              colors={slide.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconContainer}
            >
              <slide.icon size={48} color="#FFFFFF" />
            </LinearGradient>
            <Text style={[styles.title, { color: colors.text }]}>{slide.title}</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>{slide.description}</Text>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: index === activeIndex ? colors.primary : colors.textSecondary,
                  width: index === activeIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.skipButton]} onPress={() => navigation.navigate("Auth")}>
            <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.nextButton, { backgroundColor: colors.primary }]} onPress={handleNext}>
            <LinearGradient
              colors={slides[activeIndex].gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>{activeIndex === slides.length - 1 ? "Get Started" : "Next"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 24,
    backgroundColor: "transparent",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    opacity: 0.8,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipButton: {
    padding: 16,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#FFB23F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})
