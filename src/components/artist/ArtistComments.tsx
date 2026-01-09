import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Platform, Keyboard } from 'react-native';
import { MoreVertical, Heart, MessageCircle, CornerDownRight, ChevronDown, ChevronUp } from 'lucide-react-native';
import { COLORS, FONT_FAMILY, SPACING, BORDER_RADIUS } from '../../constants/theme';

// 3) Data + state (local mock)
type Comment = {
  id: string;
  user: { name: string; avatar?: string };
  createdAt: string; // “3mins”
  symbol: string; // “$BIGT”
  stance?: "yes" | "no";
  text: string;
  likes: string; // User requested "1.3k" string format in UI
  repliesCount?: number;
};

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    user: { name: 'Obongjayar', avatar: 'https://i.pravatar.cc/150?u=obong' },
    createdAt: '3mins',
    symbol: '$BIGT',
    stance: 'yes',
    text: 'If you wanna waste time, you should just walk out the way you came',
    likes: '1.3k',
    repliesCount: 7,
  },
  {
    id: 'c2',
    user: { name: 'Obongjayar', avatar: 'https://i.pravatar.cc/150?u=obong2' },
    createdAt: '3mins',
    symbol: '$BIGT',
    stance: 'no',
    text: 'If you wanna waste time, you should just walk out the way you came',
    likes: '1.3k',
    repliesCount: 2,
  },
  {
    id: 'c3',
    user: { name: 'Obongjayar', avatar: 'https://i.pravatar.cc/150?u=obong3' },
    createdAt: '3mins',
    symbol: '$BIGT', // No stance
    text: 'If you wanna waste time, you should just walk out the way you came',
    likes: '1.3k',
    repliesCount: 0,
  }
];

export const ArtistComments = () => {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS); 
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handlePost = () => {
    if (!inputText.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      user: { name: 'You', avatar: 'https://i.pravatar.cc/150?u=you' },
      createdAt: 'Just now',
      symbol: '$BIGT',
      stance: 'yes', 
      text: inputText,
      likes: '0',
      repliesCount: 0,
    };
    
    setComments([newComment, ...comments]);
    setInputText('');
    Keyboard.dismiss();
    setIsFocused(false);
  };

  const handleCancel = () => {
    setInputText('');
    Keyboard.dismiss();
    setIsFocused(false);
  };

  return (
    <View style={styles.container}>
      {/* 2) Comment Composer */}
      <View style={styles.composerContainer}>
         <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
            <TextInput 
              style={[styles.input, isFocused && styles.inputFocused]}
              placeholder="Comment on $BIGT"
              placeholderTextColor={isFocused ? "#999" : "#666"}
              value={inputText}
              onChangeText={setInputText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => !inputText && setIsFocused(false)} 
              multiline
            />
         </View>
         
         {/* Action Row (Visible when focused or has text) */}
         {isFocused && (
           <View style={styles.actionRow}>
              <TouchableOpacity onPress={handleCancel}>
                 <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.postButton, !inputText.trim() && styles.postButtonDisabled]}
                disabled={!inputText.trim()}
                onPress={handlePost}
              >
                 <Text style={[styles.postText, !inputText.trim() && styles.postTextDisabled]}>Post</Text>
              </TouchableOpacity>
           </View>
         )}
      </View>

      {/* 1) Comments List or Empty State */}
      {comments.length === 0 ? (
        <View style={styles.emptyContainer}>
           <View style={styles.mascotPlaceholder}>
              <Text style={{fontSize: 40}}>👻</Text> 
           </View>
           <Text style={styles.emptyText}>No comments available</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
           {comments.map((comment, index) => (
             <CommentItem key={comment.id} comment={comment} isLast={index === comments.length - 1} />
           ))}
        </View>
      )}
    </View>
  );
};

const CommentItem = ({ comment, isLast }: { comment: Comment; isLast: boolean }) => {
  const [repliesExpanded, setRepliesExpanded] = useState(false);

  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      {/* Left Avatar */}
      <Image source={{ uri: comment.user.avatar }} style={styles.avatar} />
      
      {/* Body */}
      <View style={styles.body}>
         {/* Header Row */}
         <View style={styles.headerRow}>
            <Text style={styles.username}>{comment.user.name}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.timestamp}>{comment.createdAt}</Text>
         </View>
         
         {/* Chip Row - Stance removed */}
         <View style={styles.chipRow}>
            <View style={styles.tokenChip}>
               <Text style={styles.chipText}>{comment.symbol}</Text>
            </View>
            {/* Stance removed for now as per request */}
         </View>
         
         {/* Comment Text */}
         <Text style={styles.commentText}>{comment.text}</Text>
         
         {/* Actions Row - Upscaled */}
         <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn}>
               <Heart size={16} color="#666" />
               <Text style={styles.actionCount}>{comment.likes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionBtn}>
               <CornerDownRight size={16} color="#666" />
               <Text style={styles.actionLabel}>Reply</Text>
            </TouchableOpacity>
         </View>

         {/* Replies Link */}
         {comment.repliesCount && comment.repliesCount > 0 ? (
            <TouchableOpacity 
               style={styles.repliesRow} 
               onPress={() => setRepliesExpanded(!repliesExpanded)}
            >
               <View style={styles.repliesLine} />
               <Text style={styles.repliesText}>
                  {repliesExpanded ? 'Hide' : 'View'} {comment.repliesCount} replies
               </Text>
               {repliesExpanded ? (
                 <ChevronUp size={14} color="#666" /> 
               ) : (
                 <ChevronDown size={14} color="#666" />
               )}
            </TouchableOpacity>
         ) : null}
      </View>
      
      {/* Right Menu */}
      <TouchableOpacity style={styles.menuBtn}>
         <MoreVertical size={16} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  
  // Composer
  composerContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    backgroundColor: '#181818',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  inputWrapperFocused: {
    borderColor: '#FFF',
    // Background remains default (transparent/dark)
  },
  input: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.body,
    fontSize: 15,
    maxHeight: 100,
  },
  inputFocused: {
    // Text color remains white (inherited from input) or explicitly set if needed, but 'color: #000' was the issue.
    // User wants text inside to be white.
    color: '#FFF',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
    gap: 16,
  },
  cancelText: {
    color: '#FFF', // White as requested
    fontFamily: FONT_FAMILY.header,
    fontSize: 14,
  },
  postButton: {
    backgroundColor: '#FFF', // White active state
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  postButtonDisabled: {
    backgroundColor: '#333',
  },
  postText: {
    color: '#000', // Black text on white button
    fontFamily: FONT_FAMILY.header,
    fontSize: 14,
  },
  postTextDisabled: {
    color: '#666',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  mascotPlaceholder: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    color: '#666',
    fontFamily: FONT_FAMILY.body,
    fontSize: 15,
  },

  // List
  listContainer: {
    
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 16,
    marginBottom: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: '#333',
  },
  body: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  username: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.header,
    fontSize: 14,
    marginRight: 6,
  },
  dot: {
    color: '#666',
    fontSize: 12,
    marginRight: 6,
  },
  timestamp: {
    color: '#666',
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
  },
  
  // Chips
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  tokenChip: {
    backgroundColor: '#181818',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  chipText: {
    color: '#999',
    fontSize: 11,
    fontFamily: FONT_FAMILY.header,
  },
  
  // Content
  commentText: {
    color: '#EEE',
    fontFamily: FONT_FAMILY.body,
    fontSize: 15, 
    lineHeight: 22, 
    marginBottom: 12,
  },
  
  // Actions
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionCount: {
    color: '#999',
    fontSize: 14, // Increased from 12
    fontFamily: FONT_FAMILY.header,
  },
  actionLabel: {
    color: '#999',
    fontSize: 14, // Increased from 12
    fontFamily: FONT_FAMILY.header,
  },
  
  // Replies
  repliesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  repliesLine: {
    width: 20,
    height: 1,
    backgroundColor: '#333',
  },
  repliesText: {
    color: '#666',
    fontSize: 12,
    fontFamily: FONT_FAMILY.header,
  },
  
  // Menu
  menuBtn: {
    padding: 4,
  },
});
