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
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible]);

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
        <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
            <View style={styles.overlay}>
                {/* Backdrop Layer */}
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
                </TouchableWithoutFeedback>

                {/* Sheet Content */}
                <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
                    
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
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheet: {
        backgroundColor: '#181818', // Consistent surface color
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '75%',
        paddingTop: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
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
        paddingHorizontal: 20,
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
