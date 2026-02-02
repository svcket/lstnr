import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, ScrollView, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { Check, X } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FilterOption {
    label: string;
    value: string;
}

interface FilterSheetProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    options: FilterOption[];
    selectedValues: string | string[]; // Single string or array for multi
    onSelect: (value: string) => void;
    multiSelect?: boolean;
    onReset?: () => void;
}

export const FilterSheet = ({ 
    visible, 
    onClose, 
    title, 
    options, 
    selectedValues, 
    onSelect, 
    multiSelect = false,
    onReset 
}: FilterSheetProps) => {
    if (!visible) return null;

    const isSelected = (val: string) => {
        if (Array.isArray(selectedValues)) {
            return selectedValues.includes(val);
        }
        return selectedValues === val;
    };

    const handleSelect = (val: string) => {
        onSelect(val);
        // If single select, close after short delay for UX
        if (!multiSelect) {
            setTimeout(onClose, 250);
        }
    };

    return (
        <Modal 
          transparent 
          visible={visible} 
          animationType="slide" 
          onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.sheet}>
                            <View style={styles.handleBar} />
                            
                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.title}>{title}</Text>
                                {onReset && (
                                     <TouchableOpacity onPress={onReset}>
                                         <Text style={styles.resetText}>Reset</Text>
                                     </TouchableOpacity>
                                )}
                            </View>

                            {/* List */}
                            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                                {options.map((opt) => {
                                    const active = isSelected(opt.value);
                                    return (
                                        <TouchableOpacity 
                                            key={opt.value} 
                                            style={styles.row} 
                                            onPress={() => handleSelect(opt.value)}
                                        >
                                            <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>
                                                {opt.label}
                                            </Text>
                                            {active && <Check size={20} color={COLORS.white} />}
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>

                            {/* Footer Safe Area */}
                            <View style={{ height: 34 }} />
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
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '75%',
        paddingTop: 8,
        paddingBottom: 40,
        borderWidth: 1,
        borderColor: '#222',
        overflow: 'hidden',
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
        alignSelf: 'center',
        marginVertical: 12, // Reduced from marginBottom 20 and paddingTop
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16, // Reduced from 20
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    title: {
        color: COLORS.white,
        fontFamily: FONT_FAMILY.header,
        fontSize: 18,
        fontWeight: '600',
    },
    resetText: {
        color: COLORS.textSecondary,
        fontFamily: FONT_FAMILY.body,
        fontSize: 14,
    },
    listContent: {
        paddingHorizontal: 16, // Reduced from 20
        paddingVertical: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.03)',
    },
    optionLabel: {
        color: COLORS.textSecondary,
        fontSize: 16,
        fontFamily: FONT_FAMILY.body,
    },
    optionLabelActive: {
        color: COLORS.white,
        fontFamily: FONT_FAMILY.medium,
        fontWeight: '600',
    },
});
