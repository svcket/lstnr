import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Mic2, Disc, Sparkles, Download, ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { BottomNav } from '../components/home/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { ICONS } from '../constants/assets';
// Dynamic Data
import { getPortfolio, getArtistById, getAllPredictions, getRecentActivity } from '../data/catalog';
import { getEntityMetrics } from '../lib/mockMetrics';
import { EntityRow } from '../components/common/EntityRow';

// Helpers
import { getDeterministicAvatar } from '../lib/avatarResolver';

const USER_AVATAR = require('../../assets/user_avatar.png');

// Components
import { PortfolioCard } from '../components/home/PortfolioCard';
import { HorizontalCard } from '../components/home/HorizontalCard';

// --- SPACING CONSTANTS (STRICT) ---
const PAGE_X = 16;
const SPACING_CONSTANTS = { s24: 12, s32: 24, s28: 28 };

// --- MOCK DATA ---
const MOCK_PORTFOLIO = {
  totalValue: '$12,430.55',
  dailyChange: '$612.40',
  dailyPercentage: '4.8%',
  isPositive: true,
};

// Predictions for now are from catalog (mock mapped)
const PREDICTIONS_DATA = getAllPredictions();

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
      style={{ width: 16, height: 16, tintColor: COLORS.text }}
      resizeMode="contain"
    />
  </TouchableOpacity>
);

// 2. Generic Row Item (Still used for Activity/Learn)
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
        {showChevron && (
          <Image
            source={ICONS.chevronRight}
            style={{ width: 6, height: 12, tintColor: COLORS.textSecondary }}
            resizeMode="contain"
          />
        )}
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

  // Dynamic Portfolio
  const portfolio = getPortfolio();

  const renderQuickAction = (
    iconSource: ImageSourcePropType,
    label: string,
    bgColor: string,
    iconColor: string,
    hasBorder: boolean = false,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={[
        styles.quickAction,
        {
          backgroundColor: bgColor,
          borderWidth: hasBorder ? 1 : 0,
          borderColor: hasBorder ? '#1F1F1F' : 'transparent'
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={iconSource}
        style={[styles.actionImage, { tintColor: iconColor }]}
        resizeMode="contain"
      />
      <Text style={[styles.quickActionLabel, { color: iconColor }]}>{label}</Text>
    </TouchableOpacity>
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Portfolio</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Updates')}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <View>
                <Bell size={24} color={COLORS.text} />
                {true && (
                  <View style={styles.unreadDot} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.7}>
              <View style={[styles.headerIconContainer, styles.avatarContainer]}>
                <Image
                  source={USER_AVATAR}
                  style={{ width: 40, height: 40, borderRadius: 12 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* GAP A: Header -> Portfolio (24px) */}
          <View style={{ height: SPACING_CONSTANTS.s24 }} />

          {/* Portfolio Hero */}
          <PortfolioCard
            totalValue={hasPositions ? MOCK_PORTFOLIO.totalValue : '$0.00'}
            dailyChange={hasPositions ? MOCK_PORTFOLIO.dailyChange : '0.00'}
            dailyPercentage={hasPositions ? MOCK_PORTFOLIO.dailyPercentage : '0%'}
            isPositive={true}
          />

          {/* GAP B: Portfolio -> Quick Actions (32px) */}
          <View style={{ height: SPACING_CONSTANTS.s32 }} />

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={styles.quickActionDark}
              onPress={() => navigation.navigate('Artists')}
              activeOpacity={0.7}
            >
              <View style={{ marginBottom: 8 }}>
                <Mic2 size={24} color="#FFF" />
              </View>
              <Text style={styles.quickActionLabelDark}>Artists</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionDark}
              onPress={() => navigation.navigate('Labels')}
              activeOpacity={0.7}
            >
              <View style={{ marginBottom: 8 }}>
                <Disc size={24} color="#FFF" />
              </View>
              <Text style={styles.quickActionLabelDark}>Labels</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionDark}
              onPress={() => navigation.navigate('Predictions')}
              activeOpacity={0.7}
            >
              <View style={{ marginBottom: 8 }}>
                <Image
                  source={ICONS.actionPredict}
                  style={{ width: 24, height: 24, tintColor: '#FFF' }}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.quickActionLabelDark}>Predict</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionDark}
              onPress={() => navigation.navigate('Withdraw')}
              activeOpacity={0.7}
            >
              <View style={{ marginBottom: 8 }}>
                <Download size={24} color="#FFF" />
              </View>
              <Text style={styles.quickActionLabelDark}>Withdraw</Text>
            </TouchableOpacity>
          </View>

          {/* GAP C: Quick Actions -> Sections (28px) */}
          <View style={{ height: SPACING_CONSTANTS.s28 }} />

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
                <SectionHeader
                  title="Your shares"
                  onPress={() => navigation.navigate('Shares')}
                />
                <View style={[styles.card, { paddingVertical: 0 }]}>
                  {portfolio.slice(0, 3).map((item, index) => {
                    const artist = getArtistById(item.artistId);
                    if (!artist) return null;
                    const metrics = getEntityMetrics(artist.id);

                    return (
                      <EntityRow
                        key={artist.id}
                        name={artist.name}
                        avatarUrl={artist.avatarUrl}
                        symbol={artist.symbol}
                        subtitle={`${item.shares} shares`}
                        price={formatCurrency(metrics.price)}
                        changePct={metrics.changeTodayPct}
                        isLast={index === portfolio.length - 1}
                        onPress={() => navigation.navigate('ArtistDetail', { artistId: artist.id })}
                      />
                    );
                  })}
                </View>
              </View>

              {/* Your Predictions */}
              <View style={styles.section}>
                <SectionHeader
                  title="Your predictions"
                  onPress={() => navigation.navigate('Predictions')}
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: PAGE_X }}
                >
                  {PREDICTIONS_DATA.slice(0, 2).map(pred => (
                    <HorizontalCard
                      key={pred.id}
                      title={pred.question}
                      subtitle={`Ends ${new Date(pred.deadline).toLocaleDateString()}`}
                      type="prediction"
                      onPress={() => navigation.navigate('PredictionDetail', { predictionId: pred.id })}
                    />
                  ))}
                </ScrollView>
              </View>

              {/* Recent Activity */}
              <View style={styles.section}>
                <SectionHeader
                  title="Recent activity"
                  onPress={() => navigation.navigate('History')}
                />
                <View style={styles.card}>
                  {getRecentActivity().slice(0, 5).map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('TransactionDetail', { activity: item })}
                      >
                        <RowItem
                          leftIcon={
                            <View style={[styles.feedIconContainer, { backgroundColor: item.isMoneyOut ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)' }]}>
                              {item.isMoneyOut ? (
                                <ArrowUpRight size={16} color={COLORS.error} />
                              ) : (
                                <ArrowDownLeft size={16} color={COLORS.success} />
                              )}
                            </View>
                          }
                          title={item.text}
                          subtitle={item.time}
                          rightTop={item.amount}
                          hasDivider={index < 4}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </>
          )}

          {/* Learn */}
          <View style={styles.section}>
            <SectionHeader title="Learn" />
            <Text style={styles.learnSubtitle}>
              Understand how LSTNR works before you make your first move.
            </Text>
            <View style={styles.card}>
              {MOCK_LEARN.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => navigation.navigate('LearnDetail', { id: item.id })}
                  activeOpacity={0.7}
                >
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

                    hasDivider={index < MOCK_LEARN.length - 1}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Footer Disclaimer */}
            <Text style={styles.footerText}>
              LSTNR markets reflect community sentiment and publicly verifiable outcomes. Past performance does not guarantee future results.
            </Text>
          </View>

        </ScrollView>

        <BottomNav activeTab="Wallet" />
      </SafeAreaView>
    </View>
  );
};


// --- PIXEL PERFECT STYLES ---
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PAGE_X,
    paddingTop: 16,
    paddingBottom: 0,
  },
  greeting: {
    fontFamily: FONT_FAMILY.balance, // Bold
    fontWeight: '600', // Matches Explore greeting weight
    fontSize: 24,
    color: COLORS.text,
    letterSpacing: 0,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // Increased spacing as requested
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.surface, // Updated from #181818
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  avatarContainer: {
    backgroundColor: COLORS.surface, // Updated from #181818
    borderColor: '#333',
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },

  scrollContent: {
    paddingBottom: 120, // BottomNav space
  },

  // Quick Actions
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: PAGE_X,
    gap: 12,
  },
  quickActionDark: {
    flex: 1, // Fill available width
    aspectRatio: 1, // Keep square
    backgroundColor: COLORS.surface, // Updated from #151515
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 12, // Ensure vertical padding
  },
  quickActionLabelDark: {
    fontFamily: FONT_FAMILY.medium,
    fontWeight: '600',
    fontSize: 12, // Slightly smaller to fit if needed, or 13
    color: '#FFF',
    letterSpacing: 0,
    marginTop: 4,
  },
  // Deprecated Styles (Left for safety or remove if unused)
  quickAction: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    // @ts-ignore
    cornerCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  actionImage: {
    width: 28,
    height: 28,
    marginTop: 4,
  },
  quickActionLabel: {
    fontFamily: FONT_FAMILY.balance, // Bold
    fontWeight: '700', // Explicit Bold
    fontSize: 13,
    textAlign: 'center',
    letterSpacing: 0,
  },

  // Sections
  section: {
    marginBottom: 32, // Section spacing
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: PAGE_X,
    marginBottom: 16, // Header -> Content
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.medium, // Explicit Medium
    fontSize: 22,
    lineHeight: 30.8,
    color: COLORS.text,
    letterSpacing: 0,
  },
  card: {
    backgroundColor: COLORS.surface, // Updated from #111111
    borderRadius: 16,
    marginHorizontal: PAGE_X,
    padding: 16,
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
    marginRight: 12,
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
    borderRadius: 8,
  },
  // Feed Icons
  feedIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStack: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    fontFamily: FONT_FAMILY.medium, // Explicit Medium
    fontSize: 15, // Reduced from 16px
    color: COLORS.text,
    letterSpacing: 0,
  },
  rowSubtitle: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    letterSpacing: 0,
  },

  // Right side
  rowRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rowValue: {
    fontFamily: FONT_FAMILY.balance, // Bold
    fontWeight: '700', // Explicit Bold
    fontSize: 16,
    color: COLORS.text,
    letterSpacing: 0,
  },
  rowChange: {
    fontFamily: FONT_FAMILY.header, // Medium
    fontSize: 13,
    letterSpacing: 0,
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
    backgroundColor: COLORS.surface, // Updated from #111111
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: FONT_FAMILY.header, // Medium
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0,
  },
  emptySubtitle: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  exploreButtonText: {
    fontFamily: FONT_FAMILY.header, // Medium
    color: '#000',
    fontSize: 16,
    letterSpacing: 0,
  },
  learnSubtitle: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
    color: COLORS.text,
    paddingHorizontal: PAGE_X,
    marginBottom: 16,
    marginTop: -8, // Pull closer to header
  },
  footerText: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
    color: '#9A9A9A',
    lineHeight: 18,
    paddingHorizontal: PAGE_X,
    marginTop: 16,
    marginBottom: 40,
  },
});
