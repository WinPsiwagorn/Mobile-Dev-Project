"use client"

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Alert, Platform, ActivityIndicator } from "react-native"
import { useTheme } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import { ArrowLeft, User, Camera, Mail, Calendar } from "lucide-react-native"
import { useAuth } from "../context/AuthContext"
import * as ImagePicker from 'expo-image-picker'
import { LocalStorage, STORAGE_KEYS } from '../utils/storage'

type Props = {
  navigation: MainTabNavigationProp
}

export default function EditProfileScreen({ navigation }: Props) {
  const { colors } = useTheme()
  const { user, updateProfile } = useAuth()
  const [profileImage, setProfileImage] = useState<string | null>(user?.photoURL || null)
  const [isSaving, setIsSaving] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName || '')

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Display name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      console.log('Starting profile update process...');
      // Update profile in Auth context and local storage
      console.log('Updating profile...');
      try {
        await updateProfile(displayName.trim(), profileImage);
        console.log('Profile updated successfully');
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error in profile update process:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    return status === 'granted'
  }

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    return status === 'granted'
  }

  const handleChangePhoto = async () => {
    Alert.alert(
      "Change Profile Photo",
      "Choose a method to update your profile photo",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const hasPermission = await requestCameraPermission()
            if (!hasPermission) {
              Alert.alert(
                "Permission Required",
                "Camera access is needed to take a photo. Please enable it in your device settings.",
                [{ text: "OK" }]
              )
              return
            }

            try {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              })

              if (!result.canceled && result.assets && result.assets.length > 0) {
                setProfileImage(result.assets[0].uri)
              }
            } catch (error) {
              console.error("Error taking photo:", error)
              Alert.alert("Error", "Failed to take photo. Please try again.")
            }
          }
        },
        {
          text: "Choose from Library",
          onPress: async () => {
            const hasPermission = await requestMediaLibraryPermission()
            if (!hasPermission) {
              Alert.alert(
                "Permission Required",
                "Photo library access is needed to select a photo. Please enable it in your device settings.",
                [{ text: "OK" }]
              )
              return
            }

            try {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              })

              if (!result.canceled && result.assets && result.assets.length > 0) {
                setProfileImage(result.assets[0].uri)
              }
            } catch (error) {
              console.error("Error selecting photo:", error)
              Alert.alert("Error", "Failed to select photo. Please try again.")
            }
          }
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.surface }]}>Edit Profile</Text>
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: colors.surface }]} 
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={[styles.saveButtonText, { color: colors.primary }]}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.photoSection}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.surface }]}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <User size={40} color={colors.primary} />
            )}
            <TouchableOpacity
              style={[styles.cameraButton, { backgroundColor: colors.primary }]}
              onPress={handleChangePhoto}
            >
              <Camera size={20} color={colors.surface} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
            <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Display Name"
              placeholderTextColor={colors.textSecondary}
              value={displayName}
              onChangeText={setDisplayName}
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
            <Mail size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={user?.email || ''}
              editable={false}
            />
          </View>
        </View>
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    padding: 12,
  },
  inputIcon: {
    width: 20,
    height: 20,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
})
