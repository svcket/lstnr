import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ChevronRight, History } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { BottomNav } from '../components/home/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { ICONS } from '../constants/assets';

// Components
import { PortfolioCard } from '../components/home/PortfolioCard';
import { HorizontalCard } from '../components/home/HorizontalCard';

// --- SPACING CONSTANTS (STRICT) ---
const PAGE_X = 16;
const CARD_PAD = 16;
const ROW_GAP = 12;
const SECTION_GAP = 16; // strict 16px spacing per Senior Dev requirement
const STACK_GAP = 4; // Tight gap between text lines

// --- MOCK DATA ---
const MOCK_PORTFOLIO = {
  totalValue: '$12,430.55',
  dailyChange: '$612.40',
  dailyPercentage: '4.8%',
  isPositive: true,
};

const MOCK_SHARES = [
  { id: '1', artistName: 'Neon Dust', shares: '120 shares', value: '$1,840.00', change: '+6.3%', isPositive: true, avatar: 'https://i.pravatar.cc/150?u=a1' },
  { id: '2', artistName: 'Luna Tide', shares: '450 shares', value: '$4,250.50', change: '-2.1%', isPositive: false, avatar: 'https://i.pravatar.cc/150?u=a2' },
  { id: '3', artistName: 'Steel Pulse', shares: '60 shares', value: '$840.00', change: '+1.2%', isPositive: true, avatar: 'https://i.pravatar.cc/150?u=a3' },
];

const MOCK_PREDICTIONS = [
  { id: 'p1', title: 'Will "Neon Dust" hit Top 10?', subtitle: 'Stake: $120 • YES', type: 'prediction' as const, isPositive: true },
  { id: 'p2', title: 'Album Release: Dec 2025', subtitle: 'Stake: $350 • YES', type: 'prediction' as const, isPositive: true },
];

const MOCK_ACTIVITY = [
  { id: 'a1', text: 'Bought 40 Neon Dust shares', time: '2h ago', amount: '$180' },
  { id: 'a2', text: 'Sold 12 Luna Tide shares', time: 'Yesterday', amount: '$64' },
  { id: 'a3', text: 'Predicted YES: Album 2025', time: '2d ago', amount: '$50' },
  { id: 'a4', text: 'Added funds', time: '3d ago', amount: '$200' },
  { id: 'a5', text: 'Claimed payout: Headies', time: '1w ago', amount: '$92' },
];

// Learn items now use strict Asset keys
const MOCK_LEARN = [
  { id: 'l1', title: 'What is LSTNR?', subtitle: 'Artists, shares, and predictions.', icon: ICONS.learnLstnr },
  { id: 'l2', title: 'Owning artist shares', subtitle: 'What you hold, what moves price.', icon: ICONS.learnShares },
  { id: 'l3', title: 'Prediction markets', subtitle: 'Binary + multi-range, simplified.', icon: ICONS.learnPredictions },
  { id: 'l4', title: 'Who decides outcomes?', subtitle: 'How markets resolve and settle.', icon: ICONS.learnResolve },
];

const MOCK_UPDATES = [
  { id: 'u1', text: 'Neon Dust +3.1% today', time: '1h ago', type: 'gain' },
  { id: 'u2', text: 'Your prediction "Album Release" moved to 68%', time: '4h ago', type: 'neutral' },
  { id: 'u3', text: 'Market settled: Headies Next Rated', time: '1d ago', type: 'settled' },
];

// --- REUSABLE COMPONENTS ---

// 1. Section Header (Title + Chevron)
const SectionHeader = ({ title, onPress }: { title: string; onPress?: () => void }) => (
  <TouchableOpacity 
    style={styles.sectionHeader} 
    onPress={onPress} 
    activeOpacity={0.7}
  >
    <Text style={styles.sectionTitle}>{title}</Text>
    <Image 
      source={ICONS.chevronRight} 
      style={{ width: 6, height: 12, tintColor: COLORS.textSecondary }} 
      resizeMode="contain"
    />
  </TouchableOpacity>
);

// 2. Generic Row Item
interface RowItemProps {
  leftIcon: React.ReactNode;
  title: string;
  subtitle: string;
  rightTop?: string;
  rightBottom?: string;
  isPositive?: boolean;
  showChevron?: boolean;
  hasDivider?: boolean;
}

const RowItem = ({ 
  leftIcon, 
  title, 
  subtitle, 
  rightTop, 
  rightBottom, 
  isPositive, 
  showChevron, 
  hasDivider 
}: RowItemProps) => (
  <View style={styles.rowWrapper}>
    <View style={styles.rowContent}>
      {/* Left Cluster - Flex 1 to allow text truncation */}
      <View style={styles.rowLeft}>
        <View style={styles.iconContainer}>
          {leftIcon}
        </View>
        <View style={styles.textStack}>
          <Text style={styles.rowTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
          <Text style={styles.rowSubtitle} numberOfLines={1} ellipsizeMode="tail">{subtitle}</Text>
        </View>
      </View>

      {/* Right Cluster - Flex undefined to hug content */}
      <View style={styles.rowRight}>
        {rightTop && <Text style={styles.rowValue}>{rightTop}</Text>}
        {rightBottom && (
          <Text style={[styles.rowChange, { color: isPositive ? COLORS.success : COLORS.error }]}>
            {rightBottom}
          </Text>
        )}
        {showChevron && <ChevronRight color={COLORS.textSecondary} size={16} />}
      </View>
    </View>
    
    {/* Divider never renders for last item */}
    {hasDivider && <View style={styles.divider} />}
  </View>
);

export const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>(); 
  const [hasPositions, setHasPositions] = useState(true);

  const renderQuickAction = (iconSource: ImageSourcePropType, label: string, onPress?: () => void) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.quickActionIcon}>
         <Image source={iconSource} style={styles.actionImage} resizeMode="contain" />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good evening</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Bell color={COLORS.text} size={24} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
               <View style={styles.userAvatar}>
                 <Text style={styles.userAvatarText}>{user?.name?.[0] || 'U'}</Text>
               </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Portfolio Hero */}
          <PortfolioCard 
             totalValue={hasPositions ? MOCK_PORTFOLIO.totalValue : '$0.00'}
             dailyChange={hasPositions ? MOCK_PORTFOLIO.dailyChange : '0.00'}
             dailyPercentage={hasPositions ? MOCK_PORTFOLIO.dailyPercentage : '0%'}
             isPositive={true}
          />

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            {renderQuickAction(ICONS.actionAdd, 'Add Cash')}
            {renderQuickAction(ICONS.actionWithdraw, 'Withdraw')}
            {renderQuickAction(ICONS.actionBuy, 'Buy Shares')}
            {renderQuickAction(ICONS.actionPredict, 'Predict')}
          </View>

          {!hasPositions ? (
            /* EMPTY STATE */
            <View style={styles.emptyStateCard}>
               <Text style={styles.emptyTitle}>You don’t hold any positions yet.</Text>
               <Text style={styles.emptySubtitle}>Explore artists and predictions to get started.</Text>
               <TouchableOpacity 
                  style={styles.exploreButton}
                  onPress={() => setHasPositions(true)} 
               >
                  <Text style={styles.exploreButtonText}>Explore (Toggle State)</Text>
               </TouchableOpacity>
            </View>
          ) : (
            /* POPULATED STATE */
            <>
              {/* Your Shares */}
              <View style={styles.section}>
                 <SectionHeader title="Your shares" />
                 <View style={styles.card}>
                    {MOCK_SHARES.map((share, index) => (
                      <RowItem 
                        key={share.id}
                        leftIcon={<Image source={{ uri: share.avatar }} style={styles.artistAvatar} />}
                        title={share.artistName}
                        subtitle={share.shares}
                        rightTop={share.value}
                        rightBottom={share.change}
                        isPositive={share.isPositive}
                        hasDivider={index < MOCK_SHARES.length - 1} // No divider for last item
                      />
                    ))}
                 </View>
              </View>

              {/* Your Predictions */}
              <View style={styles.section}>
                  <SectionHeader title="Your predictions" />
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={{ paddingHorizontal: PAGE_X }} 
                  >
                      {MOCK_PREDICTIONS.map(pred => (
                          <HorizontalCard 
                            key={pred.id}
                            title={pred.title}
                            subtitle={pred.subtitle}
                            type="prediction"
                          />
                      ))}
                  </ScrollView>
              </View>

              {/* Recent Activity */}
              <View style={styles.section}>
                 <SectionHeader title="Recent activity" />
                 <View style={styles.card}>
                    {MOCK_ACTIVITY.map((item, index) => (
                       <RowItem 
                          key={item.id}
                          leftIcon={<History color={COLORS.textSecondary} size={20} />} 
                          title={item.text}
                          subtitle={item.time}
                          rightTop={item.amount}
                          hasDivider={index < MOCK_ACTIVITY.length - 1}
                       />
                    ))}
                 </View>
              </View>
            </>
          )}

          {/* Updates */}
          <View style={styles.section}>
             <SectionHeader title="Updates" />
             <View style={styles.card}>
                 {MOCK_UPDATES.map((item, index) => (
                    <RowItem 
                      key={item.id}
                      leftIcon={<Bell color={COLORS.primary} size={20} fill={COLORS.primary} />}
                      title={item.text}
                      subtitle={item.time}
                      hasDivider={index < MOCK_UPDATES.length - 1}
                    />
                 ))}
             </View>
          </View>

           {/* Learn */}
           <View style={styles.section}>
             <SectionHeader title="Learn" />
             <View style={styles.card}>
                 {MOCK_LEARN.map((item, index) => (
                    <TouchableOpacity key={item.id}>
                        <RowItem 
                          leftIcon={
                            <Image 
                              source={item.icon} 
                              style={styles.learnIcon} 
                              resizeMode="contain"
                            />
                          }
                          title={item.title}
                          subtitle={item.subtitle}
                          showChevron
                          hasDivider={index < MOCK_LEARN.length - 1}
                        />
                    </TouchableOpacity>
                 ))}
             </View>
          </View>

        </ScrollView>

        <BottomNav />
      </SafeAreaView>
    </View>
  );
};


// --- PIXEL PERFECT STYLES ---
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PAGE_X,
    paddingVertical: 16,
  },
  greeting: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 24,
    color: COLORS.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  userAvatarText: {
    fontFamily: FONT_FAMILY.header,
    color: '#FFF',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 120, // BottomNav space
  },
  
  // Quick Actions
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: PAGE_X,
    marginBottom: SECTION_GAP,
  },
  quickAction: {
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionImage: {
    width: 24,
    height: 24,
  },
  quickActionLabel: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
    color: COLORS.text,
  },
  
  // Sections
  section: {
    marginBottom: SECTION_GAP,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PAGE_X,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 18,
    color: COLORS.text,
    lineHeight: 25,
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: 16,
    marginHorizontal: PAGE_X, 
    padding: CARD_PAD, 
    overflow: 'hidden',
  },
  
  // Reusable Row Item
  rowWrapper: {
    width: '100%',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48, 
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16, 
  },
  iconContainer: {
    width: 40, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginRight: ROW_GAP,
  },
  artistAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  learnIcon: {
    width: 40,
    height: 40,
    borderRadius: 8, // Matching the tiles in screenshot
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textSecondary,
  },
  textStack: {
    flex: 1,
    gap: STACK_GAP,
  },
  rowTitle: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 16,
    color: COLORS.text,
  },
  rowSubtitle: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  
  // Right side
  rowRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rowValue: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 16,
    color: COLORS.text,
  },
  rowChange: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 13,
  },
  
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 12,
    width: '100%',
  },

  // Empty State
  emptyStateCard: {
    margin: PAGE_X,
    padding: 32,
    backgroundColor: '#111111',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  exploreButtonText: {
    fontFamily: FONT_FAMILY.header,
    color: '#000',
    fontSize: 16,
  },
});
