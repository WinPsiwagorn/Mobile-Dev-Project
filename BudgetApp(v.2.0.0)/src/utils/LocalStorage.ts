import AsyncStorage from '@react-native-async-storage/async-storage'

export class LocalStorage {
  static async saveData(key: string, data: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(data)
      await AsyncStorage.setItem(key, jsonValue)
    } catch (error) {
      console.error('Error saving data:', error)
      throw error
    }
  }

  static async getData(key: string): Promise<any> {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (error) {
      console.error('Error getting data:', error)
      throw error
    }
  }

  static async removeData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing data:', error)
      throw error
    }
  }

  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear()
    } catch (error) {
      console.error('Error clearing storage:', error)
      throw error
    }
  }
} 