import React from 'react';
import Popover from '@mui/material/Popover';
import AlbumIcon from '@mui/icons-material/Album';
import PersonIcon from '@mui/icons-material/Person';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import './SongCard.css';

const emptySong = {
  'album': {'images': [{'url': ''}]},
  'artists': [''],
  'available_markets': [],
  'disc_number': -1,
  'duration_ms': -1,
  'explicit': true,
  'external_ids': {},
  'external_urls': {},
  'href': '',
  'id': '',
  'is_local': false,
  'name': 'Loading...',
  'popularity': -1,
  'preview_url': '',
  'track_number': -1,
  'type': '',
  'uri': '',
};

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
    mode: 'dark',
    primary: {
      main: spotifyTagsTheme.red,
    },
    text: {
      primary: spotifyTagsTheme.textColor,
    },
  },
});

const getSong = async (accessToken, id) => {
  if (!id) {
    console.log('no song to display');
    return emptySong;
  }

  const result = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    // http get request to api.spotify.com/v1/search
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + accessToken},
  });

  const data = await result.json();
  // console.log(data);
  return data;
};

/**
 * @return {object} JSX
 */
function SongCard({accessToken, songID, setSongID}) {
  const [song, setSong] = React.useState(emptySong);

  const close = () => {
    setSongID(null);
    setSong(emptySong);
    console.log('song card closed');
  };

  React.useEffect(() => {
    getSong(accessToken, songID).then((song) => {
      setSong(song);
    });
  }, [accessToken, songID]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Popover
        open={Boolean(songID)}
        onClose={close}
        anchorReference='none'
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        // anchorReference='anchorPosition'
        // anchorPosition={{top: '50%', left: '50%'}}
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
            {/* TODO make these happen dynamically, stored in song obj */}
            <div className="tagName redTag">
              Tag 1
            </div>
            <div className="tagName greenTag">
              Tag 2
            </div>
            <div className="tagName blueTag">
              Tag 3
            </div>
          </div>
        </div>
      </Popover>
    </ThemeProvider>
  );
}

export default SongCard;
