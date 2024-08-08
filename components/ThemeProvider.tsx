import { ThemeProvider as RNThemeProvider, createTheme } from '@rneui/themed';

const theme = createTheme({});

const CustomThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <RNThemeProvider theme={theme}>{children}</RNThemeProvider>;
};

export default CustomThemeProvider;
