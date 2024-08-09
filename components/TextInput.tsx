import React, { FC } from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { InputProps, useTheme } from '@rneui/themed';

interface CustomTextInputProps extends React.PropsWithChildren<InputProps> {}

const TextInput: FC<CustomTextInputProps> = ({ style, ...props }) => {
  const { theme } = useTheme();
  const colorScheme = useColorScheme();

  // Define dynamic colors based on the color scheme
  const dynamicStyles = StyleSheet.create({
    input: {
      height: 48,
      paddingHorizontal: 16,
      borderRadius: 8,
      fontSize: 16,
      color: colorScheme === 'dark' ? theme.colors.white : theme.colors.black, // Text color
      backgroundColor:
        colorScheme === 'dark' ? theme.colors.grey1 : theme.colors.grey5, // Background color
      borderColor:
        colorScheme === 'dark' ? theme.colors.grey2 : theme.colors.greyOutline, // Border color
      borderWidth: 1,
      shadowColor:
        colorScheme === 'dark' ? theme.colors.black : theme.colors.grey2, // Shadow color
      shadowOffset: { width: 0, height: 2 }, // Shadow offset
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3, // For Android shadow effect
      ...{ style },
    },
  });

  return (
    <RNTextInput
      placeholderTextColor={
        colorScheme === 'dark' ? theme.colors.grey3 : theme.colors.greyOutline
      } // Placeholder color
      style={[dynamicStyles.input, style]} // Apply dynamic and custom styles
      {...props}
    />
  );
};

export default TextInput;
