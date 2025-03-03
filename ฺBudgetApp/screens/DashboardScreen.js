import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePockets } from '../context/PocketContext';

// Sample ads data
const ads = [
  {
    id: '1',
    image: 'https://www.coca-cola.com/content/dam/onexp/th/th/brand-coca-cola/Coke_Sharing_Banner.jpg',
    title: 'Share a Coke',
    description: 'Buy 1 Get 1 Free at 7-Eleven',
  },
  {
    id: '2',
    image: 'https://media.licdn.com/dms/image/D5612AQETm1YyJyXVlw/article-cover_image-shrink_720_1280/0/1699840943352?e=2147483647&v=beta&t=8UUk8_VKvkqR_NKZ4yaYYNx8yKqHFCxEj-6lUyIQTzM',
    title: 'McDonald\'s Deal',
    description: '20% off on Big Mac Meal',
  },
  {
    id: '3',
    image: 'https://www.marketing-interactive.com/images/sg/content-images/Grab%20pay%20later.jpg',
    title: 'GrabPay Offer',
    description: 'Get ฿100 cashback on first payment',
  },
];

// Sample bills data
const bills = [
  {
    id: '1',
    title: 'Investment',
    subtitle: 'in 3 days',
  },
  {
    id: '2',
    title: 'electronics mom\'s',
    subtitle: 'home',
    days: 'in 7 days',
  },
  {
    id: '3',
    title: 'Utilities',
    subtitle: 'in 10 days',
  },
];

// Sample promotions
const promotions = [
  {
    id: '1',
    title: 'Promotions',
  },
  {
    id: '2',
    title: 'Special Offers',
  },
];

export default function DashboardScreen({ navigation }) {
  const { pockets, getPocketsByCategory } = usePockets();
  const [currentPromotionIndex, setCurrentPromotionIndex] = useState(0);
  const promotionWidth = Dimensions.get('window').width - 32; // Full width minus padding

  // Calculate total balance from all pockets
  const totalBalance = pockets.reduce((sum, pocket) => sum + pocket.currentAmount, 0);
  
  // Get upcoming bills
  const billsData = getPocketsByCategory('bills').sort((a, b) => a.dueDate - b.dueDate);

  const handlePromotionScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / promotionWidth);
    setCurrentPromotionIndex(index);
  };

  const renderAd = ({ item }) => (
    <TouchableOpacity style={styles.adCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.adImage}
        resizeMode="cover"
      />
      <View style={styles.adTextContainer}>
        <Text style={styles.adTitle}>{item.title}</Text>
        <Text style={styles.adDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderBill = ({ item }) => (
    <View style={styles.billCard}>
      <Text style={styles.billTitle}>{item.title}</Text>
      <Text style={styles.billSubtitle}>{item.subtitle}</Text>
      {item.days && <Text style={styles.billDays}>{item.days}</Text>}
      <TouchableOpacity style={styles.payButton}>
        <Text style={styles.payButtonText}>pay</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPromotion = ({ item }) => (
    <View style={[styles.promotionCard, { width: promotionWidth }]}>
      <Text style={styles.promotionTitle}>{item.title}</Text>
    </View>
  );

  const renderDotIndicator = () => {
    return (
      <View style={styles.paginationDots}>
        {promotions.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentPromotionIndex ? '#8A2BE2' : '#D8D8D8' }
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Current Balance Card - Clickable */}
        <TouchableOpacity 
          style={styles.balanceCard}
          onPress={() => navigation.navigate('Account', { screen: 'Account' })}
        >
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>฿{totalBalance.toLocaleString()}</Text>
        </TouchableOpacity>

        {/* Upcoming Bills Section */}
        <View style={styles.billsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Bills</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Account', { screen: 'Account', params: { initialCategory: 'bills' } })}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.billsScrollView}
          >
            {billsData.map((bill) => (
              <TouchableOpacity
                key={bill.id}
                style={styles.billCard}
                onPress={() => navigation.navigate('Account', { 
                  screen: 'Account',
                  params: { initialCategory: 'bills' }
                })}
              >
                <Text style={styles.billName}>{bill.name}</Text>
                <Text style={styles.billDueDate}>in {bill.dueDate} days</Text>
                <TouchableOpacity 
                  style={styles.payButton}
                  onPress={() => navigation.navigate('PocketDetails', { pocket: bill })}
                >
                  <Text style={styles.payButtonText}>pay</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Suggest Section */}
        <View style={[styles.section, styles.suggestSection]}>
          <Text style={styles.sectionTitle}>Suggest</Text>
          <View style={styles.promotionsWrapper}>
            <FlatList
              data={promotions}
              renderItem={renderPromotion}
              keyExtractor={item => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handlePromotionScroll}
              snapToInterval={promotionWidth}
              decelerationRate="fast"
              contentContainerStyle={styles.promotionsContainer}
            />
            {renderDotIndicator()}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingLeft: 20,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  balanceCard: {
    backgroundColor: '#8A2BE2',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  billsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  viewAllText: {
    color: '#8A2BE2',
    fontSize: 14,
    fontWeight: '600',
  },
  billsScrollView: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  billCard: {
    backgroundColor: '#8A2BE2',
    borderRadius: 15,
    padding: 16,
    marginRight: 12,
    width: 150,
  },
  billName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  billDueDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  payButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#8A2BE2',
    fontSize: 14,
    fontWeight: '600',
  },
  promotionsContainer: {
    paddingRight: 16,
  },
  suggestSection: {
    marginBottom: 16, // Reduced bottom margin
  },
  promotionsWrapper: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  promotionCard: {
    backgroundColor: '#5FD3D0',
    height: 140, // Increased height slightly
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 0, // Remove margin to make it full width
  },
  promotionTitle: {
    color: '#fff',
    fontSize: 24, // Increased font size
    fontWeight: 'bold',
    textAlign: 'center',
  },
  adContainer: {
    paddingRight: 16,
  },
  adCard: {
    width: 280,
    height: 200,
    marginRight: 12,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  adImage: {
    width: '100%',
    height: 150,
  },
  adTextContainer: {
    padding: 12,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  adDescription: {
    fontSize: 14,
    color: '#666',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12, // Added vertical padding
    backgroundColor: '#fff',
  },
  dot: {
    width: 6, // Slightly smaller dots
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3, // Closer dots
  },
});