import React from 'react';

import './Home.css';
import TopBar from './TopBar.jsx';
import Library from './Library.jsx';
import SongCard from './SongCard.jsx';
import SearchResults from './SearchResults.jsx';
import SortModal from './SortModal.jsx';
import SearchBar from './SearchBar.js';

import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';

import {emptySong} from './emptySong.js';
import {fakeTags} from './fakeTags.js';
import {ThemeProvider} from '@mui/material/styles';
import {theme} from './Theme.js';

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
    // song.tags = [];
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

  // console.log(`accessToken: ${accessToken}`);

  let data = await result.json();
  // console.log(`data: ${data}`);
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
  const [updatedLib, setUpdatedLib] = React.useState([]);
  const [userid, setUserid] = React.useState('');
  const [clickedTrackURI, setClickedTrackURI] = React.useState('');
  const [playingTrackID, setPlayingTrackID] = React.useState('');
  const [songToView, setSongToView] = React.useState(emptySong);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expression, setExpression] = React.useState([]);

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
    getUserInfo();
    getSearch(accessToken, refreshToken, setAccessToken, 'cool').then(
      (result) => {
        setLibrary(result.tracks.items);
      });
  }, [refreshToken, accessToken]);
  // get getSearch finishes (async), sets library to those search results
  // called twice, once at page startup, another when we get the token

  /**
   * Async function that sets the user ID
   */
  const getUserInfo = async () => {
    // get current user info
    const userInfo = await (await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + accessToken},
    })).json();
    setUserid(userInfo.id);
  };

  /**
   * Called when clicking on a <tr> representing a song in the library.
   *
   * @param {object} event - contains things like the element that was
   *                         clicked on
   */
  const clickedOnSong = ((event) => {
    console.log(`Home: clicked on track`);
    console.log(`   clickedTrackURI: ${event.currentTarget.title}`);
    setClickedTrackURI(event.currentTarget.title);
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
    event.stopPropagation();
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

  const logout = async () => {
    // tokens
    setAccessToken('');
    setRefreshToken('');

    // store each song in the library to db
    for (const song of library) {
      await fetch(`http://localhost:3010/v0/tagsPost`, {
        // http get request to api.spotify.com/v1/search
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {userid: userid, spotifyid: song.id,
            tags: song.tags}),
      });
    }

    window.localStorage.removeItem('accessToken');
  };

  return (
    <div className="App">

      <TopBar
        expression={expression}
        setExpression={setExpression}
        accessToken={accessToken}
        clickedTrackURI={clickedTrackURI}
        setPlayingTrackID={setPlayingTrackID}
        updatedLib={updatedLib}
      />
      <div className="searchbar">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search a Song"
        />
      </div>
      <ThemeProvider theme={theme}>
        {!accessToken ?
          <IconButton href='http://localhost:3010/login' color= 'secondary'>
            <LoginIcon color= 'secondary'/>
          </IconButton>: <IconButton onClick={logout} color= 'secondary'>
            <LogoutIcon color= 'secondary'/></IconButton>}
        <IconButton onClick={refreshList} color= 'secondary'>
          <RefreshIcon color= 'secondary'/></IconButton>
      </ThemeProvider>
      {!Boolean(searchQuery) && <Library
        // ^ displays library if there is no searchQuery
        library={library}
        updatedLib={updatedLib}
        setUpdatedLib={setUpdatedLib}
        playingTrackID={playingTrackID}
        clickedOnSong={clickedOnSong}
        clickedOnTags={clickedOnTags}
        expression={expression}
      />}
      <SongCard
        songToView={songToView}
        setSongToView={setSongToView}
        library={library}
        setLibrary={setLibrary}
        closeCard={closeCard}
      />
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
      <SortModal library={library} setLibrary={setLibrary}/>
    </div>
  );
}

export default Home;
