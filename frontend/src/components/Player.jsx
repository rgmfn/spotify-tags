import React from 'react';

import './Player.css';

import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import IconButton from '@mui/material/IconButton';
import {createTheme, ThemeProvider} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    secondary: {
      main: '#39506d',
    },
  },
});

/**
 * @param {state} accessToken
 * @param {state} clickedTrackURI
 * @param {state} updatedLib
 * @return {object} JSX
 */
function Player({accessToken, clickedTrackURI, updatedLib}) {
  const [player, setPlayer] = React.useState(undefined);
  const [deviceID, setDeviceID] = React.useState(undefined);
  const [isPlaying, setIsPlaying] = React.useState(false);

  /**
   * Sets up web player to stream music.
   */
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      // initializes player instance of Web Playback SDK
      const player = new window.Spotify.Player({
        name: 'Spotify Tags Web Player',
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      setPlayer(player);

      // connects web player to listening device
      player.addListener('ready', ({device_id}) => {
        setDeviceID(device_id);
        console.log('Ready with deviceID', device_id);
      });

      player.addListener('not_ready', ({device_id}) => {
        console.log('deviceID has gone offline', device_id);
      });

      player.addListener('initialization_error', ({message}) => {
        console.error(message);
      });

      player.addListener('authentication_error', ({message}) => {
        console.error(message);
      });

      player.addListener('account_error', ({message}) => {
        console.error(message);
      });

      // connects web player instance to Spotify w/ credentials given
      // during initialization above
      player.connect().then((success) => {
        if (success) {
          console.log('The Web Playback SDK successfully ' +
                      'connected to Spotify!');
        }
      });
    };
  }, [accessToken]);

  /**
   * If web player is connected to device & song is clicked on,
   * an array of track uris from all library songs is passed to
   * play on device. The first song that is played is the
   * clicked song by user.
   */
  React.useEffect(() => {
    if ((typeof(deviceID) != undefined) && (clickedTrackURI !== '')) {
      console.log(`Player: play clicked song`);

      // creates list of uris (playlist) from list of songs (updatedLib)
      let playlist = [];
      updatedLib.map((song) => {
        playlist = [...playlist, song.uri];
      });

      // HTTP request to initially play music
      // plays songs in playlist starting with clicked song
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
        method: 'PUT',
        body: JSON.stringify({
          uris: playlist,
          offset: {position: playlist.indexOf(clickedTrackURI)},
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setIsPlaying(true);
    }
  }, [clickedTrackURI]);

  /**
   * Called when clicking on the pause/play button.
   * Toggles the playing state of the SpotifySDKPlayer.
   */
  const clickedOnPlayPause = () => {
    player.togglePlay().then(() => {
      console.log('Toggled playback!');
    });
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="container">
          <div className="main-wrapper">
            <div className="stream-buttons-container">
              <IconButton
                id="prev-button"
                className="prev-button"
                color='secondary'
                onClick={() => {
                  player.previousTrack().then(() => {
                    console.log('Set to previous track!');
                  });
                }}>
                <SkipPreviousIcon style={{fontSize: 50}} color='secondary'/>
              </IconButton>

              <IconButton
                id="play-button"
                className="play-button"
                color='secondary'
                onClick={ handleClick }>
                {isPlaying ?
                  <PauseCircleIcon style={{fontSize: 70}} color='secondary'/>:
                  <PlayCircleIcon style={{fontSize: 70}} color='secondary'/>}
              </IconButton>

              <IconButton
                id="next-button"
                className="next-button"
                color='secondary'
                onClick={() => {
                  player.nextTrack().then(() => {
                    console.log('Skipped to next track!');
                  });
                }}>
                <SkipNextIcon style={{fontSize: 50}} color='secondary'/>
              </IconButton>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}

export default Player;
