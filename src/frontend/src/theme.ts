import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954', // Spotify green
    },
    background: {
      default: '#121212', // Spotify dark background
      paper: '#181818', // Slightly lighter dark background for cards
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 500, // Pill-shaped buttons
          textTransform: 'none', // Don't uppercase button text
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 4, // Slightly rounded list items
        },
      },
    },
  },
});

export default theme;