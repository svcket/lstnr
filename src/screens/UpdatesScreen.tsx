import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { ICONS } from '../constants/assets';

// Reuse RowItem logic if exported, or duplicate small component for isolation (cleaner here)
// Actually we can export RowItem from HomeScreen or copy it. Copying for speed/isolation as per "Do not introduce deps" preference usually.
// But better to export. Let's start with local definition to strictly match specs without breaking Home.

const ROW_GAP = 12;
const STACK_GAP = 4;
const CARD_PAD = 16;
const PAGE_X = 16;

const MOCK_UPDATES = [
  { id: 'u1', text: 'Neon Dust +3.1% today', time: '1h ago', type: 'gain' },
  { id: 'u2', text: 'Your prediction "Album Release" moved to 68%', time: '4h ago', type: 'neutral' },
  { id: 'u3', text: 'Market settled: Headies Next Rated', time: '1d ago', type: 'settled' },
  { id: 'u4', text: 'New Artist: "Fuji" is now live', time: '2d ago', type: 'neutral' },
  { id: 'u5', text: 'System maintenance scheduled', time: '1w ago', type: 'system' },
];

const UpdateRow = ({ title, subtitle, hasDivider }: { title: string; subtitle: string; hasDivider: boolean }) => (
  <View style={styles.rowWrapper}>
    <View style={styles.rowContent}>
      <View style={styles.rowLeft}>
        <View style={styles.iconContainer}>
          <Image 
             source={ICONS.updates} 
             style={styles.feedIcon} 
             resizeMode="contain" 
          />
        </View>
        <View style={styles.textStack}>
          <Text style={styles.rowTitle} numberOfLines={2}>{title}</Text>
          <Text style={styles.rowSubtitle} numberOfLines={1}>{subtitle}</Text>
        </View>
      </View>
    </View>
    {hasDivider && <View style={styles.divider} />}
  </View>
);

export const UpdatesScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft color={COLORS.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Updates</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
           <View style={styles.card}>
             {MOCK_UPDATES.map((item, index) => (
               <UpdateRow 
                 key={item.id}
                 title={item.text}
                 subtitle={item.time}
                 hasDivider={index < MOCK_UPDATES.length - 1}
               />
             ))}
           </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PAGE_X,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerTitle: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 18,
    color: COLORS.text,
    letterSpacing: 1,
  },
  backButton: {
    padding: 4,
  },
  scrollContent: {
    padding: PAGE_X,
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: CARD_PAD,
    overflow: 'hidden',
  },
  rowWrapper: {
    width: '100%',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48, 
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginRight: ROW_GAP,
  },
  feedIcon: {
    width: 40,
    height: 40,
    tintColor: COLORS.primary, // Using primary tint for consistency
  },
  textStack: {
    flex: 1,
    gap: STACK_GAP,
  },
  rowTitle: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 16,
    color: COLORS.text,
    letterSpacing: 1,
  },
  rowSubtitle: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 12,
    width: '100%',
  },
});
