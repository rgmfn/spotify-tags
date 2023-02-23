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
 * @return {object} JSX
 */
function Player({accessToken, trackURI}) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [deviceID, setDeviceID] = React.useState(undefined);
  const [player, setPlayer] = React.useState(undefined);

  // sets up web player to stream music
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
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      });
    };
  }, [accessToken]);

  // if web player is ready & song is clicked on, song plays in browser
  React.useEffect(() => {
    if ((typeof(deviceID) != undefined) && trackURI !== '') {
      console.log(`Player: play clicked song`);
      console.log(`   trackURI: ${trackURI}`);
      console.log(`   deviceID: ${deviceID}`);

      // HTTP request to initially play music
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
        method: 'PUT',
        body: JSON.stringify({uris: [trackURI]}),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setIsPlaying(true);
    }
  }, [trackURI]);

  // called when the "play/ pause" button is clicked,
  // triggers the play or pause of the music
  const handleClick = () => {
    setIsPlaying(!isPlaying);

    player.togglePlay().then(() => {
      console.log('Toggled playback!');
    });
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
                    console.log(`    trackURI: ${trackURI}`);
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
                    console.log(`    trackURI: ${trackURI}`);
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
