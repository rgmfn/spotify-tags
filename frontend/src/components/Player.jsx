import React, { useState, useEffect } from 'react';

function Player(props) {

    const [player, setPlayer] = useState(undefined);

    // const play = ({
    //     spotify_uri,
    //     playerInstance: {
    //       _options: {
    //         getOAuthToken
    //       }
    //     }
    //   }) => {
    //     getOAuthToken(access_token => {
    //       fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
    //         method: 'PUT',
    //         body: JSON.stringify({ uris: [spotify_uri] }),
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'Authorization': `Bearer ${access_token}`
    //         },
    //       });
    //     });
    //   };

    useEffect(() => {

        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Player',
                getOAuthToken: cb => { cb(props.accessToken); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ deviceId }) => {
                console.log('Ready with Device ID', deviceId);
            });

            player.addListener('not_ready', ({ deviceId }) => {
                console.log('Device ID has gone offline', deviceId);
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

        };
    }, []);

    return (
        <>
            <p> WEB PLAYER!!</p>
        </>
    );
}

export default Player;
