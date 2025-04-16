import type React from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  type ViewStyle,
  type ScrollViewProps,
  SafeAreaView,
} from "react-native"

// Constants for bottom tab navigation
const TAB_BAR_HEIGHT = 88
const BOTTOM_SPACING = Platform.select({
  ios: 24,
  android: 16,
  default: 16,
})
const TOTAL_BOTTOM_HEIGHT = TAB_BAR_HEIGHT + (Platform.OS === "ios" ? BOTTOM_SPACING : BOTTOM_SPACING)

interface ScreenLayoutProps {
  children: React.ReactNode
  scrollable?: boolean
  style?: ViewStyle
  scrollViewProps?: ScrollViewProps
  backgroundColor?: string
}

export default function ScreenLayout({
  children,
  scrollable = true,
  style,
  scrollViewProps,
  backgroundColor = "#1A1A1A",
}: ScreenLayoutProps) {
  const containerStyle = [styles.container, { backgroundColor }, style]

  if (!scrollable) {
    return (
      <SafeAreaView style={containerStyle}>
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: TOTAL_BOTTOM_HEIGHT + 16, // Add padding to prevent content from being hidden
  },
  content: {
    flex: 1,
    paddingBottom: TOTAL_BOTTOM_HEIGHT + 16, // Add padding for non-scrollable content
  },
})
