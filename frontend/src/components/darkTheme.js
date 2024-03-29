import {createTheme} from '@mui/material/styles';

const spotifyTagsTheme = {
  // gotten from Home.css
  bgColor: '#192330',
  bgColorLighter: '#383c4c',
  textColor: '#aeafb0',
  borderColor: '#39506d',
  selectedColor: '#29394f',
  red: '#c94f6d',
  green: '#81b29a',
  yellow: '#dbc074',
  blue: '#719cd6',
  purple: '#9d79d6',
  cyan: '#63cdcf',
  orange: '#f4a261',
  pink: '#d67ad2',
};

/*
 * Creates a theme that is used to change the color pallete of Popovers.
 */
const darkTheme = createTheme({
  palette: {
    primary: {
      main: spotifyTagsTheme.red,
    },
    text: {
      primary: spotifyTagsTheme.textColor,
    },
    background: {
      paper: spotifyTagsTheme.bgColorLighter,
      default: spotifyTagsTheme.bgColorLighter,
    },
  },
});

export {darkTheme};
