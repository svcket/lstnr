import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONT_FAMILY, SPACING } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
import { ICONS } from '../constants/assets';

const { width } = Dimensions.get('window');

// Mock Data for Details (Ideally moved to a separate data file)
const LEARN_DETAILS: Record<string, any> = {
  'l1': {
    title: 'What is LSTNR?',
    subtitle: 'Artists, shares, and predictions.',
    image: ICONS.learnLstnr, 
    content: [
      { type: 'text', value: 'LSTNR is a platform where music meets markets. We empower fans to invest in the artists they believe in and predict the outcomes of music events.' },
      { type: 'heading', value: 'How it works' },
      { type: 'text', value: 'You can buy shares in artists, which tracks their real-world performance. As they grow in popularity, the value of your shares increases.' },
      { type: 'heading', value: 'Why invest?' },
      { type: 'text', value: 'Support your favorite artists directly and earn rewards for your conviction. It is more than just listening; it is about ownership and participation.' },
    ]
  },
  'l2': {
    title: 'Owning artist shares',
    subtitle: 'What you hold, what moves price.',
    image: ICONS.learnShares,
    content: [
      { type: 'text', value: 'When you buy a share, you are buying a fraction of that artist’s tracking stock on LSTNR.' },
      { type: 'heading', value: 'Price Movements' },
      { type: 'text', value: 'Prices move based on supply and demand on the platform, which is often driven by real-world metrics like streaming numbers, chart positions, and social buzz.' },
    ]
  },
  'l3': {
    title: 'Prediction markets',
    subtitle: 'Binary + multi-range, simplified.',
    image: ICONS.learnPredictions,
    content: [
      { type: 'text', value: 'Prediction markets allow you to bet on the outcome of future events. Will an album drop next month? Will a song hit #1?' },
      { type: 'heading', value: 'Binary Outcomes' },
      { type: 'text', value: 'YES or NO. Simple. If you predict correctly, you win the payout. If not, your position goes to zero.' },
    ]
  },
  'l4': {
    title: 'Who decides outcomes?',
    subtitle: 'How markets resolve and settle.',
    image: ICONS.learnResolve,
    content: [
      { type: 'text', value: 'Markets are resolved based on publicly verifiable data sources like Spotify Charts, Billboard, or official artist announcements.' },
      { type: 'heading', value: 'Trust & Verification' },
      { type: 'text', value: 'Our resolution criteria are clearly stated for every market. We use trusted third-party oracles and data partners to ensure fairness.' },
    ]
  }
};

export const LearnDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { id } = route.params || {};

  const detail = LEARN_DETAILS[id];

  if (!detail) return null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <HeaderBack />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Image */}
          <View style={styles.imageContainer}>
             <Image source={detail.image} style={styles.heroImage} resizeMode="contain" /> 
          </View>

          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{detail.title}</Text>
            <Text style={styles.subtitle}>{detail.subtitle}</Text>
          </View>

          {/* Content Body */}
          <View style={styles.body}>
            {detail.content.map((block: any, index: number) => {
              if (block.type === 'heading') {
                return <Text key={index} style={styles.heading}>{block.value}</Text>;
              }
              return <Text key={index} style={styles.paragraph}>{block.value}</Text>;
            })}
          </View>
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: width,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: COLORS.surface,
  },
  heroImage: {
    width: 200,
    height: 200,
  },
  titleContainer: {
    paddingHorizontal: SPACING.l,
    marginBottom: 24,
  },
  title: {
    fontFamily: FONT_FAMILY.balance, // Bold display
    fontSize: 32,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.header, // Medium
    fontSize: 20,
    color: COLORS.textSecondary,
    lineHeight: 28,
  },
  body: {
    paddingHorizontal: SPACING.l,
  },
  heading: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 22,
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 12,
    fontWeight: '600',
  },
  paragraph: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 28,
    marginBottom: 16,
  },
});
