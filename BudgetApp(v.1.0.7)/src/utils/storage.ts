import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for different types of data
export const STORAGE_KEYS = {
  USER_DATA: '@user_data',
  USERS: '@users',
  TRANSACTIONS: '@transactions',
  CATEGORIES: '@categories',
  ACCOUNTS: '@accounts',
  BUDGETS: '@budgets',
  SETTINGS: '@settings',
  LAST_SYNC: '@last_sync',
  BILLS: '@bills',
};

// Data retention periods (in milliseconds)
const RETENTION_PERIODS = {
  TRANSACTIONS: 90 * 24 * 60 * 60 * 1000, // 90 days
  BUDGETS: 365 * 24 * 60 * 60 * 1000, // 1 year
  USERS: 365 * 24 * 60 * 60 * 1000, // 1 year
  ACCOUNTS: 365 * 24 * 60 * 60 * 1000, // 1 year
  CATEGORIES: 365 * 24 * 60 * 60 * 1000, // 1 year
  BILLS: 365 * 24 * 60 * 60 * 1000, // 1 year
};

export class LocalStorage {
  // Save data with timestamp
  static async saveData(key: string, data: any) {
    try {
      console.log("LocalStorage: Saving data for key:", key, "Data:", data)
      const item = {
        data,
        timestamp: new Date().getTime(),
      };
      const jsonValue = JSON.stringify(item)
      console.log("LocalStorage: Saving JSON:", jsonValue)
      await AsyncStorage.setItem(key, jsonValue);
      console.log("LocalStorage: Data saved successfully")
    } catch (error) {
      console.error('LocalStorage: Error saving data:', error);
      throw error;
    }
  }

  // Get data and check if it's still valid
  static async getData(key: string) {
    try {
      console.log("LocalStorage: Getting data for key:", key)
      const jsonValue = await AsyncStorage.getItem(key);
      console.log("LocalStorage: Retrieved JSON:", jsonValue)
      
      if (!jsonValue) {
        console.log("LocalStorage: No data found for key:", key)
        return null;
      }

      const item = JSON.parse(jsonValue);
      console.log("LocalStorage: Parsed item:", item)
      
      const { data, timestamp } = item;
      const retentionPeriod = RETENTION_PERIODS[key as keyof typeof RETENTION_PERIODS];
      
      if (retentionPeriod && new Date().getTime() - timestamp > retentionPeriod) {
        console.log("LocalStorage: Data expired for key:", key)
        // Data is too old, remove it
        await this.removeData(key);
        return null;
      }

      console.log("LocalStorage: Data retrieved successfully:", data)
      return data;
    } catch (error) {
      console.error('LocalStorage: Error getting data:', error);
      throw error;
    }
  }

  // Remove specific data
  static async removeData(key: string) {
    try {
      console.log("LocalStorage: Removing data for key:", key)
      await AsyncStorage.removeItem(key);
      console.log("LocalStorage: Data removed successfully")
    } catch (error) {
      console.error('LocalStorage: Error removing data:', error);
      throw error;
    }
  }

  // Clean up old data
  static async cleanupOldData() {
    try {
      console.log("LocalStorage: Starting cleanup")
      const keys = await AsyncStorage.getAllKeys();
      console.log("LocalStorage: Found keys:", keys)
      
      for (const key of keys) {
        const jsonValue = await AsyncStorage.getItem(key);
        if (jsonValue) {
          const item = JSON.parse(jsonValue);
          const { timestamp } = item;
          const retentionPeriod = RETENTION_PERIODS[key as keyof typeof RETENTION_PERIODS];
          
          if (retentionPeriod && new Date().getTime() - timestamp > retentionPeriod) {
            console.log("LocalStorage: Removing expired data for key:", key)
            await this.removeData(key);
          }
        }
      }
      console.log("LocalStorage: Cleanup completed")
    } catch (error) {
      console.error('LocalStorage: Error cleaning up data:', error);
      throw error;
    }
  }

  // Clear all data
  static async clearAll() {
    try {
      console.log("LocalStorage: Clearing all data")
      await AsyncStorage.clear();
      console.log("LocalStorage: All data cleared successfully")
    } catch (error) {
      console.error('LocalStorage: Error clearing data:', error);
      throw error;
    }
  }
} 