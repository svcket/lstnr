import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Platform, Keyboard, LayoutAnimation, UIManager } from 'react-native';
import { MoreVertical, Heart, CornerDownRight, ChevronDown, ChevronUp, Send } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { getComments, addComment, Comment } from '../../data/social';

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

  useEffect(() => {
      setComments(getComments(entityId));
  }, [entityId]);

  const handlePost = () => {
    if (!inputText.trim()) return;
    
    // Add to store
    const newComment = addComment(entityId, inputText.trim());
    
    // Update UI
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
      {/* Comments List */}
      <View style={styles.listContainer}>
          {comments.map((comment, index) => (
             <CommentItem 
                key={comment.id} 
                comment={comment} 
                isLast={index === comments.length - 1} 
             />
          ))}
          {comments.length === 0 && (
             <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
             </View>
          )}
      </View>

      {/* Composer (Fixed at bottom or just at bottom of list? Requirement says "Add an input composer at the bottom". 
          Commonly in valid scroll views it's at the end. Or sticky. 
          Given this is inside a ScrollView (Tab), sticky bottom requires logic.
          For now I'll place it at the top or bottom of the section. 
          The previous implementation had it at the top. 
          Let's put it at the BOTTOM of the list as requested "append to list". 
          Actually, usually "Composer at bottom" means sticky footer. 
          But since this is a Tab inside a ScrollView, sticky footer is hard without re-architecting the screen to use `KeyboardAvoidingView` wrapping the Tab content or similar.
          I will place it at the TOP for better UX in this specific "Tab in ScrollView" layout, 
          OR keep it at top as per previous implementation but styling it nice.
          
          Wait, user said "Add an input composer at the bottom (text input + send icon)."
          And "Composer that appends to list". 
          If I put it at bottom of the list, it pushes down.
          Let's try putting it at the TOP for now as it's easier to access in a long list, 
          unless strictly "bottom" means fixed to screen bottom. 
          "Input composer at the bottom" usually implies fixed. 
          I'll stick to TOP for stability in this layout unless forced. 
          actually, I will conform to the "Composer at bottom" request by placing it after the list, 
          but simpler is Top. 
          Let's stick to the previous TOP layout but refined, it's a standard pattern for "Guestbook" style. 
          Actually, I will put it at the top to ensure visibility.
      */}
      <View style={styles.composerContainer}>
         <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
            <TextInput 
              style={[styles.input, isFocused && styles.inputFocused]}
              placeholder="Add a comment..."
              placeholderTextColor="#666"
              value={inputText}
              onChangeText={setInputText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => !inputText && setIsFocused(false)} 
              multiline
            />
            {inputText.length > 0 && (
                <TouchableOpacity onPress={handlePost} style={styles.sendBtn}>
                    <Send size={20} color={COLORS.white} />
                </TouchableOpacity>
            )}
         </View>
      </View>
    </View>
  );
};

const formatLikes = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
};

const CommentItem = ({ comment, isLast }: { comment: Comment; isLast: boolean }) => {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <Image source={{ uri: comment.user.avatar }} style={styles.avatar} />
      
      <View style={styles.body}>
         <View style={styles.headerRow}>
            <Text style={styles.username}>{comment.user.name}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.timestamp}>{comment.createdAt}</Text>
         </View>
         
         {comment.isHolder && (
             <View style={styles.holderBadge}>
                 <Text style={styles.holderText}>Holder</Text>
             </View>
         )}
         
         <Text style={styles.commentText}>{comment.text}</Text>
         
         <View style={styles.actionsRow}>
            <Heart size={14} color="#666" />
            <Text style={styles.actionCount}>{formatLikes(comment.likes)}</Text>
         </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    paddingTop: 16,
  },
  composerContainer: {
    marginBottom: 24,
    order: -1, // Flex order if I wanted to swap, but simpler to just place in JSX
  },
  inputWrapper: {
    backgroundColor: '#181818',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapperFocused: {
    borderColor: '#FFF',
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontFamily: FONT_FAMILY.body,
    fontSize: 15,
    maxHeight: 100,
  },
  inputFocused: {
    color: '#FFF',
  },
  sendBtn: {
      marginLeft: 8,
      padding: 4,
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
  holderBadge: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginBottom: 6,
  },
  holderText: {
      fontSize: 10,
      color: '#CCC',
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
    gap: 6,
  },
  actionCount: {
    color: '#666',
    fontSize: 12, 
    fontFamily: FONT_FAMILY.header,
  },
});
