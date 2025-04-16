"use client"

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native"
import { useTheme } from "../context/ThemeContext"
import { LinearGradient } from "expo-linear-gradient"
import { ArrowLeft, AlertTriangle } from "lucide-react-native"
import type { MainTabNavigationProp } from "../types/navigation"
import { useAuth } from "../context/AuthContext"
import { LocalStorage } from '../utils/storage'

type Props = {
  navigation: MainTabNavigationProp
}

export default function HelpSupportScreen({ navigation }: Props) {
  const { colors } = useTheme()
  const { user, reauthenticateWithCredential } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteReason, setDeleteReason] = useState('')
  const [password, setPassword] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [canDelete, setCanDelete] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showDeleteModal && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [showDeleteModal, countdown])

  const handleDeleteData = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your current password')
      return
    }

    if (!deleteReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for deleting your data')
      return
    }

    setIsDeleting(true)
    try {
      // First verify the password
      await reauthenticateWithCredential(password)
      
      // Clear all local storage data
      await LocalStorage.clearAll()
      
      Alert.alert(
        'Success',
        'All your data has been deleted successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowDeleteModal(false)
              navigation.goBack()
            }
          }
        ]
      )
    } catch (error) {
      Alert.alert('Error', 'Failed to delete data. Please check your password and try again.')
    } finally {
      setIsDeleting(false)
    }
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
          <Text style={[styles.headerTitle, { color: colors.surface }]}>Help & Support</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: colors.danger + '15' }]}
          onPress={() => {
            setShowDeleteModal(true)
            setCountdown(5)
            setCanDelete(false)
            setDeleteReason('')
            setPassword('')
          }}
        >
          <AlertTriangle size={24} color={colors.danger} />
          <Text style={[styles.deleteButtonText, { color: colors.danger }]}>
            Delete All Data
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.danger }]}>
              Delete All Data
            </Text>
            
            <Text style={[styles.modalSubtitle, { color: colors.text }]}>
              This action cannot be undone. Please tell us why you want to delete your data:
            </Text>

            <TextInput
              style={[styles.reasonInput, { 
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="Enter your reason..."
              placeholderTextColor={colors.textSecondary}
              value={deleteReason}
              onChangeText={setDeleteReason}
              multiline
              numberOfLines={3}
            />

            <Text style={[styles.modalSubtitle, { color: colors.text, marginTop: 16 }]}>
              Enter your current password to confirm:
            </Text>

            <TextInput
              style={[styles.passwordInput, { 
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="Current password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={[styles.timerText, { color: colors.textSecondary }]}>
              Delete button will be enabled in: {countdown}s
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.background }]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  {
                    backgroundColor: colors.danger,
                    opacity: countdown === 0 && password && deleteReason ? 1 : 0.5
                  }
                ]}
                onPress={handleDeleteData}
                disabled={countdown > 0 || !password || !deleteReason || isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color={colors.surface} />
                ) : (
                  <Text style={[styles.buttonText, { color: colors.surface }]}>
                    Delete All Data
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  content: {
    flex: 1,
    padding: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  reasonInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  timerText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}) 