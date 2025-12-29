import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { COLORS, SPACING, FONT_FAMILY, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const TextField = ({ label, error, style, ...props }: TextFieldProps) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          style
        ]}
        placeholderTextColor={COLORS.textSecondary}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.l,
  },
  label: {
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    fontSize: FONT_SIZE.s,
    marginBottom: SPACING.s,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.m,
    padding: SPACING.m,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZE.m,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
    fontFamily: FONT_FAMILY.body,
  },
});
