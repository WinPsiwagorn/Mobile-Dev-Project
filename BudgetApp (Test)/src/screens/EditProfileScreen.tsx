"use client"

import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Alert, Platform, ActivityIndicator } from "react-native"
import { useTheme } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import { ArrowLeft, User, Camera, Mail, Calendar } from "lucide-react-native"
import { useAuth } from "../context/AuthContext"
import * as ImagePicker from 'expo-image-picker'
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type Props = {
  navigation: MainTabNavigationProp
}

export default function EditProfileScreen({ navigation }: Props) {
  const { colors } = useTheme()
  const { user, updateUserProfile } = useAuth()
  const [profileImage, setProfileImage] = useState<string | null>(user?.photoURL || null)
  const [isSaving, setIsSaving] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName || '')

  const [profileData, setProfileData] = useState({
    name: user?.displayName || "John Williams",
    email: user?.email || "john.williams@example.com",
    dateOfBirth: "1990-01-01",
  })

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Display name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      console.log('Starting profile update process...');
      // Prepare update data
      const updateData: { displayName?: string; photoURL?: string; updatedAt?: string } = {
        displayName: displayName.trim(),
        updatedAt: new Date().toISOString()
      };

      // If profile image has changed, upload it to Firebase Storage
      if (profileImage && profileImage !== user?.photoURL) {
        console.log('Profile image has changed, uploading to Firebase Storage...');
        try {
          // Upload image to Firebase Storage
          const imageRef = ref(storage, `profile_photos/${user.uid}/${generateUniqueId()}`);
          console.log('Storage reference created:', imageRef.fullPath);
          
          // Convert URI to blob
          console.log('Converting image URI to blob...');
          const response = await fetch(profileImage);
          const blob = await response.blob();
          console.log('Blob created, size:', blob.size);
          
          // Upload the blob
          console.log('Uploading blob to Firebase Storage...');
          await uploadBytes(imageRef, blob);
          console.log('Upload completed successfully');
          
          // Get the download URL
          console.log('Getting download URL...');
          const downloadURL = await getDownloadURL(imageRef);
          console.log('Download URL obtained:', downloadURL);
          
          // Add the photo URL to the update data
          updateData.photoURL = downloadURL;
        } catch (error) {
          console.error('Error uploading profile image:', error);
          // Show a more specific error message
          if (error instanceof Error) {
            if (error.message.includes('storage/unauthorized')) {
              Alert.alert('Storage Permission Error', 'You don\'t have permission to upload images. Please contact support.');
            } else if (error.message.includes('storage/canceled')) {
              Alert.alert('Upload Canceled', 'The upload was canceled. Please try again.');
            } else if (error.message.includes('storage/unknown')) {
              Alert.alert('Storage Error', 'There was a problem with the storage service. Please try again later.');
            } else {
              Alert.alert('Upload Error', `Failed to upload profile image: ${error.message}`);
            }
          } else {
            Alert.alert('Warning', 'Failed to upload profile image. Profile name will still be updated.');
          }
          // Continue with the update without the photo URL
        }
      } else {
        console.log('No profile image change detected');
      }

      // First update in Auth context to ensure immediate UI update
      console.log('Updating Auth context...');
      try {
        await updateUserProfile(updateData);
        console.log('Auth context updated successfully');
      } catch (authError) {
        console.error('Error updating Auth context:', authError);
        Alert.alert('Warning', 'Failed to update profile in authentication service. Some changes may not be saved.');
      }

      // Then update in Firestore for persistence
      console.log('Updating Firestore document...');
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, updateData);
        console.log('Firestore document updated successfully');
      } catch (firestoreError) {
        console.error('Error updating Firestore document:', firestoreError);
        Alert.alert('Warning', 'Failed to update profile in database. Some changes may not be saved.');
      }
      
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
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

  // Helper function to generate a unique identifier
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  };

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

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.inputGroup}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <User size={20} color={colors.primary} />
            </View>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Full Name"
              placeholderTextColor={colors.textSecondary}
              value={displayName}
              onChangeText={setDisplayName}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <Mail size={20} color={colors.primary} />
            </View>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={profileData.email}
              onChangeText={(text) => setProfileData({ ...profileData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <Calendar size={20} color={colors.primary} />
            </View>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Date of Birth"
              placeholderTextColor={colors.textSecondary}
              value={profileData.dateOfBirth}
              onChangeText={(text) => setProfileData({ ...profileData, dateOfBirth: text })}
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
  card: {
    borderRadius: 20,
    padding: 16,
    gap: 16,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
})
