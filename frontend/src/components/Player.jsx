import React from 'react';

import './Player.css';

/** 
 * @param {state} accessToken
 * @param {state} trackURI 
 * @param {state} library 
 * @return {object} JSX
 */
function Player({accessToken, trackURI, library}) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [deviceID, setDeviceID] = React.useState(undefined);
  const [player, setPlayer] = React.useState(undefined);

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
          console.log('The Web Playback SDK successfully connected to Spotify!');
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
    if ((typeof(deviceID) != undefined) && (trackURI !== '')) {

      let playlist = [];
      library.map((song) => { 
        playlist = [...playlist, song.uri];
      });
        
      // console.log(`Player: play clicked song`);
      // console.log(`   trackURI: ${trackURI}`);
      // console.log(`   deviceID: ${deviceID}`);
      // console.log(`   playlist:`);
      // playlist.map((uri) => 
      //   console.log(`           ${uri}`)
      // );

      // HTTP request to initially play music
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
        method: 'PUT',
        body: JSON.stringify({
          uris: playlist,
          offset: {position: playlist.indexOf(trackURI)} 
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setIsPlaying(true);
    }
  }, [trackURI]);

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
      <div className="container">
        <div className="main-wrapper">
          <div className="stream-buttons-container">
            <button
              id="prev-button"
              className="prev-button"
              onClick={() => {
                player.previousTrack().then(() => {
                  console.log('Set to previous track!');
                });
              }}>
              {'Prev'}
            </button>

            <button
              id="play-button"
              className="play-button"
              onClick={ clickedOnPlayPause }>
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              id="next-button"
              className="next-button"
              onClick={() => {
                player.nextTrack().then(() => {
                  console.log('Skipped to next track!');
                });
              }}>
              {'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


export default Player;
