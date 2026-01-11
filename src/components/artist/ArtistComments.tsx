import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Platform, Keyboard, LayoutAnimation, UIManager } from 'react-native';
import { MoreVertical, Heart, CornerDownRight, ChevronDown, ChevronUp } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 1) Updated Data Structure
type Comment = {
  id: string;
  user: { name: string; avatar?: string };
  createdAt: string; 
  symbol?: string; // If present, used for display. If missing/flagged, non-holder.
  isHolder: boolean; 
  text: string;
  likes: number; 
  liked?: boolean;
  replies?: Comment[];
};

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    user: { name: 'Obongjayar', avatar: 'https://i.pravatar.cc/150?u=obong' },
    createdAt: '3mins',
    symbol: '$BIGT',
    isHolder: true,
    text: 'If you wanna waste time, you should just walk out the way you came',
    likes: 1300,
    liked: false,
    replies: [
        {
            id: 'c1_r1',
            user: { name: 'Sarah J', avatar: 'https://i.pravatar.cc/150?u=sarah' },
            createdAt: '1min',
            symbol: '$BIGT',
            isHolder: true,
            text: 'Exactly! 💯',
            likes: 5,
            replies: [
                 {
                    id: 'c1_r1_sr1',
                    user: { name: 'Obongjayar', avatar: 'https://i.pravatar.cc/150?u=obong' },
                    createdAt: 'Just now',
                    isHolder: true,
                    symbol: '$BIGT',
                    text: 'Thanks for the support!',
                    likes: 1,
                    replies: []
                 }
            ]
        },
        {
            id: 'c1_r2',
            user: { name: 'Newbie', avatar: 'https://i.pravatar.cc/150?u=new' },
            createdAt: '2mins',
            isHolder: false, // Non-holder example
            text: 'Is this a good entry point?',
            likes: 0,
            replies: []
        }
    ]
  },
  {
    id: 'c2',
    user: { name: 'CryptoKing', avatar: 'https://i.pravatar.cc/150?u=king' },
    createdAt: '15mins',
    symbol: '$BIGT',
    isHolder: true,
    text: 'Bullish divergence on the 15m chart. LFG! 🚀',
    likes: 450,
    liked: true,
    replies: []
  },
  {
    id: 'c3',
    user: { name: 'BearishBob', avatar: 'https://i.pravatar.cc/150?u=bob' },
    createdAt: '1h',
    isHolder: false,
    text: 'Waiting for a dip...',
    likes: 12,
    replies: []
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
      isHolder: true,
      text: inputText,
      likes: 0,
      replies: [],
    };
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
      {/* Composer */}
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

      {/* Comments List */}
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
             <CommentItem 
                key={comment.id} 
                comment={comment} 
                isLast={index === comments.length - 1} 
                depth={0}
             />
           ))}
        </View>
      )}
    </View>
  );
};

const formatLikes = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
};

const CommentItem = ({ comment, isLast, depth }: { comment: Comment; isLast: boolean; depth: number }) => {
  const [repliesExpanded, setRepliesExpanded] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [liked, setLiked] = useState(comment.liked || false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [replyText, setReplyText] = useState('');

  const toggleLike = () => {
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const toggleReplyInput = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsReplying(!isReplying);
  };

  const toggleRepliesView = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setRepliesExpanded(!repliesExpanded);
  };

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <View style={[
        styles.row, 
        !isLast && depth === 0 && styles.rowBorder,
        { marginLeft: depth * 16 } // Indentation for nested replies
    ]}>
      {/* Avatar */}
      <Image source={{ uri: comment.user.avatar }} style={[styles.avatar, { width: depth > 0 ? 24 : 32, height: depth > 0 ? 24 : 32 }]} />
      
      <View style={styles.body}>
         {/* Header */}
         <View style={styles.headerRow}>
            <Text style={styles.username}>{comment.user.name}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.timestamp}>{comment.createdAt}</Text>
         </View>
         
         {/* Token Pill (Holders Only) */}
         {comment.isHolder && comment.symbol && (
             <View style={styles.chipRow}>
                <View style={styles.tokenChip}>
                   <Text style={styles.chipText}>{comment.symbol}</Text>
                </View>
             </View>
         )}
         
         {/* Text */}
         <Text style={styles.commentText}>{comment.text}</Text>
         
         {/* Actions */}
         <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={toggleLike}>
               <Heart size={16} color={liked ? "#EF4444" : "#666"} fill={liked ? "#EF4444" : "transparent"} />
               <Text style={[styles.actionCount, liked && { color: "#EF4444" }]}>{formatLikes(likeCount)}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionBtn} onPress={toggleReplyInput}>
               <CornerDownRight size={16} color="#666" />
               <Text style={styles.actionLabel}>Reply</Text>
            </TouchableOpacity>
         </View>

         {/* Inline Reply Input */}
         {isReplying && (
             <View style={styles.inlineComposer}>
                 <TextInput
                    style={styles.replyInput}
                    placeholder="Write a reply..."
                    placeholderTextColor="#666"
                    value={replyText}
                    onChangeText={setReplyText}
                    autoFocus
                    multiline
                 />
                 <View style={styles.inlineActions}>
                    <TouchableOpacity onPress={toggleReplyInput}>
                        <Text style={styles.replyCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.replyPostBtn, !replyText.trim() && { opacity: 0.5, backgroundColor: '#333' }]}
                        disabled={!replyText.trim()}
                    >
                        <Text style={[styles.replyPostText, !replyText.trim() && { color: '#666' }]}>Post</Text>
                    </TouchableOpacity>
                 </View>
             </View>
         )}

         {/* View/Hide Replies Toggle */}
         {hasReplies && (
            <TouchableOpacity 
               style={styles.repliesToggle} 
               onPress={toggleRepliesView}
            >
               <Text style={styles.repliesText}>
                  {repliesExpanded ? 'Hide' : 'View'} {comment.replies?.length} replies
               </Text>
               {repliesExpanded ? (
                 <ChevronUp size={14} color="#666" /> 
               ) : (
                 <ChevronDown size={14} color="#666" />
               )}
            </TouchableOpacity>
         )}

         {/* Render Nested Replies */}
         {repliesExpanded && hasReplies && (
             <View style={styles.nestedContainer}>
                 {comment.replies!.map((reply, idx) => (
                     <CommentItem 
                        key={reply.id} 
                        comment={reply} 
                        isLast={idx === comment.replies!.length - 1}
                        depth={depth + 1}
                     />
                 ))}
             </View>
         )}
      </View>
      
      {/* Menu - Only top level */}
      {depth === 0 && (
          <TouchableOpacity style={styles.menuBtn}>
             <MoreVertical size={16} color="#666" />
          </TouchableOpacity>
      )}
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
  },
  input: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.body,
    fontSize: 15,
    maxHeight: 100,
  },
  inputFocused: {
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
    color: '#FFF', 
    fontFamily: FONT_FAMILY.header,
    fontSize: 14,
  },
  postButton: {
    backgroundColor: '#FFF', 
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  postButtonDisabled: {
    backgroundColor: '#333',
  },
  postText: {
    color: '#000', 
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
  listContainer: {},
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
    marginBottom: 4,
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
    marginBottom: 8, 
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionCount: {
    color: '#999',
    fontSize: 14, 
    fontFamily: FONT_FAMILY.header,
  },
  actionLabel: {
    color: '#999',
    fontSize: 14, 
    fontFamily: FONT_FAMILY.header,
  },

  // Replies
  repliesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  repliesText: {
    color: '#666',
    fontSize: 12,
    fontFamily: FONT_FAMILY.header,
  },
  nestedContainer: {
      marginTop: 16,
  },
  
  // Inline Composer
  inlineComposer: {
      marginTop: 8,
      marginBottom: 16,
  },
  replyInput: {
      minHeight: 48,
      backgroundColor: '#111',
      borderRadius: 12, // Cornered
      padding: 16, // Uniform padding (Top/Left/Right/Bottom)
      paddingTop: 16, // Explicit equality
      color: '#FFF',
      fontFamily: FONT_FAMILY.body,
      fontSize: 14,
      borderWidth: 1,
      borderColor: '#333',
      marginBottom: 8,
      textAlignVertical: 'top', 
  },
  inlineActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 12,
  },
  replyCancelText: {
      color: '#FFF',
      fontFamily: FONT_FAMILY.header,
      fontSize: 13,
  },
  replyPostBtn: {
      backgroundColor: '#FFF',
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 16,
  },
  replyPostText: {
      color: '#000',
      fontFamily: FONT_FAMILY.header,
      fontSize: 13,
  },
  
  // Menu
  menuBtn: {
    padding: 4,
  },
});
