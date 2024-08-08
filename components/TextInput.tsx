import React, { FC } from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { useTheme } from '@rneui/themed';

interface CustomTextInputProps extends TextInputProps {}

const TextInput: FC<CustomTextInputProps> = ({ style, ...props }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    input: {
      height: 40,
      paddingHorizontal: 10,
      borderColor: theme.colors.greyOutline, // Border color based on theme
      // borderWidth: 1,
      borderRadius: 5,
      color: theme.colors.black, // Text color based on theme
      backgroundColor: theme.colors.white, // Background color based on theme
      borderWidth: 0,
      paddingVertical: 0,
    },
  });

  // Adjust styles for dark theme
  if (theme.mode === 'dark') {
    styles.input.backgroundColor = theme.colors.grey3;
    styles.input.color = theme.colors.white;
    styles.input.borderColor = theme.colors.grey2;
  }

  return (
    <RNTextInput
      placeholderTextColor={theme.colors.greyOutline} // Placeholder color based on theme
      style={[styles.input, style]} // Merge custom styles with internal styles
      {...props}
    />
  );
};

export default TextInput;
