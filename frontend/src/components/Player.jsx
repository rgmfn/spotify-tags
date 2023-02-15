import React, { useState, useEffect } from 'react';

import './Home.css';

/**
 * 
 * 
 * Creates a Spotify Web Player that plays songs.
 */
function Player({accessToken, trackURI, songClicked}) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    // used to keep track of the current playing status 'isPlaying'
    const [deviceID, setDeviceID] = React.useState(undefined);
    const [player, setPlayer] = React.useState(undefined);
    const token = 'BQB_XmU6vpCQlEz0Zq39rDAWm1Ou5rfTC1Q4RwzsgDus2giP_ViFZqFirOs56_omN4vQTrSbD9F17gFD7f6ENNeOGRspBjlqcm2la8KoYfXQMgE1EW8GJioDkkNHUsZ31-fMGIqkXqfSuAcL9c02mgSODVG1ard0S_I95HkVM-RsPmQBQnnuRrRZ3IP4xhu9tOxl';

    useEffect(() => {

        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Spotify Tags Web Player',
                getOAuthToken: cb => { cb(accessToken); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                setDeviceID(device_id);
                console.log('Ready with device_id', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('initialization_error', ({ message }) => { 
                console.error(message);
            });
          
            player.addListener('authentication_error', ({ message }) => {
                console.error(message);
            });
          
            player.addListener('account_error', ({ message }) => {
                console.error(message);
            });

            player.connect().then(success => {
                if (success) {
                  console.log('The Web Playback SDK successfully connected to Spotify!');
                }
            });
        }
    }, [accessToken]);

    useEffect(() => {
        console.log(`Player: play this song`)

        if ((typeof(deviceID) != undefined) && songClicked) { 
            console.log(`   trackURI: ${trackURI}`);
            console.log(`   deviceID: ${deviceID}`); 
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
                method: 'PUT',
                body: JSON.stringify({ uris: [trackURI] }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });
            setIsPlaying(true);
        }
    }, [trackURI]);

    const handleClick = () => {
        console.log(`Player: accessToken: ${accessToken}`);
        setIsPlaying(!isPlaying);
        player.togglePlay();
        // called when the button is clicked,triggers the play or pause of the music
    };

    return(
        <div className="play-button-container">
            <button id="play-button" className="play-button" onClick={handleClick}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </div>
    );
}


export default Player;
