import React, { useState, useEffect } from 'react';

function Player(props) {

    useEffect(() => {

        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            // token is a temporary Access Token; go here to replace token: https://developer.spotify.com/documentation/web-playback-sdk/quick-start/#
            const token = 'BQDzDZQgpIaO75xJff0PFbjEqNYY5puc9xXv4OogrkUPiDpTYcrU1Vuvl2AU__wxbCeCmKfWxAPcEfHa3oYXKc0a5TqvIsACTa1L0pQmVUEHEDyBjFsxjwZVZFFGjIMWAgDajnKrfeLrxgWv6TcRRP_4AJEPPEVmOhNKpXC0eXatqLp9aCBA69J2NL7oyQdMYpwq';
            const spotifyURI = 'spotify:track:6sxptembJVty4sNtcPMAVz';
            let deviceID = null;

            const player = new window.Spotify.Player({
                name: 'Spotify Tags Web Player',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            player.addListener('ready', ({ device_id }) => {
                //setDeviceID(deviceID);
                deviceID = device_id;
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                setDeviceID(deviceID);
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

            // when Dustin's button is clicked, a track starts playing on the Home page
            document.getElementById('play-button').onclick = function() {
   
                console.log("button is pressed!!");
                player.togglePlay();

                if (deviceID == undefined) {
                    console.log('no device connected yet');
                    return;
                }

                fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
                    method: 'PUT',
                    body: JSON.stringify({ uris: [spotifyURI] }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
            }

            player.connect().then(success => {
                if (success) {
                  console.log('The Web Playback SDK successfully connected to Spotify!');
                }
            });

        };
    }, []);
}

export default Player;
