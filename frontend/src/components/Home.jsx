import React from 'react';

import './Home.css';
import TopBar from './TopBar.jsx';
import Library from './Library.jsx';
import SongCard from './SongCard.jsx';
import SearchResults from './SearchResults.jsx';
import SortModal from './SortModal.jsx';
import SearchBar from './SearchBar.js';
import TagSelector from './TagSelector';

import {emptySong} from './emptySong.js';
import {fakeTags} from './fakeTags.js';
import {getSong} from './httpCalls';
import {storeSong, retrieveAllSongs, removeSong} from './backendWrapper.js';
import getTrack from './getTrack.js';

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
  const [clickedTrackID, setClickedTrackID] = React.useState('');
  const [playingTrackID, setPlayingTrackID] = React.useState('');
  const [songToView, setSongToView] = React.useState(emptySong);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expression, setExpression] = React.useState([]);
  const [isPickingTag, setIsPickingTag] = React.useState(false);
  const [selectedTag, setSelectedTag] = React.useState(null);

  /**
   * TODO
   */
  React.useEffect(() => {
    const hash = window.location.hash;
    console.log(`hash: ${hash}`);
    let accessToken = window.localStorage.getItem('accessToken');
    let refreshToken = window.localStorage.getItem('refreshToken');
    console.log('hash:', hash);

    if (!refreshToken && hash) {
      refreshToken = hash.substring(1).split('&').find((elem) =>
        elem.startsWith('refresh_token')).split('=')[1];
    }
    console.log(`refreshToken: ${refreshToken}`);

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
   * When the refreshToken or accessToken change, get the library from
   * the database.
   */
  React.useEffect(() => {
    if (accessToken) {
      /**
       */
      async function fillLibrary() {
        const userid = 'TEST_USER_ID_1';
        const tmpLib = [];
        const data = await retrieveAllSongs(userid);
        // console.log('wat', data.songs);
        for (const song of data.songs) {
          const track = await getTrack(song.spotifyid, accessToken);
          track.tags = song.tags;
          tmpLib.push(track);
          if (tmpLib.length === data.songs.length) {
            console.log(tmpLib);
            setLibrary(tmpLib);
          }
        }
      }

      fillLibrary();
    }
  }, [refreshToken, accessToken]);
  // get getSearch finishes (async), sets library to those search results
  // called twice, once at page startup, another when we get the token

  /**
   * Called when clicking on a <tr> representing a song in the library.
   *
   * @param {object} songID - spotify id of song clicked on
   */
  const clickedOnSong = ((songID) => {
    console.log(`Home: clicked on track`);
    console.log(`   clickedTrackID: ${songID}`);
    setClickedTrackID(songID);
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

  const getUserID = async () => {
    const userInfo = await (await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + accessToken},
    })).json();
    return userInfo.id;
  };

  /**
   * Called when clicking outside of the SongCard.
   *
   * Sets songToView to an empty song object (makes the SongCard go away).
   */
  const closeCard = () => {
    if (songToView.tags.length <= 0) {
      setLibrary(library.filter((libSong) => (
        libSong.id !== songToView.id
      )));
      // TODO use userID state
      getUserID().then((userid) => {
        removeSong(userid, songToView);
      });
    }
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
   * Called when clicking on a song in either SearchResults and there is a
   * selectedTag.
   *
   * On click of a song, adds selectedTag to that song's list of tags.
   * If it was not already in it, add it to the library.
   *
   * @param {string} id - the spotify ID of the song to display
   */
  const addTagToSong = (id) => {
    const songInLib = library.find((song) => (
      song.id === id
    ));

    if (songInLib) {
      // if song doesn't already have this tag
      if (!songInLib.tags.some((tag) => tag === selectedTag)) {
        // populate tags with new tag.
        songInLib.tags = [...songInLib.tags, selectedTag];
      }
      setLibrary([...library]);
    } else {
      getSong(accessToken, refreshToken, setAccessToken,
        refreshTokenFunc, id).then((song) => {
        song.tags = [selectedTag];
        library.push(song);
        setLibrary([...library]);
      });
    }
  };

  /**
   * Called when clicking on a song in either SearchResults and there is no
   * selectedTag.
   *
   * If the song is in the library, it displays that song, otherwise it gets
   * the song object off of spotify and displays that (in a SongCard).
   *
   * @param {string} id - the spotify ID of the song to display
   */
  const displaySong = (id) => {
    const songInLib = library.find((song) => (
      song.id === id
    ));

    if (songInLib) {
      setSongToView(songInLib);
    } else {
      getSong(accessToken, refreshToken, setAccessToken,
        refreshTokenFunc, id).then((song) => {
        setSongToView(song);
      });
    }
  };

  const logout = async () => {
    // tokens
    setAccessToken('');
    setRefreshToken('');

    // get current user info
    const userInfo = await (await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + accessToken},
    })).json();
    const userid = userInfo.id;
    // TODO in sprint4: make userID into state

    // store each song in the library to db
    for (const song of library) {
      storeSong(userid, song);
    }

    window.localStorage.removeItem('accessToken');
  };

  return (
    <div className="App">

      <TopBar
        expression={expression}
        setExpression={setExpression}
        accessToken={accessToken}
        refreshList={refreshList}
        logout={logout}
        setPlayingTrackID={setPlayingTrackID}
        updatedLib={updatedLib}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        setIsPickingTag={setIsPickingTag}
        setSearchQuery={setSearchQuery}
        clickedTrackID={clickedTrackID}
        library={library}
      />
      <div className="searchbar">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search a Song"
        />
      </div>
      {!Boolean(searchQuery || selectedTag) && <Library
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
      {Boolean(searchQuery || selectedTag) && <SearchResults
        // ^ displays library if there is a searchQuery
        searchQuery={searchQuery}
        accessToken={accessToken}
        setAccessToken={setAccessToken}
        refreshToken={refreshToken}
        refreshTokenFunc={refreshTokenFunc}
        library={library}
        setIsPickingTag={setIsPickingTag}
        clickedOnSong={selectedTag ?
          addTagToSong : displaySong
        }
      />}
      <TagSelector
        isOpen={isPickingTag}
        setSelectedTag={setSelectedTag}
        setIsPickingTag={setIsPickingTag}
      />
      <SortModal library={library} setLibrary={setLibrary}/>
    </div>
  );
}

export default Home;
