import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Plus, ArrowDown, TrendingUp, Zap, ChevronRight, BookOpen, AlertCircle, Info } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { BottomNav } from '../components/home/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Components
import { PortfolioCard } from '../components/home/PortfolioCard';
import { HorizontalCard } from '../components/home/HorizontalCard';

// --- SPACING CONSTANTS (STRICT) ---
const PAGE_X = 16;
const CARD_PAD = 16;
const ROW_GAP = 12;
const SECTION_GAP = 24; // Visual separation between sections
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

const MOCK_LEARN = [
  { id: 'l1', title: 'What is LSTNR?', subtitle: 'Artists, shares, and predictions.', icon: 'book' },
  { id: 'l2', title: 'Owning artist shares', subtitle: 'What you hold, what moves price.', icon: 'info' },
  { id: 'l3', title: 'Prediction markets', subtitle: 'Binary + multi-range, simplified.', icon: 'zap' },
  { id: 'l4', title: 'Who decides outcomes?', subtitle: 'How markets resolve and settle.', icon: 'alert' },
];

const MOCK_UPDATES = [
  { id: 'u1', text: 'Neon Dust +3.1% today', time: '1h ago', type: 'gain' },
  { id: 'u2', text: 'Your prediction "Album Release" moved to 68%', time: '4h ago', type: 'neutral' },
  { id: 'u3', text: 'Market settled: Headies Next Rated', time: '1d ago', type: 'settled' },
];

// --- REUSABLE ROW COMPONENT ---
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
      {/* Left Cluster */}
      <View style={styles.rowLeft}>
        <View style={styles.iconContainer}>
          {leftIcon}
        </View>
        <View style={styles.textStack}>
          <Text style={styles.rowTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.rowSubtitle} numberOfLines={1}>{subtitle}</Text>
        </View>
      </View>

      {/* Right Cluster */}
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
    
    {hasDivider && <View style={styles.divider} />}
  </View>
);

export const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>(); 
  const [hasPositions, setHasPositions] = useState(true);

  const renderQuickAction = (icon: React.ReactNode, label: string, onPress?: () => void) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.quickActionIcon}>
        {icon}
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
            {renderQuickAction(<Plus color="#000" size={20} strokeWidth={2.5} />, 'Add Cash')}
            {renderQuickAction(<ArrowDown color="#000" size={20} strokeWidth={2.5} />, 'Withdraw')}
            {renderQuickAction(<TrendingUp color="#000" size={20} strokeWidth={2.5} />, 'Buy Shares')}
            {renderQuickAction(<Zap color="#000" size={20} strokeWidth={2.5} />, 'Predict')}
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
                 <Text style={styles.sectionTitle}>Your shares</Text>
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
                  <Text style={styles.sectionTitle}>Your predictions</Text>
                  <ScrollView // Keep standard ScrollView for horizontal
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={{ paddingHorizontal: PAGE_X }} // Align start/end
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
                 <Text style={styles.sectionTitle}>Recent activity</Text>
                 <View style={styles.card}>
                    {MOCK_ACTIVITY.map((item, index) => (
                       <RowItem // Reusing generic row for simple layout
                          key={item.id}
                          leftIcon={<View style={styles.dot} />} 
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
             <Text style={styles.sectionTitle}>Updates</Text>
             <View style={styles.card}>
                 {MOCK_UPDATES.map((item, index) => (
                    <RowItem 
                      key={item.id}
                      leftIcon={<View style={[styles.dot, { backgroundColor: COLORS.primary }]} />}
                      title={item.text}
                      subtitle={item.time}
                      hasDivider={index < MOCK_UPDATES.length - 1}
                    />
                 ))}
             </View>
          </View>

           {/* Learn */}
           <View style={styles.section}>
             <Text style={styles.sectionTitle}>Learn</Text>
             <View style={styles.card}>
                 {MOCK_LEARN.map((item, index) => (
                    <TouchableOpacity key={item.id}>
                        <RowItem 
                          leftIcon={
                            item.icon === 'zap' ? <Zap color={COLORS.primary} size={16} /> :
                            item.icon === 'alert' ? <AlertCircle color={COLORS.primary} size={16} /> :
                            item.icon === 'info' ? <Info color={COLORS.primary} size={16} /> :
                            <BookOpen color={COLORS.primary} size={16} />
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
  quickActionLabel: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
    color: COLORS.text,
  },
  
  // Sections
  section: {
    marginBottom: SECTION_GAP,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 18,
    color: COLORS.text,
    lineHeight: 25,
    marginBottom: 12,
    paddingHorizontal: PAGE_X, // Align with Page
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: 16,
    marginHorizontal: PAGE_X, // Uses 16px page padding
    padding: CARD_PAD, // 16px internal padding
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
    minHeight: 48, // Standard touch target minimum
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16, // Prevent overlap
  },
  iconContainer: {
    width: 40, 
    alignItems: 'center', // Center icon/avatar in this fixed width slot
    justifyContent: 'center',
    marginRight: ROW_GAP,
  },
  artistAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
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
