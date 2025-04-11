import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'budget' | 'bill' | 'goal' | 'system';
  timestamp: string;
  read: boolean;
}

export default function NotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Budget Alert',
      message: 'You have exceeded your Food & Dining budget by $50',
      type: 'budget',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      title: 'Bill Due Soon',
      message: 'Your electricity bill of $120 is due in 3 days',
      type: 'bill',
      timestamp: '5 hours ago',
      read: false,
    },
    {
      id: '3',
      title: 'Goal Achievement',
      message: 'Congratulations! You have reached 80% of your Emergency Fund goal',
      type: 'goal',
      timestamp: '1 day ago',
      read: true,
    },
    {
      id: '4',
      title: 'System Update',
      message: 'New features available! Check out our latest updates',
      type: 'system',
      timestamp: '2 days ago',
      read: true,
    },
  ]);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'budget':
        return '#FF6B6B';
      case 'bill':
        return '#4ECDC4';
      case 'goal':
        return '#4CAF50';
      case 'system':
        return '#4A90E2';
      default:
        return '#757575';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'budget':
        return '💰';
      case 'bill':
        return '📄';
      case 'goal':
        return '🎯';
      case 'system':
        return '⚙️';
      default:
        return '📢';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Notifications</Text>
        <Text style={styles.headerSubtitle}>Stay updated with your finances</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Notification Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>{notifications.length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Unread</Text>
              <Text style={styles.summaryValue}>
                {notifications.filter(n => !n.read).length}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Read</Text>
              <Text style={styles.summaryValue}>
                {notifications.filter(n => n.read).length}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.notificationsHeader}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          {notifications.length > 0 && (
            <TouchableOpacity onPress={clearAll}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔔</Text>
            <Text style={styles.emptyStateTitle}>No Notifications</Text>
            <Text style={styles.emptyStateText}>
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
        ) : (
          notifications.map(notification => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadNotification,
              ]}
              onPress={() => markAsRead(notification.id)}
            >
              <View style={styles.notificationHeader}>
                <View style={[styles.notificationIcon, { backgroundColor: getNotificationColor(notification.type) }]}>
                  <Text style={styles.iconText}>{getNotificationIcon(notification.type)}</Text>
                </View>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationTime}>{notification.timestamp}</Text>
                </View>
                {!notification.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
            </TouchableOpacity>
          ))
        )}
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2D3436',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3436',
  },
  clearAllText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 5,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: '#F8F9FA',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconText: {
    fontSize: 20,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3436',
  },
  notificationTime: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 2,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A90E2',
  },
}); 