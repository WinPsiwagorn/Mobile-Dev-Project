import { Animated, Easing, type TextStyle, type ViewStyle } from "react-native"

export const createAnimationHooks = () => {
  const glowAnim = new Animated.Value(0)
  const pulseAnim = new Animated.Value(1)
  const backgroundAnim = new Animated.Value(0)
  const contentAnim = new Animated.Value(0)

  const startAnimations = () => {
    // Entrance animation with native driver disabled for layout animations
    Animated.parallel([
      Animated.timing(backgroundAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: false,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: false,
      }),
    ]).start()

    // Continuous glow animation with reduced intensity
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: false,
        }),
      ]),
    ).start()

    // Subtle breathing animation with reduced scale
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 3000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: false,
        }),
      ]),
    ).start()
  }

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.4, 0.2],
  })

  const fadeInScale = {
    opacity: contentAnim,
    transform: [
      {
        scale: contentAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.98, 1],
        }),
      },
    ],
  }

  return {
    glowAnim,
    pulseAnim,
    backgroundAnim,
    contentAnim,
    glowOpacity,
    fadeInScale,
    startAnimations,
  }
}

export const sharedStyles = {
  container: {
    flex: 1,
    backgroundColor: "#000000",
  } as ViewStyle,
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "35%",
    overflow: "hidden",
  } as ViewStyle,
  gradientGlow: {
    position: "absolute",
    top: -20,
    left: -20,
    right: -20,
    height: "120%",
    backgroundColor: "#FFB23F",
    opacity: 0.25,
    transform: [{ scale: 1.3 }],
    borderRadius: 30,
  } as ViewStyle,
  card: {
    backgroundColor: "rgba(26, 26, 26, 0.7)",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 178, 63, 0.5)",
    shadowColor: "#FFB23F",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
    padding: 16,
  } as ViewStyle,
  text: {
    color: "#FFFFFF",
    fontSize: 16,
  } as TextStyle,
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textShadowColor: "rgba(255, 178, 63, 0.9)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  } as TextStyle,
  subheading: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  } as TextStyle,
  button: {
    borderRadius: 12,
    height: 56,
    overflow: "hidden",
    shadowColor: "#FFB23F",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 178, 63, 0.6)",
  } as ViewStyle,
  buttonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  } as TextStyle,
}
