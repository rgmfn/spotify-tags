import React from 'react';

import './Player.css';

import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import IconButton from '@mui/material/IconButton';
import {ThemeProvider} from '@mui/material/styles';
import {theme} from './Theme.js';

import ProgressBar from './ProgressBar.jsx';

/**
 * @param {string} accessToken
 * @param {string} clickedTrackID
 * @param {string} playingTrackID
 * @param {function} setPlayingTrackID
 * @param {array} updatedLib
 * @param {array} setPlayer
 * @param {array} setPlayerVolume
 * @return {object} JSX
 */
function Player({accessToken, clickedTrackID, playingTrackID,
  setPlayingTrackID, updatedLib, player, setPlayer, setPlayerVolume}) {
  const [deviceID, setDeviceID] = React.useState(undefined);
  const [isPaused, setIsPaused] = React.useState(true);
  const [libraryHasUpdated, setLibraryHasUpdated] = React.useState(false);
  const [duration, setDuration] = React.useState(0); // seconds
  const [position, setPosition] = React.useState(0);

  /**
   * Sets up web player to stream music &
   * updates states related to the player.
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

      // sets initial volume of player
      player.getVolume().then((volume) => {
        setPlayerVolume(volume * 100);
      });

      // connects web player to listening device
      player.addListener('ready', ({device_id: theDeviceID}) => {
        setDeviceID(theDeviceID);
        console.log('Ready with deviceID', theDeviceID);
        fetch(`https://api.spotify.com/v1/me/player/repeat?state=off&device_id=${theDeviceID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      });

      player.addListener('not_ready', ({device_id: theDeviceID}) => {
        console.log('deviceID has gone offline', theDeviceID);
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

      // runs when state of the local playback has changed (i.e.
      // current playing track changes, current track pauses,
      // current track resumes playing)
      player.addListener('player_state_changed', ((state) => {
        if (!state) {
          return;
        }

        setPosition(Math.floor(state.position/1000));
        setDuration(Math.floor(state.duration/1000));
        // eslint-disable-next-line camelcase

        setPlayingTrackID(state.track_window.current_track.id);
        console.log(`Current playing song: ` +
                    `${state.track_window.current_track.name}`);
        setIsPaused(state.paused);
      }));
    };
  }, [accessToken]);

  /**
   * An interval that updated the position of the progress
   * bar every second unless the song is paused.
   */
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setPosition((prevPosition) => prevPosition + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

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
        <div id="player-container">
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
              <SkipPreviousIcon
                style={{fontSize: 30}}
                color='secondary'/>
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
                  style={{fontSize: 50}}
                  color='secondary'
                />:
                <PlayCircleIcon
                  style={{fontSize: 50}}
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
              <SkipNextIcon
                style={{fontSize: 30}}
                color='secondary'/>
            </IconButton>
          </div>
          <ProgressBar
            position={position}
            duration={duration}
            accessToken={accessToken}
          />
        </div>
      </ThemeProvider>
    </>
  );
}

export default Player;
