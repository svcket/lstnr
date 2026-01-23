import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, ScrollView, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';

interface InfoSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const InfoSheet = ({ visible, onClose, title, content }: InfoSheetProps) => {
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
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onClose}>
                  <X size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.text}>{content}</Text>
              </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: '80%',
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
    marginBottom: 24,
  },
  title: {
    fontFamily: FONT_FAMILY.header,
    color: '#FFF',
    fontSize: 20,
  },
  contentContainer: {
    marginBottom: 20,
  },
  text: {
    color: '#CCC',
    fontSize: 16,
    fontFamily: FONT_FAMILY.body,
    lineHeight: 24,
  },
});
