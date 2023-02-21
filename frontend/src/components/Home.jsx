import React from 'react';

import './Home.css';
import TopBar from './TopBar';
import Library from './Library.jsx';
import Player from './Player.jsx';
import SongCard from './SongCard.jsx';
import SearchResults from './SearchResults.jsx';

import {emptySong} from './emptySong.js';
import {fakeTags} from './fakeTags.js';

/**
 * Gets a new access token using the refresh token.
 *
 * @param {string} refreshToken
 * @param {function} setAccessToken
 * @return {string}
 */
const refreshTokenFunc = async (refreshToken, setAccessToken) => {
  const refresh = await fetch('http://localhost:3010/refresh_token?refresh_token=' + refreshToken);
  const refreshJson = await refresh.json();
  setAccessToken(refreshJson.access_token);
  return refreshJson.access_token;
};

/**
 * Inserts the testing tags from './fakeTags.js' into the given list of
 * songs (spotify song objects). Returns the new array of tagged songs.
 *
 * Used for testing purposes until we can get the tags for songs from the
 * database.
 *
 * @param {array} songs
 * @return {array}
 */
const insertTestingTags = (songs) => {
  for (const song of songs.tracks.items) {
    song.tags = fakeTags;
  }

  return songs;
};

/**
 * Gets a list of songs from spotify that fits the given query.
 *
 * If the fetch fails, it gets a new access token and tries again.
 *
 * Used for testing to generate a fake library until we can get the library
 * from the database.
 *
 * @param {string} accessToken
 * @param {string} refreshToken
 * @param {function} setAccessToken
 * @param {string} query
 */
const getSearch = async (accessToken, refreshToken, setAccessToken, query) => {
  let result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=20`, {
    // http get request to api.spotify.com/v1/search
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + accessToken},
  });

  if (!result.ok) {
    accessToken = refreshTokenFunc(refreshToken, setAccessToken);
    result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=20`, {
    // http get request to api.spotify.com/v1/search
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + accessToken},
    });
  }
  
  console.log(`accessToken: ${accessToken}`);

  let data = await result.json();
  //console.log(` data: ${data}`);
  data = insertTestingTags(data);
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
  const [trackURI, setTrackURI] = React.useState('');
  const [songToView, setSongToView] = React.useState(emptySong);
  // const [searchQuery, setSearchQuery] = React.useState('');
  const [searchQuery] = React.useState('');

  /**
   * TODO
   */
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


  /**
   * When the refreshToken or accessToken change, reset the library using
   * the temporary getSearch method.
   */
  React.useEffect(() => {
    getSearch(accessToken, refreshToken, setAccessToken, 'cool').then(
      (result) => {
        setLibrary(result.tracks.items);
      });
  }, [refreshToken, accessToken]);
  // get getSearch finishes (async), sets library to those search results
  // called twice, once at page startup, another when we get the token

  /**
   * Called when clicking on a <tr> representing a song in the library.
   *
   * @param {object} event - contains things like the element that was
   *                         clicked on
   */
  const clickedOnSong = ((event) => {
    console.log(`Home: clicked on track`);
    console.log(`   trackURI: ${event.currentTarget.title}`);
    setTrackURI(event.currentTarget.title);
    // event.currentTarget is the thing with the onClick (the tr for the song)
  });

  /**
   * Called when clicking on the tags column of a <tr> representing a song.
   *
   * Gets the song from the current library that has the same id as the
   * song/row clicked on. Sets songToView to that song (makes that song
   * be displayed in SongCard).
   *
   * @param {object} event - contains things like the element that was
   *                         clicked on
   */
  const clickedOnTags = ((event) => {
    if (event.currentTarget.parentNode.id) {
      const song = library.find((libSong) =>
        libSong.id === event.currentTarget.parentNode.id, emptySong,
      );
      setSongToView(song);
    }
  });

  /**
   * Called when clicking outside of the SongCard.
   *
   * Sets songToView to an empty song object (makes the SongCard go away).
   */
  const closeCard = () => {
    setSongToView(emptySong);
  };

  /**
   * Called when clicking on the 'Refresh List' button.
   *
   * Refreshes the library of songs displayed using the temporary getSearch
   * method.
   */
  const refreshList = () => {
    getSearch(accessToken, refreshToken, setAccessToken, 'cool').then(
      (result) => {
        setLibrary(result.tracks.items);
      });
  };

  /**
   * TODO
   */
  const logout = () => {
    setAccessToken('');
    setRefreshToken('');
    window.localStorage.removeItem('accessToken');
  };

  return (
    <div className="App">
      <TopBar />
      {!accessToken ?
        <a href={ // login button
          `http://localhost:3010/login`
        }>Login to Spotify</a>: <button onClick={logout}>Logout</button>}
      <button onClick={refreshList}>Refresh List</button>
      {!Boolean(searchQuery) && <Library
        // ^ displays library if there is no searchQuery
        hidden={Boolean(searchQuery)}
        library={library}
        clickedOnSong={clickedOnSong}
        clickedOnTags={clickedOnTags}
      />}
      <SongCard
        song={songToView}
        setSongToView={setSongToView}
        library={library}
        setLibrary={setLibrary}
        closeCard={closeCard}
      />
      {(accessToken !== '') && <Player
        // ^ sets up web player if there is a accessToken
        accessToken={accessToken}
        trackURI={trackURI}
        library={library}
      />}   
      {Boolean(searchQuery) && <SearchResults
        // ^ displays library if there is a searchQuery
        searchQuery={searchQuery}
        accessToken={accessToken}
        setAccessToken={setAccessToken}
        refreshToken={refreshToken}
        refreshTokenFunc={refreshTokenFunc}
        library={library}
        setSongToView={setSongToView}
      />}
    </div>
  );
}

export default Home;
