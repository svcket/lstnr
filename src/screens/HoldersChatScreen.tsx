import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { getHoldersChat, addChatMessage, ChatMessage } from '../data/social';
import { X, Users, ArrowLeft, Send } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getArtistById } from '../data/catalog';
import { getEntityMetrics } from '../lib/mockMetrics';
import { TradeSheet } from '../components/artist/TradeSheet';
import { getDeterministicAvatar } from '../lib/avatarResolver';

export const HoldersChatScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { entityId, type = 'ARTIST' } = route.params || { entityId: 'a1' };
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [entity, setEntity] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [tradeSheetMode, setTradeSheetMode] = useState<'BUY' | 'SELL' | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  
  // Input State
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = React.useRef<TextInput>(null);

  const handleSend = () => {
      if (!inputText.trim()) return;
      // Mock send
      setMessages([...messages, {
          id: Date.now().toString(),
          text: inputText.trim(),
          user: {
              id: 'me',
              name: 'You',
              avatar: 'https://i.pravatar.cc/150?u=me'
          },
          createdAt: 'Just now',
          type: 'TEXT'
      }]);
      setInputText('');
  };

  useEffect(() => {
    // Determine entity details (Mock: Assuming Artist for now, or adapt based on type)
    if (type === 'ARTIST') {
        const artist = getArtistById(entityId);
        setEntity(artist);
        setMetrics(getEntityMetrics(entityId));
    } else if (type === 'LABEL') {
        const label = require('../data/catalog').getLabelById(entityId);
        setEntity(label);
        setMetrics(getEntityMetrics(entityId)); // Mock metrics work for any ID string usually
    } else if (type === 'PREDICTION') {
        const pred = require('../data/catalog').getPredictionById(entityId);
        setEntity({ ...pred, name: pred?.question, symbol: 'PRED' }); // Adapt for header
        setMetrics(getEntityMetrics(entityId));
    }
    setMessages(getHoldersChat(entityId));
  }, [entityId, type]);

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    // 1. ACTION MESSAGE (Buy/Sell Pill)
    if (item.type === 'ACTION') {
        const isBuy = item.actionType === 'BUY';
        const actionColor = isBuy ? '#00FF9D' : '#FF4B4B'; // Green vs Red/Orange
        
        return (
            <View style={styles.actionRow}>
                 <View style={styles.actionPill}>
                    <Image source={{ uri: item.user.avatar }} style={styles.actionAvatar} />
                    <Text style={styles.actionText}>
                        <Text style={{ color: actionColor, fontWeight: '700' }}>@{item.user.name}</Text>
                        <Text style={{ color: actionColor }}> {item.text}</Text>
                    </Text>
                 </View>
            </View>
        );
    }

    // 2. STANDARD TEXT MESSAGE
    return (
        <View style={styles.msgRow}>
            <Image source={{ uri: item.user.avatar }} style={styles.msgAvatar} />
            <View style={styles.msgContent}>
                {/* Name Header */}
                <Text style={styles.msgUser}>@{item.user.name}</Text>
                
                {/* Text Bubble - Transparent/None background, just text? 
                    Screenshot shows just text under name for generic messages? 
                    Actually screenshot shows:
                    "@test1234... \n This has very high chances..."
                    It looks like raw text, no bubble background for user messages?
                    Or maybe a very subtle dark card.
                    I will use a clean look: Name (Header), Text (Body). No Bubble color, or very subtle.
                */}
                <Text style={styles.msgText}>{item.text}</Text>
            </View>
             {/* Timestamp (Optional, maybe implied or on side) */}
        </View>
    );
  };

  const handleHeaderPress = () => {
      if (type === 'ARTIST') {
          (navigation as any).navigate('ArtistDetail', { artistId: entityId });
      } else if (type === 'PREDICTION') {
          (navigation as any).navigate('PredictionDetail', { predictionId: entityId });
      } else if (type === 'LABEL') {
          (navigation as any).navigate('LabelDetail', { labelId: entityId });
      }
  };

  const activePeopleCount = Math.max(2, Math.floor(messages.length / 3));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        {/* Custom Header */}
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 8 }}>
                    <ArrowLeft size={24} color="#FFF" />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={handleHeaderPress} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Image 
                        source={{ uri: entity?.avatarUrl || getDeterministicAvatar(entity?.name || 'Stock', entityId) }} 
                        style={styles.headerAvatar} 
                    />
                    <View>
                        <Text style={styles.headerTitle}>{entity?.symbol || 'SYMBOL'}</Text>
                        <View style={styles.memberRow}>
                            <Users size={12} color="#888" />
                            <Text style={styles.memberCount}>{activePeopleCount} people chatting</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.headerRight}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>${metrics?.price?.toFixed(2) || '0.00'}</Text>
                    <Text style={[styles.changeText, { color: (metrics?.changeTodayPct || 0) >= 0 ? '#4ADE80' : '#F87171' }]}>
                        {metrics?.changeTodayPct ? metrics.changeTodayPct.toFixed(2) + '%' : '0.00%'}
                    </Text>
                </View>
            </View>
        </View>

        <KeyboardAvoidingView 
           behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
           style={{ flex: 1 }}
        >
            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.listContent}
            />

            {/* Footer */}
            <View style={styles.footer}>
                {/* Gradient Buy CTA - Only show if NO Access */}
                {!hasAccess && (
                    <TouchableOpacity 
                        activeOpacity={0.8} 
                        style={styles.buyButtonWrapper}
                        onPress={() => setTradeSheetMode('BUY')}
                    >
                        <LinearGradient
                            colors={COLORS.primaryGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.buyButton}
                        >
                            <Text style={styles.buyButtonText}>Buy ${entity?.symbol || 'STOCK'} to Chat</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {/* Input Area */}
                <View style={[styles.inputContainer, !hasAccess && { opacity: 0.5 }, isFocused && styles.inputFocusedContainer]}>
                     <TextInput
                        ref={inputRef}
                        style={styles.input}
                        placeholder={hasAccess ? "Message..." : "You can't send messages"}
                        placeholderTextColor="#666"
                        editable={hasAccess} 
                        value={inputText}
                        onChangeText={setInputText}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                     />
                     
                     {hasAccess && (inputText.length > 0 || isFocused) && (
                         <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
                             <Send size={20} color={inputText.length > 0 ? "#FFF" : "#666"} />
                         </TouchableOpacity>
                     )}
                </View>
            </View>

            {/* Trade Sheet Overlay */}
            <TradeSheet 
                visible={!!tradeSheetMode}
                mode={tradeSheetMode || 'BUY'}
                artistName={entity?.name || ''}
                ticker={entity?.symbol || ''}
                sharePrice={metrics?.price || 0}
                mcs={metrics?.marketConfidenceScore?.value}
                avatarUrl={entity?.avatarUrl}
                onClose={() => setTradeSheetMode(null)}
                onConfirm={() => {
                    setTradeSheetMode(null);
                    setHasAccess(true);
                }}
            />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505', // Very dark bg
  },
  safeArea: {
      flex: 1,
  },
  // Header
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  headerAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#222',
  },
  headerTitle: {
      fontFamily: FONT_FAMILY.medium,
      fontSize: 18,
      color: '#FFF',
      fontWeight: '600',
  },
  memberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 2,
  },
  memberCount: {
      fontFamily: FONT_FAMILY.body,
      fontSize: 12,
      color: '#888',
  },
  headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
  },
  priceContainer: {
      alignItems: 'flex-end',
  },
  priceText: {
      fontFamily: FONT_FAMILY.mono,
      fontSize: 14,
      color: '#FFF',
      fontWeight: '600',
  },
  changeText: {
      fontFamily: FONT_FAMILY.mono,
      fontSize: 12,
  },
  closeBtn: {
      padding: 4,
  },

  // List
  listContent: {
      padding: 16,
      paddingBottom: 20,
  },
  
  // Messages
  msgRow: {
      flexDirection: 'row',
      marginBottom: 20, // Spacious
      alignItems: 'flex-start',
  },
  msgAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 10,
      backgroundColor: '#333',
  },
  msgContent: {
      flex: 1,
  },
  msgUser: {
      fontSize: 14,
      color: '#FFF',
      fontWeight: '700',
      marginBottom: 4,
  },
  msgText: {
      fontSize: 15,
      color: '#CCC',
      lineHeight: 22,
  },

  // Actions
  actionRow: {
      marginBottom: 16,
      width: '100%',
  },
  actionPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#111', // Dark pill
      borderRadius: 12, // Rounded corners
      paddingVertical: 10,
      paddingHorizontal: 12,
      width: '100%', // Full Width
  },
  actionAvatar: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: 8,
  },
  actionText: {
      fontSize: 14,
      fontFamily: FONT_FAMILY.body,
  },

  // Footer
  footer: {
      padding: 16,
      backgroundColor: '#050505',
  },
  buyButtonWrapper: {
      marginBottom: 16,
  },
  buyButton: {
      height: 50,
      borderRadius: 25, // Pill shape
      alignItems: 'center',
      justifyContent: 'center',
  },
  buyButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '700',
      fontFamily: FONT_FAMILY.medium,
  },
  inputContainer: {
      height: 50,
      backgroundColor: '#111',
      borderRadius: 25, // Pill shape
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'transparent',
  },
  inputFocusedContainer: {
      borderColor: '#333',
      backgroundColor: '#000',
  },
  input: {
      flex: 1,
      color: '#FFF',
      fontSize: 15,
      padding: 0, 
      height: '100%',
  },
  sendBtn: {
      marginLeft: 12,
  },
});
