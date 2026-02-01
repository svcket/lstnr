import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Platform, Keyboard, LayoutAnimation, UIManager } from 'react-native';
import { MoreVertical, Heart, CornerDownRight, ChevronDown, ChevronUp, Send, MessageSquare, Reply } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { getComments, addComment, addReply, Comment } from '../../data/social';
import { getAccess } from '../../lib/permissions';
import { getArtistById, getLabelById, getPredictionById } from '../../data/catalog';
import { useToast } from '../../context/ToastContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ArtistCommentsProps {
    entityId?: string; // Optional only to not break if used somewhere else, but ideally required
}

export const ArtistComments = ({ entityId = 'global' }: ArtistCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]); 
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = React.useRef<TextInput>(null);
  const { showToast } = useToast();

  const access = getAccess('me', entityId);
  const { canWrite, requiredWrite, isHolder, type } = access;

  // Resolve dynamic symbol and label
  let symbol = '$UNIT';
  let requirementLabel = `${requiredWrite} shares`;

  if (type === 'PREDICTION') {
      const pred = getPredictionById(entityId);
      if (pred?.relatedEntityId) {
          const artist = getArtistById(pred.relatedEntityId);
          symbol = artist?.symbol || '$UNIT';
      } else {
          symbol = 'Market';
      }
      requirementLabel = `$${requiredWrite} stake`;
  } else {
      const entity = getArtistById(entityId) || getLabelById(entityId);
      symbol = entity?.symbol || '$UNIT';
      requirementLabel = `${requiredWrite} shares`;
  }

  useEffect(() => {
      setComments(getComments(entityId));
  }, [entityId]);

  const handlePost = () => {
    if (!inputText.trim() || !canWrite) return;
    
    // Add to store
    const newComment = addComment(entityId, inputText.trim(), isHolder);
    
    // Update UI
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setComments([newComment, ...comments]);
    setInputText('');
    Keyboard.dismiss();
    setIsFocused(false);
    showToast('Comment posted!', 'success');
  };

  const handleCancel = () => {
    setInputText('');
    Keyboard.dismiss();
    setIsFocused(false);
  };

  return (
    <View style={styles.container}>
      {/* Composer - Top as requested */}
      <View style={styles.composerContainer}>
          <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused, !canWrite && styles.inputWrapperDisabled]}>
             <TextInput 
               ref={inputRef}
               style={[styles.input, isFocused && styles.inputFocused, !canWrite && styles.inputDisabled]}
               placeholder={canWrite ? `Comment on ${symbol}` : `Hold ${requirementLabel} to comment`}
               placeholderTextColor="#999"
               value={inputText}
               onChangeText={setInputText}
               onFocus={() => canWrite && setIsFocused(true)}
               onBlur={() => !inputText && setIsFocused(false)} 
               editable={canWrite}
               multiline
             />
          </View>
          {isFocused && (
              <View style={styles.composerActions}>
                  <TouchableOpacity onPress={handleCancel}>
                      <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={handlePost} 
                    disabled={!inputText.trim()}
                    style={[styles.postBtn, !inputText.trim() && styles.postBtnDisabled]}
                  >
                      <Text style={[styles.postText, !inputText.trim() && styles.postTextDisabled]}>Post</Text>
                  </TouchableOpacity>
              </View>
          )}
      </View>

      {/* Comments List */}
      <View style={styles.listContainer}>
          {comments.map((comment, index) => (
             <CommentItem 
                key={comment.id} 
                comment={comment} 
                entityId={entityId}
                isLast={index === comments.length - 1} 
                onReply={() => setComments([...getComments(entityId)])}
                onLike={() => {
                    const updated = comments.map(c => c.id === comment.id ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c);
                    setComments(updated);
                }}
             />
          ))}
          {comments.length === 0 && (
             <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
             </View>
          )}
      </View>
    </View>
  );
};

const formatLikes = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
};

const LikeCount = ({ likes, liked, onLike }: { likes: number; liked?: boolean; onLike?: () => void }) => (
    <TouchableOpacity onPress={onLike} style={styles.actionBtn}>
        <Heart size={16} color={liked ? '#ef4444' : '#999'} fill={liked ? '#ef4444' : 'none'} />
        <Text style={styles.actionCount}>{formatLikes(likes)}</Text>
    </TouchableOpacity>
);

const getBadgesForComment = (comment: Comment) => {
    const badges: { text: string; color: 'green' | 'red' | 'gray'; type?: 'symbol' | 'outcome' }[] = [];

    // ARTIST / LABEL
    if (comment.contextType === 'ARTIST' || comment.contextType === 'LABEL') {
         badges.push({ text: comment.symbol, color: 'gray', type: 'symbol' });
         return badges;
    }

    // PREDICTION
    if (comment.contextType === 'PREDICTION' && comment.predictionMeta) {
        const { marketType, pickedOutcomeLabel, pickedSide } = comment.predictionMeta;
        
        badges.push({ text: comment.symbol, color: 'gray', type: 'symbol' });

        if (marketType === 'binary') {
            if (pickedSide) {
                badges.push({ 
                    text: pickedSide === 'YES' ? 'Yes' : 'No', 
                    color: pickedSide === 'YES' ? 'green' : 'red',
                    type: 'outcome'
                });
            }
        } else if (marketType === 'multi-range') {
             if (pickedOutcomeLabel) {
                 return [
                     { text: pickedOutcomeLabel, color: 'gray', type: 'outcome' },
                     { text: comment.symbol, color: 'gray', type: 'symbol' }
                 ];
             } else {
                 return [{ text: comment.symbol, color: 'gray', type: 'symbol' }];
             }
        }
    }
    
    return badges;
};

const CommentItem = ({ comment, entityId, isLast, onLike, onReply }: { comment: Comment; entityId: string; isLast: boolean; onLike: () => void; onReply: () => void }) => {
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const { showToast } = useToast();
  
  const handleInlineReply = (text: string) => {
      const newReply = addReply(entityId, comment.id, text);
      if (newReply) {
          setIsReplying(false);
          setRepliesOpen(true);
          onReply();
          showToast('Reply posted!', 'success');
      }
  };

  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <Image source={{ uri: comment.user.avatar }} style={styles.avatar} />
      
      <View style={styles.body}>
         <View style={styles.headerRow}>
            <Text style={styles.username}>{comment.user.name}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.timestamp}>{comment.createdAt}</Text>
            <View style={{flex: 1}} />
            <TouchableOpacity hitSlop={8}>
                <MoreVertical size={16} color="#666" />
            </TouchableOpacity>
         </View>
         
         <View style={styles.badgesRow}>
             {getBadgesForComment(comment).map((badge, idx) => (
                 <View key={idx} style={[styles.badge, { backgroundColor: badge.color === 'green' ? '#064e3b' : badge.color === 'red' ? '#7f1d1d' : '#27272a' }]}>
                     <Text style={[styles.badgeText, { color: badge.color === 'green' ? '#4ade80' : badge.color === 'red' ? '#f87171' : '#a1a1aa' }]}>{badge.text}</Text>
                 </View>
             ))}
         </View>
         
         <Text style={styles.commentText}>{comment.text}</Text>
         
         <View style={styles.actionsRow}>
            <LikeCount likes={comment.likes} liked={comment.liked} onLike={onLike} />

            <TouchableOpacity style={styles.actionBtn} onPress={() => setIsReplying(!isReplying)}>
                <Reply size={16} color="#999" />
                <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>
         </View>

         {isReplying && (
             <View style={{ marginTop: 12 }}>
                 <InlineComposer 
                    placeholder={`Reply to ${comment.user.name}...`}
                    onCancel={() => setIsReplying(false)}
                    onPost={handleInlineReply}
                 />
             </View>
         )}

         {comment.repliesCount && comment.repliesCount > 0 ? (
             <View>
                 <TouchableOpacity 
                    style={styles.viewRepliesBtn}
                    onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setRepliesOpen(!repliesOpen);
                    }}
                 >
                     {repliesOpen ? <ChevronUp size={14} color="#666" /> : <ChevronDown size={14} color="#666" />}
                     <Text style={styles.viewRepliesText}>
                         {repliesOpen ? 'Hide replies' : `View ${comment.repliesCount} replies`}
                     </Text>
                 </TouchableOpacity>
                 
                 {repliesOpen && comment.replies?.map((reply) => (
                     <View key={reply.id} style={styles.replyRow}>
                         <Image source={{ uri: reply.user.avatar }} style={styles.replyAvatar} />
                         <View style={{ flex: 1 }}>
                             <View style={styles.headerRow}>
                                <Text style={styles.username}>{reply.user.name}</Text>
                                <Text style={styles.dot}>•</Text>
                                <Text style={styles.timestamp}>{reply.createdAt}</Text>
                             </View>
                             <Text style={[styles.commentText, { fontSize: 14 }]}>{reply.text}</Text>
                             <View style={styles.actionsRow}>
                                 <LikeCount likes={reply.likes} liked={reply.liked} />
                             </View>
                         </View>
                     </View>
                 ))}
             </View>
         ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  composerContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    backgroundColor: COLORS.surface, // Updated from #181818
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 20,
    minHeight: 56,
    justifyContent: 'center',
    paddingVertical: 4, // Reduce vertical padding to allow input to center itself or flex
  },
  inlineInputWrapper: {
      backgroundColor: COLORS.surface, // Updated from #181818
      borderRadius: 24,
      borderWidth: 1,
      borderColor: '#333',
      paddingHorizontal: 16,
      paddingVertical: 10,
      minHeight: 48,
      justifyContent: 'center',
  },
  inlineInput: {
      color: '#FFF',
      fontFamily: FONT_FAMILY.body,
      fontSize: 14,
      textAlignVertical: 'center', // Android center
      paddingTop: 0, 
      paddingBottom: 0,
  },
  inputWrapperFocused: {
    borderColor: '#333',
    backgroundColor: '#000',
  },
  input: {
    width: '100%',
    color: '#FFF',
    fontFamily: FONT_FAMILY.body,
    fontSize: 16, // Match auth
    maxHeight: 120,
    textAlignVertical: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },
  inputWrapperDisabled: {
      backgroundColor: COLORS.surface, // Updated from #111
      borderColor: '#222',
      opacity: 0.7,
  },
  inputDisabled: {
      color: '#666',
  },
  inputFocused: {
    color: '#FFF',
  },
  composerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '100%',
      marginTop: 8,
      gap: 16,
  },
  cancelText: {
      color: '#CCC',
      fontSize: 15,
      fontWeight: '500',
  },
  postBtn: {
      backgroundColor: '#FFF',
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
  },
  postBtnDisabled: {
      backgroundColor: '#333',
  },
  postText: {
      color: '#000',
      fontSize: 15,
      fontWeight: '600',
  },
  postTextDisabled: {
      color: '#666',
  },
  listContainer: {
      marginBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#666',
    fontFamily: FONT_FAMILY.body,
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
    marginBottom: 4,
  },
  username: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.header,
    fontSize: 14,
    marginRight: 6,
    fontWeight: '600',
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
  badgesRow: {
      flexDirection: 'row',
      gap: 6,
      marginBottom: 6,
  },
  badge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
  },
  badgeText: {
      fontSize: 10,
      color: '#FFF',
      fontWeight: '600',
  },
  commentText: {
    color: '#EEE',
    fontFamily: FONT_FAMILY.body,
    fontSize: 15, 
    lineHeight: 22, 
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4, 
  },
  actionCount: {
    color: '#999',
    fontSize: 12, 
    fontFamily: FONT_FAMILY.header,
    fontWeight: '500',
  },
  actionText: {
      color: '#999',
      fontSize: 12,
      fontWeight: '500',
  },
  viewRepliesBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      gap: 6,
      marginBottom: 4,
  },
  viewRepliesText: {
      color: '#666', // Muted text for view replies
      fontSize: 13,
      fontWeight: '600',
  },
  replyRow: {
      flexDirection: 'row',
      marginTop: 16,
      paddingLeft: 0, 
  },
  replyAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 10,
      backgroundColor: '#333',
  },
});

const InlineComposer = ({ placeholder, onCancel, onPost }: { placeholder: string; onCancel: () => void; onPost: (t: string) => void }) => {
    const [text, setText] = useState('');
    return (
        <View>
            <View style={styles.inlineInputWrapper}>
                <TextInput 
                    style={styles.inlineInput}
                    placeholder={placeholder}
                    placeholderTextColor="#666"
                    value={text}
                    onChangeText={setText}
                    multiline
                    autoFocus
                />
            </View>
            <View style={styles.composerActions}>
                <TouchableOpacity onPress={onCancel}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => {
                        onPost(text.trim());
                        setText('');
                    }}
                    disabled={!text.trim()}
                    style={[styles.postBtn, !text.trim() && styles.postBtnDisabled]}
                >
                    <Text style={[styles.postText, !text.trim() && styles.postTextDisabled]}>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
