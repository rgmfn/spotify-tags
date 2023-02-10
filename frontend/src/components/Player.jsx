import React, { useState, useEffect } from 'react';

/**
 * 
 * 
 * Creates a Spotify Web Player that plays songs.
 */
function Player({accessToken, trackURI}) {
    const [deviceID, setDeviceID] = React.useState([]);
    const token = 'BQCeHhb-EMDCuWW9m2scXbBiP08vILm9yqjb71OQma7OREmSitQRBDPusCrIFaSCs00zhxa8MSG_w5bq6AoUXEvjo6P9z--uosxpZjzsDXWSAvIVrBxlMoDdQNZ8-_xaAO5bRDzi_pvaPYsDn3_nzpqf-tSPl8p6GB8HyPxGX_DtGQAgzFSkFJlnqjKUK365JlhW';

    useEffect(() => {
        console.log(`Player: trackURI: ${trackURI}`);
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [trackURI] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
    }, [trackURI]);

    useEffect(() => {

        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Spotify Tags Web Player',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            player.addListener('ready', ({ device_id }) => {
                setDeviceID(device_id);
                console.log('Ready with Device ID', device_id);
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

            // when Play/ Pause button is clicked, a track starts playing on the Home page
            document.getElementById('play-button').onclick = () => {
   
                console.log("Player: button is pressed");

                if (deviceID == undefined) {
                    console.log('no device connected yet');
                    return;
                }

                player.togglePlay()
            }
        };
    }, []);
}

export default Player;
