import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';
// @ts-ignore
import { BlurView } from 'expo-blur';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { X, Link as LinkIcon, MessageCircle, Twitter, Instagram, Mail, Linkedin, Facebook } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ShareSheetProps {
  visible: boolean;
  onClose: () => void;
  artistName: string;
}

const SHARE_OPTIONS = [
  { label: 'Copy Link', icon: <LinkIcon size={24} color="#FFF" />, id: 'copy' },
  { label: 'WhatsApp', icon: <MessageCircle size={24} color="#FFF" />, id: 'whatsapp' },
  { label: 'Facebook', icon: <Facebook size={24} color="#FFF" />, id: 'facebook' },
  { label: 'Twitter', icon: <Twitter size={24} color="#FFF" />, id: 'twitter' },
  { label: 'LinkedIn', icon: <Linkedin size={24} color="#FFF" />, id: 'linkedin' },
  { label: 'Instagram', icon: <Instagram size={24} color="#FFF" />, id: 'instagram' },
  // Using generic icons for TikTok/Email as Lucide might not have TikTok in older versions or we map closest
  { label: 'Tik Tok', icon: <MessageCircle size={24} color="#FFF" />, id: 'tiktok' }, 
  { label: 'Email', icon: <Mail size={24} color="#FFF" />, id: 'email' },
];

export const ShareSheet = ({ visible, onClose, artistName }: ShareSheetProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handleBar} />
              
              <View style={styles.header}>
                <Text style={styles.title}>Share</Text>
                <TouchableOpacity onPress={onClose}>
                  <X size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.grid}>
                {SHARE_OPTIONS.map((option) => (
                  <TouchableOpacity key={option.id} style={styles.gridItem} onPress={onClose}>
                    <View style={styles.iconCircle}>
                      {option.icon}
                    </View>
                    <Text style={styles.label}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16, // Requested 16px
    paddingTop: 12,
    paddingBottom: 64, // Requested 64px
    borderWidth: 1,
    borderColor: '#222',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: FONT_FAMILY.header,
    color: '#FFF',
    fontSize: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Auto spacing
    rowGap: 24,
  },
  gridItem: {
    width: '22%', // 4 * 22% = 88% (Fits), 5 * 22% = 110% (Wraps). ~14px auto gaps.
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  label: {
    color: '#CCC',
    fontSize: 12,
    fontFamily: FONT_FAMILY.body,
    textAlign: 'center',
  },
});
