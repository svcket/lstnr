import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { ICONS } from '../constants/assets';
import { getInboxThreads, InboxThread } from '../data/inbox';
import { Pin, Bell } from 'lucide-react-native';
import { BottomNav } from '../components/home/BottomNav';
import { getDeterministicAvatar } from '../lib/avatarResolver';
import { useAuth } from '../context/AuthContext';

export const ActivityScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const threads = getInboxThreads();

  const renderItem = ({ item, index }: { item: InboxThread, index: number }) => (
    <TouchableOpacity 
        style={styles.itemContainer}
        activeOpacity={0.7}
        onPress={() => navigation.navigate(item.context.screen, item.context.params)}
    >
       <View style={styles.left}>
         {/* Avatar Logic */}
         <View style={styles.avatarContainer}>
             {item.avatar ? (
                 <Image source={{ uri: item.avatar }} style={styles.avatar} />
             ) : (
                 <Image 
                    source={item.type === 'PREDICTION' ? ICONS.learnPredictions : ICONS.activityIn} 
                    style={styles.placeholderIcon} 
                 />
             )}
         </View>
         
         <View style={styles.textContainer}>
            <View style={styles.titleRow}>
                <Text style={styles.title}>{item.title}</Text>
                {item.isPinned && <Pin size={12} color="#888" style={{ marginLeft: 4 }} />}
            </View>
            <Text style={[styles.subtitle, item.unreadCount > 0 && styles.subtitleBold]} numberOfLines={1}>
                {item.subtitle}
            </Text>
         </View>
       </View>

       <View style={styles.right}>
           <Text style={styles.date}>{item.timestamp}</Text>
           {item.unreadCount > 0 && (
               <View style={styles.unreadBadge}>
                   <Text style={styles.unreadText}>{item.unreadCount}</Text>
               </View>
           )}
       </View>
       
       {index < threads.length - 1 && <View style={styles.separator} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
          {/* Main Tab Header */}
          <View style={styles.header}>
              <Text style={styles.greeting}>Inbox</Text>
              <View style={styles.headerRight}>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('Updates')}
                    activeOpacity={0.7}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <View>
                      <Bell size={24} color="#FFF" />
                      {true && ( 
                        <View style={styles.unreadDot} />
                      )}
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.7}>
                      <View style={[styles.headerIconContainer, styles.avatarContainerHeader]}>
                        <Image 
                           source={{ uri: getDeterministicAvatar(user?.name || 'User', user?.id || 'u1') }} 
                           style={{ width: 40, height: 40, borderRadius: 12 }} 
                        />
                      </View>
                  </TouchableOpacity>
              </View>
          </View>

           <View style={{ flex: 1 }}>
              <FlatList 
                data={threads}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
           </View>

           <BottomNav activeTab="Inbox" />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  greeting: {
    fontFamily: FONT_FAMILY.balance,
    fontWeight: '600',
    fontSize: 24,
    color: COLORS.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#181818',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  avatarContainerHeader: {
    backgroundColor: '#181818',
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
  
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120, // Space for BottomNav
    paddingTop: 0,
  },

  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    position: 'relative',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  avatarContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#222',
      alignItems: 'center',
      justifyContent: 'center',
  },
  avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
  },
  placeholderIcon: {
      width: 24,
      height: 24,
      tintColor: '#666',
  },
  textContainer: {
      flex: 1,
      justifyContent: 'center',
  },
  titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 2,
  },
  title: {
    fontFamily: FONT_FAMILY.medium, // Explicit Medium
    fontSize: 16,
    color: '#FFF',
  },
  subtitle: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
    color: '#888',
  },
  subtitleBold: {
      color: '#FFF',
      fontWeight: '600',
  },
  pinIcon: {
      width: 12,
      height: 12,
      tintColor: '#888',
  },
  
  // Right
  right: {
      alignItems: 'flex-end',
      gap: 6,
  },
  date: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
    color: '#666',
  },
  unreadBadge: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
  },
  unreadText: {
      fontFamily: FONT_FAMILY.medium,
      fontSize: 10,
      color: '#000',
      fontWeight: '700',
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    left: 72, // Indent for avatar
    right: 0,
    height: 1,
    backgroundColor: '#1A1A1A',
  },
});
