"use client"

import React, { useCallback } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { View, StyleSheet, Pressable, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Home, CreditCard, PieChart, User, PlusCircle } from "lucide-react-native"
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
} from "react-native-reanimated"
import { useTheme } from "../context/ThemeContext"
import type { MainTabParamList } from "../types/navigation"

// Import screens
import DashboardScreen from "../screens/DashboardScreen"
import AccountsScreen from "../screens/AccountsScreen"
import ReportsScreen from "../screens/ReportsScreen"
import ProfileScreen from "../screens/ProfileScreen"
import AddTransactionScreen from "../screens/AddTransactionScreen"

const Tab = createBottomTabNavigator<MainTabParamList>()
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

// Constants for consistent styling
const ICON_SIZE = 28
const TAB_HEIGHT = 88
const INDICATOR_WIDTH = 32
const INDICATOR_HEIGHT = 4
const CORNER_RADIUS = 16

// Calculate bottom spacing based on platform
const BOTTOM_SPACING = Platform.select({
  ios: 24,
  android: 16,
  default: 16,
})

// Calculate total bottom height including tab bar and spacing
const TOTAL_BOTTOM_HEIGHT = TAB_HEIGHT + (Platform.OS === "ios" ? BOTTOM_SPACING : BOTTOM_SPACING)

export default function MainTabNavigator() {
  const { colors } = useTheme()

  const CustomTabButton = ({ children, onPress, accessibilityState, label }: any) => {
    const focused = accessibilityState.selected
    const scale = useSharedValue(1)
    const opacity = useSharedValue(focused ? 1 : 0.75)

    React.useEffect(() => {
      opacity.value = withTiming(focused ? 1 : 0.75, { duration: 200 })
    }, [focused])

    const handlePress = useCallback(() => {
      scale.value = withSequence(
        withSpring(0.95, { mass: 0.5, damping: 12 }),
        withSpring(1.05, { mass: 0.5, damping: 12 }),
        withSpring(1, { mass: 0.5, damping: 12 }),
      )

      setTimeout(onPress, 200)
    }, [onPress])

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }))

    const iconStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
      }
    })

    return (
      <AnimatedPressable
        onPress={handlePress}
        style={[styles.tabButton, animatedStyle]}
        accessible={true}
        accessibilityLabel={`${label} tab`}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            // focused && { // Removed conditional focused styling
            //   backgroundColor: 'rgba(255, 178, 63, 0.25)',
            //   borderWidth: 1.5,
            //   borderColor: 'rgba(255, 178, 63, 0.4)',
            // },
          ]}
        >
          <Animated.View style={[iconStyle, { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }]}>
            {children}
          </Animated.View>
        </Animated.View>
        {/* {focused && ( // Removed active indicator rendering
          <View style={styles.activeIndicator} />
        )} */}
      </AnimatedPressable>
    )
  }

  const screenOptions = {
    headerShown: false,
    tabBarStyle: styles.tabBar,
    tabBarBackground: () => (
      <AnimatedLinearGradient
        colors={["rgba(26, 26, 26, 0.98)", "rgba(38, 38, 38, 1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tabBarBackground}
      />
    ),
    tabBarActiveTintColor: "#FFB23F",
    tabBarInactiveTintColor: "rgba(255,255,255,0.85)",
    tabBarShowLabel: true,
    tabBarLabelStyle: styles.tabBarLabel,
    tabBarButton: (props: any) => <CustomTabButton {...props} label={props.children} />,
    contentStyle: styles.sceneContainer,
  }

  return (
    <View style={styles.container}>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          name="Home"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <View style={{ 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '100%',
                height: '100%'
              }}>
                <Home 
                  size={focused ? ICON_SIZE + 4 : ICON_SIZE} 
                  color={color} 
                  strokeWidth={focused ? 2.5 : 2} 
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Accounts"
          component={AccountsScreen}
          options={{
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <View style={{ 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '100%',
                height: '100%'
              }}>
                <CreditCard 
                  size={focused ? ICON_SIZE + 4 : ICON_SIZE} 
                  color={color} 
                  strokeWidth={focused ? 2.5 : 2} 
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Add"
          component={AddTransactionScreen}
          options={{
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <View style={{ 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '100%',
                height: '100%'
              }}>
                <PlusCircle 
                  size={focused ? ICON_SIZE + 4 : ICON_SIZE} 
                  color={color} 
                  strokeWidth={focused ? 2.5 : 2} 
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Reports"
          component={ReportsScreen}
          options={{
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <View style={{ 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '100%',
                height: '100%'
              }}>
                <PieChart 
                  size={focused ? ICON_SIZE + 4 : ICON_SIZE} 
                  color={color} 
                  strokeWidth={focused ? 2.5 : 2} 
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <View style={{ 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '100%',
                height: '100%'
              }}>
                <User 
                  size={focused ? ICON_SIZE + 4 : ICON_SIZE} 
                  color={color} 
                  strokeWidth={focused ? 2.5 : 2} 
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  contentContainer: {
    flex: 1,
  },
  sceneContainer: {
    backgroundColor: "transparent",
  },
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
    elevation: 8,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    height: TAB_HEIGHT,
    borderRadius: CORNER_RADIUS * 2,
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === "ios" ? 12 : 8,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-evenly",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    overflow: "hidden",
    marginBottom: BOTTOM_SPACING,
    zIndex: 1000,
  },
  tabBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: CORNER_RADIUS * 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    minHeight: 64,
    paddingVertical: 10,
  },
  iconContainer: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: CORNER_RADIUS * 1.75,
    marginBottom: 6,
    display: "flex",
    flexDirection: "row",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 2,
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_HEIGHT / 2,
    backgroundColor: "#FFB23F",
    shadowColor: "#FFB23F",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
  },
  tabBarLabel: {
    fontSize: 12.5,
    fontWeight: "600",
    lineHeight: 16,
    marginTop: 4,
    marginBottom: Platform.OS === "ios" ? 4 : 2,
    opacity: 1,
    includeFontPadding: false,
    maxWidth: 72,
    textAlign: "center",
  },
})
