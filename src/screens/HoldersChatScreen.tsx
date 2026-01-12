import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
import { getHoldersChat, addChatMessage, ChatMessage } from '../data/social';
import { Send } from 'lucide-react-native';

export const HoldersChatScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { entityId } = route.params || { entityId: 'a1' };
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    setMessages(getHoldersChat(entityId));
  }, [entityId]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const msg = addChatMessage(entityId, inputText.trim());
    setMessages([...messages, msg]);
    setInputText('');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
            <HeaderBack />
            <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Holders Chat</Text>
                <Text style={styles.headerSubtitle}>{messages.length * 52} members online</Text>
            </View>
            <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView 
           behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
           style={{ flex: 1 }}
           keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.msgRow, item.isMe ? styles.msgRowRight : styles.msgRowLeft]}>
                        {!item.isMe && (
                            <Image source={{ uri: item.user.avatar }} style={styles.msgAvatar} />
                        )}
                        <View style={[styles.msgBubble, item.isMe ? styles.msgBubbleRight : styles.msgBubbleLeft]}>
                            {!item.isMe && <Text style={styles.msgUser}>{item.user.name}</Text>}
                            <Text style={[styles.msgText, item.isMe ? styles.msgTextRight : styles.msgTextLeft]}>
                                {item.text}
                            </Text>
                            <Text style={styles.msgTime}>{new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                inverted={false} // Data is currently newest last, if using inverted list need to reverse data
                // Usually chat is NEWEST at bottom. 
                // My `getHoldersChat` reverses mock data so [Oldest ... Newest]?
                // Let's check social.ts: 
                // .map((_, i) => ... createdAt: Now - i ).reverse() -> Oldest First.
                // So standard list renders Oldest at Top. Correct.
            />

            {/* Composer */}
            <View style={styles.composerContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Message holders..."
                    placeholderTextColor="#666"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                <TouchableOpacity onPress={handleSendMessage} disabled={!inputText.trim()}>
                    <View style={[styles.sendBtn, !inputText.trim() && { opacity: 0.5 }]}>
                        <Send size={20} color="#000" />
                    </View>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
      flex: 1,
  },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerTitleContainer: {
      alignItems: 'center',
  },
  headerTitle: {
      fontFamily: FONT_FAMILY.header,
      fontWeight: '600',
      fontSize: 16,
      color: '#FFF',
  },
  headerSubtitle: {
      fontSize: 12,
      color: '#666',
  },
  listContent: {
      padding: 16,
      paddingBottom: 20,
  },
  msgRow: {
      flexDirection: 'row',
      marginBottom: 16,
      alignItems: 'flex-end',
      maxWidth: '85%',
  },
  msgRowLeft: {
      alignSelf: 'flex-start',
  },
  msgRowRight: {
      alignSelf: 'flex-end',
  },
  msgAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      marginRight: 8,
      backgroundColor: '#333',
  },
  msgBubble: {
      padding: 12,
      borderRadius: 16,
  },
  msgBubbleLeft: {
      backgroundColor: '#222',
      borderBottomLeftRadius: 4,
  },
  msgBubbleRight: {
      backgroundColor: COLORS.primary,
      borderBottomRightRadius: 4,
  },
  msgUser: {
      fontSize: 11,
      color: '#999',
      marginBottom: 4,
  },
  msgText: {
      fontSize: 15,
      lineHeight: 20,
  },
  msgTextLeft: {
      color: '#FFF',
  },
  msgTextRight: {
      color: '#000',
  },
  msgTime: {
      fontSize: 10,
      marginTop: 4,
      alignSelf: 'flex-end',
      opacity: 0.7,
      color: 'rgba(255,255,255,0.5)',
  },
  composerContainer: {
      padding: 12, // slightly more padding
      paddingBottom: Platform.OS === 'ios' ? 12 : 12, // Adjust if needed
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.06)',
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: '#000',
  },
  input: {
      flex: 1,
      backgroundColor: '#111',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      maxHeight: 100,
      color: '#FFF',
      fontSize: 15,
      marginRight: 12,
  },
  sendBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FFF',
      alignItems: 'center',
      justifyContent: 'center',
  },
});
