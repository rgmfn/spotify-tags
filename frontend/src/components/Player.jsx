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
  updatedLib}) {
  const [player, setPlayer] = React.useState(undefined);
  const [deviceID, setDeviceID] = React.useState(undefined);
  const [isPaused, setIsPaused] = React.useState(false);

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

        // eslint-disable-next-line camelcase
        setPlayingTrackID(state.track_window.current_track.id);
        // eslint-disable-next-line camelcase
        console.log(`Current playing song: ` +
                    `${state.track_window.current_track.name}`);
        setIsPaused(state.paused);
      }));
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

  /**
   * Called after volume is changed.
   *
   * Displays new volume value.
   *
   * @param {float} volume
   */
  const displayVolume = (volume) => {
    document.getElementById('volume-display').innerHTML =
    'Volume: '.concat((volume).toString())
      .concat('%');
  };

  /**
   * Called after mouse clicks or holds down 'Down' button.
   *
   * Lowers volume & displays new volume value.
   */
  const lowerVolume = () => {
    console.log(`Toggled button to lower volume!`);

    player.getVolume().then((volume) => {
      volume *= 100;
      const pVolume = Math.round(volume - 5);

      if (pVolume >= 0) {
        player.setVolume(pVolume/100);
        displayVolume(pVolume);
      } else {
        console.log(` Volume is already at minimum level; ` +
          `cannot go any lower!`);
      }
    });
  };

  /**
  * Called after mouse clicks or holds down 'Up' button.
  *
  * Raises volume & displays new volume value.
  */
  const raiseVolume = () => {
    console.log(`Toggled button to raise volume!`);

    player.getVolume().then((volume) => {
      volume *= 100;
      const pVolume = Math.round(volume + 5);

      if (pVolume <= 100) {
        player.setVolume(pVolume/100);
        displayVolume(pVolume);
      } else {
        console.log(` Volume is already at maximum level; ` +
          `cannot go any higher!`);
      }
    });
  };

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

        <div className="volume-control-container">
          <button
            id='down-button'
            className='down-button'
            color='secondary'
            type='button'
            onClick={lowerVolume}
          >
            Down
          </button>

          <p
            id="volume-display"
            className="volume-display"
            color='secondary'
          >
            Volume: 50%
          </p>

          <button
            id='up-button'
            className='up-button'
            color='secondary'
            type='button'
            onClick={raiseVolume}
          >
            Up
          </button>
        </div>
      </ThemeProvider>
    </>
  );
}

export default Player;
