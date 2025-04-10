import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SettingSection {
  title: string;
  items: {
    id: string;
    title: string;
    description?: string;
    type: 'toggle' | 'select' | 'button';
    value?: boolean;
    options?: string[];
  }[];
}

export default function SettingsView() {
  const [settings, setSettings] = useState<SettingSection[]>([
    {
      title: 'General',
      items: [
        {
          id: 'currency',
          title: 'Default Currency',
          description: 'USD',
          type: 'select',
          options: ['USD', 'EUR', 'GBP', 'JPY'],
        },
        {
          id: 'theme',
          title: 'Dark Mode',
          description: 'Enable dark theme',
          type: 'toggle',
          value: false,
        },
        {
          id: 'notifications',
          title: 'Push Notifications',
          description: 'Receive alerts and updates',
          type: 'toggle',
          value: true,
        },
      ],
    },
    {
      title: 'Budget',
      items: [
        {
          id: 'monthly_reset',
          title: 'Monthly Budget Reset',
          description: 'Automatically reset budgets at the start of each month',
          type: 'toggle',
          value: true,
        },
        {
          id: 'overbudget_alert',
          title: 'Over-budget Alerts',
          description: 'Get notified when you exceed category budgets',
          type: 'toggle',
          value: true,
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          id: 'biometric',
          title: 'Biometric Login',
          description: 'Use fingerprint or face recognition to unlock the app',
          type: 'toggle',
          value: false,
        },
        {
          id: 'export_data',
          title: 'Export Data',
          description: 'Download your financial data as CSV',
          type: 'button',
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          id: 'version',
          title: 'App Version',
          description: '1.0.0',
          type: 'button',
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          type: 'button',
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          type: 'button',
        },
      ],
    },
  ]);

  const handleToggle = (sectionIndex: number, itemId: string) => {
    const newSettings = [...settings];
    const item = newSettings[sectionIndex].items.find(i => i.id === itemId);
    if (item && item.type === 'toggle') {
      item.value = !item.value;
      setSettings(newSettings);
    }
  };

  const renderSettingItem = (item: any, sectionIndex: number) => {
    switch (item.type) {
      case 'toggle':
        return (
          <Switch
            value={item.value}
            onValueChange={() => handleToggle(sectionIndex, item.id)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={item.value ? '#4A90E2' : '#f4f3f4'}
          />
        );
      case 'select':
        return (
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>{item.description}</Text>
            <Text style={styles.selectArrow}>›</Text>
          </TouchableOpacity>
        );
      case 'button':
        return (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{item.description || '›'}</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your app preferences</Text>
      </LinearGradient>

      <View style={styles.content}>
        {settings.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map(item => (
              <View key={item.id} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  {item.description && (
                    <Text style={styles.settingDescription}>{item.description}</Text>
                  )}
                </View>
                {renderSettingItem(item, sectionIndex)}
              </View>
            ))}
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3436',
  },
  settingDescription: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 2,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectButtonText: {
    fontSize: 14,
    color: '#2D3436',
    marginRight: 8,
  },
  selectArrow: {
    fontSize: 18,
    color: '#636E72',
  },
  button: {
    padding: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#4A90E2',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 