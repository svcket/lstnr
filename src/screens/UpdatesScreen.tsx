import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
import { Bell, ArrowUpRight, CheckCircle2, Info } from 'lucide-react-native';

const ROW_GAP = 12;
const STACK_GAP = 4;
const CARD_PAD = 16;
const PAGE_X = 16;

const MOCK_UPDATES = [
  { id: 'u1', text: 'Neon Dust +3.1% today', time: '1h ago', type: 'gain', icon: ArrowUpRight, color: COLORS.success },
  { id: 'u2', text: 'Your prediction "Album Release" moved to 68%', time: '4h ago', type: 'neutral', icon: Bell, color: '#FFD700' },
  { id: 'u3', text: 'Market settled: Headies Next Rated', time: '1d ago', type: 'settled', icon: CheckCircle2, color: COLORS.primary },
  { id: 'u4', text: 'New Artist: "Fuji" is now live', time: '2d ago', type: 'neutral', icon: Info, color: '#888' },
  { id: 'u5', text: 'System maintenance scheduled', time: '1w ago', type: 'system', icon: Info, color: '#FF4444' },
];

const UpdateRow = ({ title, subtitle, hasDivider, icon: Icon, color }: any) => (
  <View style={styles.rowWrapper}>
    <View style={styles.rowContent}>
      <View style={styles.rowLeft}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Icon size={20} color={color} />
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
        
        {/* Header - Left Aligned */}
        <View style={styles.header}>
          <HeaderBack />
          <Text style={styles.headerTitle}>Updates</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
           <View style={styles.card}>
             {MOCK_UPDATES.map((item, index) => (
               <UpdateRow 
                 key={item.id}
                 title={item.text}
                 subtitle={item.time}
                 hasDivider={index < MOCK_UPDATES.length - 1}
                 icon={item.icon || Bell}
                 color={item.color || COLORS.white}
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
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PAGE_X,
    paddingBottom: 16,
    gap: 12,
  },
  headerTitle: {
    fontFamily: FONT_FAMILY.medium,
    fontWeight: '600',
    fontSize: 18,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: PAGE_X,
    paddingTop: 0,
  },
  card: {
    backgroundColor: COLORS.surface,
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
    height: 40,
    borderRadius: 20,
    alignItems: 'center', 
    justifyContent: 'center',
    marginRight: ROW_GAP,
  },
  textStack: {
    flex: 1,
    gap: STACK_GAP,
  },
  rowTitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 20,
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
