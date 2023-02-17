import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import {createTheme, ThemeProvider} from '@mui/material/styles';

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

/**
*
* @param {*} props    - The setSearchQuery and searchQuery,
*                     - so searchQuery can be changed.
* @return {searchQuery}
*/
export default function SearchBar(props) {
  const handleClearClick = () => {
    // Clears when the clear icon is clicked.
    props.setSearchQuery('');
  };
  // ThemeProvider is a wrapper used on components
  // that you want to follow the theme.
  return (
    <ThemeProvider theme={theme}>
      <TextField sx={{'input': {color: 'primary.text'},
        'mt': 1,
        // sx is shorthand css.
        'mb': 1,
        'display': 'flex',
        'alignItems': 'center',
        '& .MuiInputLabel-root': {color: 'secondary.main'},
        '& .MuiOutlinedInput-root':
        {'& > fieldset': {borderColor: 'secondary.main'}},
        // Setting the color of search bar when not focused.
        '& .MuiOutlinedInput-root:hover':
        {'& > fieldset': {borderColor: 'secondary.main'}},
        // Setting the color of the search bar when hovered.
      }}
      value={props.searchQuery}
      // Value is always what searchQuery is.
      placeholder='Search a Song'
      bgcolor='primary'
      color='secondary'
      // Color of the search bar when focused.
      fullWidth
      onChange={(newValue) => {
        // Whenever input changes setSearchQuery.
        props.setSearchQuery(newValue.target.value);
      }}
      InputProps={{
        startAdornment: (
          // Search icon at the beginning of search bar.
          <InputAdornment position='start'>
            <SearchIcon color='secondary' />
          </InputAdornment>
        ),
        endAdornment: (
          // Clear icon button at the end of the search bar.
          <IconButton onClick={handleClearClick}
            sx={{visibility: props.searchQuery ? 'visible' : 'hidden'}}
            // Clear icon is hidden if value is an empty string.
            color='secondary'>
            <ClearIcon />
          </IconButton>
        ),
      }}
      // Outlined variant of the textfield from mui.
      variant='outlined'
      />
    </ThemeProvider>
  );
}
