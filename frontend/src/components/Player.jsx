import React from 'react';

import './Player.css';

import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import {ThemeProvider} from '@mui/material/styles';
import {theme} from './Theme.js';
import {styled} from '@mui/material/styles';

const TinyText = styled(Typography)({
  // Style of the fonts used under the bar
  fontSize: '0.75rem',
  opacity: 0.60,
  fontWeight: 500,
  letterSpacing: 0.2,
});

/**
 * @param {string} accessToken
 * @param {string} clickedTrackID
 * @param {string} playingTrackID
 * @param {function} setPlayingTrackID
 * @param {array} updatedLib
 * @return {object} JSX
 */
function Player({accessToken, clickedTrackID, playingTrackID,
  setPlayingTrackID, updatedLib}) {
  const [player, setPlayer] = React.useState(undefined);
  const [deviceID, setDeviceID] = React.useState(undefined);
  const [isPaused, setIsPaused] = React.useState(true);
  const [libraryHasUpdated, setLibraryHasUpdated] = React.useState(false);
  const [duration, setDuration] = React.useState(0); // seconds
  const [position, setPosition] = React.useState(0);
  const [playerVolume, setPlayerVolume] = React.useState(50);
  /**
   *
   * @param {*} value
   * @return {object}
   */
  function formatDuration(value) {
    // Make sure it looks like minutes:seconds for the time
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

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

  /**
  * Called after mouse clicks 'Down' button.
  *
  * Lowers volume.
  */
  const lowerVolume = () => {
    console.log(`Toggled "Down" button to lower volume!`);

    player.getVolume().then((volume) => {
      volume *= 100;
      const pVolume = Math.round(volume - 5);

      if (pVolume >= 0) {
        player.setVolume(pVolume/100);
        setPlayerVolume(pVolume);
      } else {
        console.log(` Volume is already at minimum level; ` +
          `cannot go any lower!`);
      }
    });
  };

  /**
   * Called after mouse clicks 'Up' button.
   *
   * Raises volume.
   */
  const raiseVolume = () => {
    console.log(`Toggled "Up" button to raise volume!`);

    player.getVolume().then((volume) => {
      volume *= 100;
      const pVolume = Math.round(volume + 5);

      if (pVolume <= 100) {
        player.setVolume(pVolume/100);
        setPlayerVolume(pVolume);
      } else {
        console.log(` Volume is already at maximum level; ` +
          `cannot go any higher!`);
      }
    });
  };

  /**
   * Makes sure when the library is updated the playlist
   * being played is automatically updated to the new one.
   * Works very similarly to clicking on a song.
   */
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
        <div className="volume-control-container">
          <IconButton
            id='down-button'
            className='down-button'
            color='secondary'
            type='button'
            title='Lower volume'
            onClick={lowerVolume}
          >
            <VolumeDownIcon
              style={{fontSize: 30}}
              color='secondary'/>
          </IconButton>

          <p
            id="volume-display"
            className="volume-display"
          >
            Volume: {playerVolume}%
          </p>

          <IconButton
            id='up-button'
            className='up-button'
            color='secondary'
            type='button'
            title='Raise volume'
            onClick={raiseVolume}
          >
            <VolumeUpIcon
              style={{fontSize: 30}}
              color='secondary'/>
          </IconButton>
        </div>

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
              style={{fontSize: 50}}
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
            <SkipNextIcon
              style={{fontSize: 50}}
              color='secondary'/>
          </IconButton>
        </div>
        <Box sx={{width: 300}}>
          <Slider
            aria-label="song-slider"
            size="small"
            value={position}
            min={0}
            step={1}
            max={duration}
            color='secondary'
            onChange={(_, value) => fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${value*1000}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
            })}
            sx={{
              'height': 3,
              '& .MuiSlider-rail': {
                opacity: 0.28,
              },
            }}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: -2,
            }}
          >
            <TinyText>{formatDuration(position)}</TinyText>
            <TinyText>-{formatDuration(duration - position)}</TinyText>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default Player;
