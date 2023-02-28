import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#192330',
      // Same color theme as the Home.css file.
      text: '#aeafb0',
    },
    secondary: {
      main: '#39506d',
      text: '#29394f',
    },
  },
  typography: {
    fontFamily: 'Gotham Circular, Verdana, Arial, sans-serif',
  },
});

export {theme};
