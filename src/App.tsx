import { ThemeProvider, createTheme, CssBaseline, useMediaQuery, PaletteMode } from '@mui/material';
import MainPage from './pages/MainPage';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { createContext, useMemo, useState, useContext } from 'react';
import '@fontsource/lexend/300.css';
import '@fontsource/lexend/400.css';
import '@fontsource/lexend/500.css';
import '@fontsource/lexend/700.css';

// 创建主题上下文
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light' as PaletteMode,
});

// 主题提供者组件
export const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<PaletteMode>(prefersDarkMode ? 'dark' : 'light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#006495',
            light: '#5092c3',
            dark: '#003a69',
          },
          background: {
            default: mode === 'light' ? '#f8f9fa' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        typography: {
          fontFamily: '"Lexend", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        shape: {
          borderRadius: 16,
        },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' 
            ? '0 2px 8px rgba(0,0,0,0.1)' 
            : '0 2px 8px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: mode === 'light'
              ? '0 4px 12px rgba(0,0,0,0.15)'
              : '0 4px 12px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          border: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
}),
[mode]
);

return (
  <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SubscriptionProvider>
        <MainPage />
      </SubscriptionProvider>
    </ThemeProvider>
  </ColorModeContext.Provider>
);
};

// 导出主题上下文钩子
export const useColorMode = () => useContext(ColorModeContext);

function App() {
  return (
    <ThemeContextProvider>
      <SubscriptionProvider>
        <MainPage />
      </SubscriptionProvider>
    </ThemeContextProvider>
  );
}

export default App;
