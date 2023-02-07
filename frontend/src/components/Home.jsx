import React from 'react';

import './Home.css';
import Library from './Library.jsx';
import SongCard from './SongCard.jsx';

const refreshTokenFunc = async (refreshToken, setAccessToken) => {
  const refresh = await fetch('http://localhost:3010/refresh_token?refresh_token=' + refreshToken);
  const refreshJson = await refresh.json();
  setAccessToken(refreshJson.access_token);
  return refreshJson.access_token;
};

const fakeTags = [
  {name: 'classical', color: '#dbc074'},
  {name: 'jazz', color: '#c94f6d'},
  {name: 'funk', color: '#81b29a'},
  {name: 'punk', color: '#719cd6'},
  {name: 'instrumental', color: '#9d79d6'},
  {name: 'folk', color: '#63cdcf'},
  {name: 'rock', color: '#f4a261'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'classical', color: '#dbc074'},
  {name: 'jazz', color: '#c94f6d'},
  {name: 'funk', color: '#81b29a'},
  {name: 'punk', color: '#719cd6'},
  {name: 'instrumental', color: '#9d79d6'},
  {name: 'folk', color: '#63cdcf'},
  {name: 'rock', color: '#f4a261'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'classical', color: '#dbc074'},
  {name: 'jazz', color: '#c94f6d'},
  {name: 'funk', color: '#81b29a'},
  {name: 'punk', color: '#719cd6'},
  {name: 'instrumental', color: '#9d79d6'},
  {name: 'folk', color: '#63cdcf'},
  {name: 'rock', color: '#f4a261'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'classical', color: '#dbc074'},
  {name: 'jazz', color: '#c94f6d'},
  {name: 'funk', color: '#81b29a'},
  {name: 'punk', color: '#719cd6'},
  {name: 'instrumental', color: '#9d79d6'},
  {name: 'folk', color: '#63cdcf'},
  {name: 'rock', color: '#f4a261'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'classical', color: '#dbc074'},
  {name: 'jazz', color: '#c94f6d'},
  {name: 'funk', color: '#81b29a'},
  {name: 'punk', color: '#719cd6'},
  {name: 'instrumental', color: '#9d79d6'},
  {name: 'folk', color: '#63cdcf'},
  {name: 'rock', color: '#f4a261'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'classical', color: '#dbc074'},
  {name: 'jazz', color: '#c94f6d'},
  {name: 'funk', color: '#81b29a'},
  {name: 'punk', color: '#719cd6'},
  {name: 'instrumental', color: '#9d79d6'},
  {name: 'folk', color: '#63cdcf'},
  {name: 'rock', color: '#f4a261'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'classical', color: '#dbc074'},
  {name: 'jazz', color: '#c94f6d'},
  {name: 'funk', color: '#81b29a'},
  {name: 'punk', color: '#719cd6'},
  {name: 'instrumental', color: '#9d79d6'},
  {name: 'folk', color: '#63cdcf'},
  {name: 'rock', color: '#f4a261'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'classical', color: '#dbc074'},
  {name: 'jazz', color: '#c94f6d'},
  {name: 'funk', color: '#81b29a'},
  {name: 'punk', color: '#719cd6'},
  {name: 'instrumental', color: '#9d79d6'},
  {name: 'folk', color: '#63cdcf'},
  {name: 'rock', color: '#f4a261'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'classical', color: '#dbc074'},
  {name: 'jazz', color: '#c94f6d'},
  {name: 'funk', color: '#81b29a'},
  {name: 'punk', color: '#719cd6'},
  {name: 'instrumental', color: '#9d79d6'},
  {name: 'folk', color: '#63cdcf'},
  {name: 'rock', color: '#f4a261'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'classical', color: '#dbc074'},
  {name: 'jazz', color: '#c94f6d'},
  {name: 'funk', color: '#81b29a'},
  {name: 'punk', color: '#719cd6'},
  {name: 'instrumental', color: '#9d79d6'},
  {name: 'folk', color: '#63cdcf'},
  {name: 'rock', color: '#f4a261'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'classical', color: '#dbc074'},
  {name: 'jazz', color: '#c94f6d'},
  {name: 'funk', color: '#81b29a'},
  {name: 'punk', color: '#719cd6'},
  {name: 'instrumental', color: '#9d79d6'},
  {name: 'folk', color: '#63cdcf'},
  {name: 'rock', color: '#f4a261'},
  {name: 'metal', color: '#d67ad2'},
  {name: 'metal', color: '#d67ad2'},
];

const insertTestingTags = (songs) => {
  for (const song of songs.tracks.items) {
    song.tags = fakeTags;
  }

  return songs;
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

  let data = await result.json();
  data = insertTestingTags(data);
  return data;
};

const emptySong = {
  'album': {'images': [{'url': ''}]},
  'artists': [{'name': ''}],
  'available_markets': [],
  'disc_number': 0,
  'duration_ms': 0,
  'explicit': true,
  'external_ids': {},
  'external_urls': {},
  'href': '',
  'id': '',
  'is_local': false,
  'name': '',
  'popularity': 0,
  'preview_url': '',
  'track_number': 0,
  'type': '',
  'uri': '',
  'tags': [{'name': '', 'color': ''}],
};

// needed for making songcard show up
// const getSong = async (accessToken, refreshToken, setAccessToken, id) => {
//   if (!id) {
//     return emptySong;
//   }

//   const result = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
//     // http get request to api.spotify.com/v1/search
//     method: 'GET',
//     headers: {'Authorization': 'Bearer ' + accessToken},
//   });

//   if (!result.ok) {
//     return emptySong;
//   }

//   const data = await result.json();
//   data.tags = fakeTags;
//   return data;
// };

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
  const [songToView, setSongToView] = React.useState(emptySong);

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
    console.log(`clicked song ${event.currentTarget.id}`);
    // above event.currentTarget.id is the Spotify ID of the song
    // event.currentTarget is the thing with the onClick (the tr for the song)
  });

  // for when clicking on a song in the list of songs on spotify or in library
  // getSong(accessToken, refreshToken,
  //   setAccessToken, event.currentTarget.id).then((song) => {
  //   setSongToView(song);
  // });


  const handleClick = () => {
    setIsPlaying(!isPlaying);
    // code to play or pause music here
    // called when the button is clicked,triggers the play or pause of the music
  };

  const closeCard = () => {
    setSongToView(emptySong);
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
      <SongCard
        song={songToView}
        closeCard={closeCard}
      />
      <div className="play-button-container">
        <button className="play-button" onClick={handleClick}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
}

export default Home;
