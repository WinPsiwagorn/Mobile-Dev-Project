import { LocalStorage, STORAGE_KEYS } from "../utils/storage"
import type { Bill } from "../utils/financeService"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface NotificationSettings {
  billReminders: boolean
  reminderDays: number // days before due date to send reminder
}

const DEFAULT_SETTINGS: NotificationSettings = {
  billReminders: true,
  reminderDays: 3
}

class NotificationService {
  private static instance: NotificationService
  private settings: NotificationSettings = DEFAULT_SETTINGS

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  async initialize() {
    try {
      const savedSettings = await LocalStorage.getData(STORAGE_KEYS.NOTIFICATION_SETTINGS)
      if (savedSettings) {
        this.settings = { ...DEFAULT_SETTINGS, ...savedSettings }
      }
    } catch (error) {
      console.error("Error initializing notification settings:", error)
    }
  }

  async updateSettings(newSettings: Partial<NotificationSettings>) {
    try {
      this.settings = { ...this.settings, ...newSettings }
      await LocalStorage.saveData(STORAGE_KEYS.NOTIFICATION_SETTINGS, this.settings)
    } catch (error) {
      console.error("Error updating notification settings:", error)
    }
  }

  async getSettings(): Promise<NotificationSettings> {
    return this.settings
  }

  async checkBillReminders() {
    if (!this.settings.billReminders) return

    try {
      const bills: Bill[] = await LocalStorage.getData(STORAGE_KEYS.BILLS) || []
      const now = new Date()
      const reminderDate = new Date(now.getTime() + (this.settings.reminderDays * 24 * 60 * 60 * 1000))

      const upcomingBills = bills.filter(bill => {
        if (!bill.dueDate || bill.status === 'paid') return false
        const dueDate = new Date(bill.dueDate)
        return dueDate <= reminderDate && dueDate > now
      })

      if (upcomingBills.length > 0) {
        const notifications = await this.getStoredNotifications()
        
        for (const bill of upcomingBills) {
          const notificationId = `bill_${bill.id}_${bill.dueDate}`
          
          // Check if we've already sent a notification for this bill
          if (!notifications.includes(notificationId)) {
            await this.createBillReminder(bill)
            notifications.push(notificationId)
          }
        }

        await this.storeNotifications(notifications)
      }
    } catch (error) {
      console.error("Error checking bill reminders:", error)
    }
  }

  private async createBillReminder(bill: Bill) {
    const dueDate = new Date(bill.dueDate!)
    const notification = {
      id: `bill_${bill.id}_${bill.dueDate}`,
      title: "Bill Reminder",
      message: `Your ${bill.name} bill of $${bill.amount} is due on ${dueDate.toLocaleDateString()}`,
      type: "bill",
      timestamp: new Date().toISOString(),
      read: false
    }

    try {
      const notifications = await LocalStorage.getData(STORAGE_KEYS.NOTIFICATIONS) || []
      notifications.unshift(notification)
      await LocalStorage.saveData(STORAGE_KEYS.NOTIFICATIONS, notifications)
    } catch (error) {
      console.error("Error creating bill reminder:", error)
    }
  }

  private async getStoredNotifications(): Promise<string[]> {
    try {
      return await LocalStorage.getData(STORAGE_KEYS.SENT_NOTIFICATIONS) || []
    } catch (error) {
      console.error("Error getting stored notifications:", error)
      return []
    }
  }

  private async storeNotifications(notifications: string[]) {
    try {
      await LocalStorage.saveData(STORAGE_KEYS.SENT_NOTIFICATIONS, notifications)
    } catch (error) {
      console.error("Error storing notifications:", error)
    }
  }
}

export const notificationService = NotificationService.getInstance() 