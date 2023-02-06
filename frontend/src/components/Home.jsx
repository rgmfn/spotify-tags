import React from 'react';

import './Home.css';
import Library from './Library.jsx';
import Player from './Player.jsx';

const refreshTokenFunc = async (refreshToken, setAccessToken) => {
  const refresh = await fetch('http://localhost:3010/refresh_token?refresh_token=' + refreshToken);
  const refreshJson = await refresh.json();
  setAccessToken(refreshJson.access_token);
  return refreshJson.access_token;
};

const getSearch = async (accessToken, refreshToken, setAccessToken, query) => {
  let result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=20`, {
    // http get request to api.spotify.com/v1/search
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + accessToken},
  });

  if (!result.ok) {
    accessToken = await refreshTokenFunc(refreshToken, setAccessToken);
    result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=20`, {
    // http get request to api.spotify.com/v1/search
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + accessToken},
    });
  }

  const data = await result.json();
  console.log(accessToken);
  console.log(data);
  return data;
};

/**
 * @return {object} JSX
 */
function Home() {
  const [accessToken, setAccessToken] = React.useState('');
  const [refreshToken, setRefreshToken] = React.useState('');
  const [library, setLibrary] = React.useState([]);
  // list of songs (spotify song objs) that the user has added tags to
  const [isPlaying, setIsPlaying] = React.useState(false);
  // used to keep track of the current playing status 'isPlaying'
  const [trackURI, setTrackURI] = React.useState('');


  React.useEffect(() => {
    const hash = window.location.hash;
    let accessToken = window.localStorage.getItem('accessToken');
    let refreshToken = window.localStorage.getItem('refreshToken');
    console.log('hash:', hash);

    if (!refreshToken && hash) {
      refreshToken = hash.substring(1).split('&').find((elem) =>
        elem.startsWith('refresh_token')).split('=')[1];
    }

    setRefreshToken(refreshToken);

    if (!accessToken && hash) {
      accessToken = hash.substring(1).split('&').find((elem) =>
        elem.startsWith('access_token')).split('=')[1];


      window.location.hash = '';
      window.localStorage.setItem('accessToken', accessToken);
    }
    console.log('accessToken:', accessToken);
    console.log('refreshToken:', refreshToken);
    setAccessToken(accessToken);
  }, []);


  React.useEffect(() => {
    getSearch(accessToken, refreshToken, setAccessToken, 'cool').then(
      (result) => {
        setLibrary(result.tracks.items);
      });
  }, [refreshToken, accessToken]);
  // get getSearch finishes (async), sets library to those search results
  // called twice, once at page startup, another when we get the token

  const clickedOnSong = ((event) => {
    // called when clicking on a song
    // event stores the thing that was clicked on
    // console.log(event);
    console.log(`clicked song w/ id: ${event.currentTarget.id}`);
    setTrackURI(event.currentTarget.id);
    // above event.currentTarget.id is the Spotify ID of the song
    // event.currentTarget is the thing with the onClick (the tr for the song)
  });

  const handleClick = () => {
    setIsPlaying(!isPlaying);
    // code to play or pause music here
    // called when the button is clicked,triggers the play or pause of the music
  };

  const refreshList = () => {
    getSearch(accessToken, refreshToken, setAccessToken, 'cool').then(
      (result) => {
        setLibrary(result.tracks.items);
      });
  };
  const logout = () => {
    setAccessToken('');
    setRefreshToken('');
    window.localStorage.removeItem('accessToken');
  };

  return (
    <div className="App">
      {!accessToken ?
        <a href={ // login button
          `http://localhost:3010/login`
        }>Login to Spotify</a>: <button onClick={logout}>Logout</button>}
      <button onClick={refreshList}>Refresh List</button>
      <Library
        library={library}
        clickedOnSong={clickedOnSong}
      />
      <div className="play-button-container">
        <button id="play-button" className="play-button" onClick={handleClick}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
      <div>
        <Player 
          accessToken={accessToken}
          trackURI={trackURI}/>
      </div>
    </div>
  );
}

export default Home;
