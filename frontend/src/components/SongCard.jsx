import React from 'react';
import Popover from '@mui/material/Popover';
import AlbumIcon from '@mui/icons-material/Album';
import PersonIcon from '@mui/icons-material/Person';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import './SongCard.css';

const spotifyTagsTheme = {
  // gotten from Home.css
  bgColor: '#192330',
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

const darkTheme = createTheme({
  palette: {
    mode: 'dark', // makes the background appear lighter
    primary: {
      main: spotifyTagsTheme.red,
    },
    text: {
      primary: spotifyTagsTheme.textColor,
    },
    background: {
      paper: '#192330',
      default: '#192330',
    },
  },
});

/**
 * @return {object} JSX
 */
function SongCard({song, closeCard}) {
  return (
    <ThemeProvider theme={darkTheme}>
      <Popover
        open={Boolean(song.id)}
        onClose={closeCard}
        anchorReference='none'
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div id="songcard-container">
          <div id="top-half">
            <div id="left-half">
              <div id="name-container">
                <p id="songName" className="tagName">
                  {song.name}
                </p>
              </div>
              <div id="artist-container">
                <PersonIcon id="personIcon"/>
                <p id="artistName" className="tagName">
                  {song.artists[0].name}
                </p>
              </div>
              <div id="album-container">
                <AlbumIcon id="albumIcon"/>
                <p id="albumName" className="tagName">
                  {song.album.name}
                </p>
              </div>
            </div>
            <div id="right-half">
              <img
                src={song.album.images[0].url}
                alt={'[' + song.album.name + ' img]'}
                id="songImg"
              />
            </div>
          </div>
          <hr id="divider"/>
          <div id="bottom-half">
            <div id="tags-container">
              {/* TODO make these happen dynamically, stored in song obj */}
              {song.tags.map((tag) => (
                <div
                  style={{backgroundColor: tag.color}}
                  className="tagName"
                >
                  {tag.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Popover>
    </ThemeProvider>
  );
}

export default SongCard;
