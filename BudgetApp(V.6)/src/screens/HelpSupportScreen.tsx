import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MainTabNavigationProp } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  FileText,
  Phone,
  Mail,
  ChevronRight,
  BookOpen,
} from 'lucide-react-native';

type Props = {
  navigation: MainTabNavigationProp;
};

export default function HelpSupportScreen({ navigation }: Props) {
  const { colors } = useTheme();

  const helpItems = [
    {
      id: 'faq',
      title: 'FAQ',
      description: 'Frequently asked questions',
      icon: HelpCircle,
      color: colors.primary,
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: MessageCircle,
      color: colors.success,
    },
    {
      id: 'guides',
      title: 'User Guides',
      description: 'Learn how to use the app',
      icon: BookOpen,
      color: colors.warning,
    },
    {
      id: 'contact',
      title: 'Contact Us',
      description: 'Get in touch with us',
      icon: Phone,
      color: colors.info,
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us an email',
      icon: Mail,
      color: colors.accent,
    },
    {
      id: 'terms',
      title: 'Terms & Privacy',
      description: 'Legal information',
      icon: FileText,
      color: colors.secondary,
    },
  ];

  const handleHelpItemPress = (id: string) => {
    // TODO: Implement help item actions
    console.log(`${id} pressed`);
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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.surface }]}>
            Help & Support
          </Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {helpItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.helpItem,
                index !== helpItems.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
              onPress={() => handleHelpItemPress(item.id)}
            >
              <View style={styles.helpItemLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${item.color}15` },
                  ]}
                >
                  <item.icon size={20} color={item.color} />
                </View>
                <View style={styles.helpItemContent}>
                  <Text style={[styles.helpItemTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  <Text
                    style={[styles.helpItemDescription, { color: colors.textSecondary }]}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.supportCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.supportTitle, { color: colors.text }]}>
            24/7 Premium Support
          </Text>
          <Text style={[styles.supportDescription, { color: colors.textSecondary }]}>
            Our support team is available around the clock to help you with any
            questions or issues you may have.
          </Text>
          <TouchableOpacity
            style={[styles.supportButton, { backgroundColor: colors.primary }]}
            onPress={() => handleHelpItemPress('chat')}
          >
            <MessageCircle size={20} color={colors.surface} />
            <Text style={[styles.supportButtonText, { color: colors.surface }]}>
              Start Chat
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  helpItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  helpItemContent: {
    flex: 1,
  },
  helpItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  helpItemDescription: {
    fontSize: 14,
  },
  supportCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  supportDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 16,
    gap: 8,
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 