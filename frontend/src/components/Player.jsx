import React from 'react';

import './Player.css';

import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import IconButton from '@mui/material/IconButton';
import {ThemeProvider} from '@mui/material/styles';
import {theme} from './Theme.js';

/**
 * @param {string} accessToken
 * @param {string} clickedTrackID
 * @param {function} setPlayingTrackID
 * @param {array} updatedLib
 * @return {object} JSX
 */
function Player({accessToken, clickedTrackID, setPlayingTrackID,
  playingTrackID, updatedLib}) {
  const [player, setPlayer] = React.useState(undefined);
  const [deviceID, setDeviceID] = React.useState(undefined);
  const [isPaused, setIsPaused] = React.useState(false);
  const [libraryHasUpdated, setLibraryHasUpdated] = React.useState(false);
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
      // eslint-disable-next-line camelcase
      player.addListener('ready', ({device_id}) => {
        setDeviceID(device_id);
        console.log('Ready with deviceID', device_id);
        fetch(`https://api.spotify.com/v1/me/player/repeat?state=off&device_id=${device_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      });

      // eslint-disable-next-line camelcase
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

      // runs when state of the local playback has changed (i.e.
      // current playing track changes, current track pauses,
      // current track resumes playing)
      player.addListener('player_state_changed', ((state) => {
        if (!state) {
          return;
        }

        // eslint-disable-next-line camelcase
        setPlayingTrackID(state.track_window.current_track.id);
        // eslint-disable-next-line camelcase
        console.log(`Current playing song: ` +
                    `${state.track_window.current_track.name}`);
        setIsPaused(state.paused);
      }));

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
    if ((typeof(deviceID) != undefined) && (clickedTrackID !== '')) {
      console.log(`Player: play clicked song`);

      // creates list of uris (playlist) from list of songs (updatedLib)
      let playlist = [];
      updatedLib.forEach((song) => {
        playlist = [...playlist, song.uri];
      });

      // creates clicked track's URI string using its ID
      const clickedTrackURI = 'spotify:track:'.concat(clickedTrackID);

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
    }
  }, [clickedTrackID]);

  React.useEffect(() => {
  if (player && deviceID && updatedLib.length > 0 && libraryHasUpdated) {
    console.log(`Player: update playlist`);

    // creates list of uris (playlist) from list of songs (updatedLib)
    let playlist = [];
    updatedLib.forEach((song) => {
      playlist = [...playlist, song.uri];
    });

    // HTTP request to update music
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
      method: 'PUT',
      body: JSON.stringify({
        uris: playlist,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    setLibraryHasUpdated(false);
  }
}, [playingTrackID]);

  React.useEffect(() => {
    setLibraryHasUpdated(true);
    console.log('library is updating');
  }, [updatedLib]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="stream-buttons-container">
          <IconButton
            id="prev-button"
            className="prev-button"
            color='secondary'
            title='Previous'
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
            title={!isPaused ? 'Pause' : 'Play'}
            onClick={() => {
              player.togglePlay().then(() => {
                console.log('Toggled play button!');
              });
            }}>
            {!isPaused ?
              <PauseCircleIcon
                style={{fontSize: 70}}
                color='secondary'
              />:
              <PlayCircleIcon
                style={{fontSize: 70}}
                color='secondary'
              />}
          </IconButton>

          <IconButton
            id="next-button"
            className="next-button"
            color='secondary'
            title='Next'
            onClick={() => {
              player.nextTrack().then(() => {
                console.log('Skipped to next track!');
              });
            }}>
            <SkipNextIcon style={{fontSize: 50}} color='secondary'/>
          </IconButton>
        </div>
      </ThemeProvider>
    </>
  );
}

export default Player;
