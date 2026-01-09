import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { X } from 'lucide-react-native';
import { COLORS, FONT_FAMILY, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface InfoModalProps {
  visible: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export const InfoModal = ({ visible, title, description, onClose }: InfoModalProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Blur Support */}
          {/* <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" /> */}
          
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onClose} hitSlop={{top:10,bottom:10,left:10,right:10}}>
                  <X size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.description}>
                {description}
              </Text>
              
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeText}>Got it</Text>
              </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.l,
  },
  modalCard: {
    width: width - 48,
    backgroundColor: '#181818',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333',
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FONT_FAMILY.header, // Medium
    fontSize: 18,
    color: COLORS.text,
  },
  description: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 15,
    color: '#CCC',
    lineHeight: 24,
    marginBottom: 24,
  },
  closeBtn: {
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
  },
  closeText: {
    fontFamily: FONT_FAMILY.header,
    color: '#FFF',
    fontSize: 14,
  },
});
