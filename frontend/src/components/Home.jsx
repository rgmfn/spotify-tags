import React from 'react';

import './Home.css';

// const clientId = '17276f6aa56b4f089a6321b0b6176513';
// const clientSecret = '11cacfe4f6e64634a7097fecccbd356a';
// const redirectURI = 'http://localhost:3000/';

// const CLIENT_SECRET = '11cacfe4f6e64634a7097fecccbd356a';

// const CLIENT_ID = '17276f6aa56b4f089a6321b0b6176513';
// const REDIRECT_URI = 'http://localhost:3000';
// const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
// const RESPONSE_TYPE = 'code';
// const SCOPES = 'user-read-playback-state user-modify-playback-state' +
// ' user-read-currently-playing streaming';

// const getToken = async () => {
//   console.log('hey');

//   const result = await fetch('http://localhost:8888/login', {
//     // http post request, format specified by spotify
//     method: 'GET',
//   });
//   console.log('hey2');
//   const data = await result.json();
//   console.log(data);
//   return data.access_token;
// };

const refreshTokenFunc = async (refreshToken, setAccessToken) => {
  const refresh = await fetch('http://localhost:3010/refresh_token?refresh_token=' + refreshToken);
  const refreshJson = await refresh.json();
  setAccessToken(refreshJson.access_token);
  return refreshJson.access_token;
};


const getSearch = async (accessToken, refreshToken, setAccessToken, query) => {
  // console.log('thing:', 'Bearer ' + token);

  console.log('getsearch run');

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

  // React.useEffect(() => {
  //   getToken().then((newToken) => {
  //     setToken(newToken);
  //   });
  // }, []);
  // when getToken finishes (async), sets token to that token

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
  }, [accessToken]);
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

      {/* {!token ?
        <a href={ // login button
          `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=
${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`
        }>Login to Spotify</a>: <button onClick={logout}>Logout</button>} */}

      {!accessToken ?
        <a href={ // login button
          `http://localhost:3010/login`
        }>Login to Spotify</a>: <button onClick={logout}>Logout</button>}
      <button onClick={refreshList}>Refresh List</button>
      <table>
        <tbody
        // tbody = table body
        >
          {library.length === 0 ?
            <tr><td>Loading...</td></tr> : library.map((song) => (
            // render 'Loading...' if the library isn't loaded
              <tr
              // tr = table row
                onClick={clickedOnSong}
                id={song.id} // sets row id to Spotify ID of song
                key={song.id}
              >
                <td className="imgCol"
                // td = table data (data cell)
                >
                  <div className="imgContainer">
                    <img
                      src={song.album.images[0].url}
                      alt={'[' + song.album.name + ' img]'}
                      className="songImg"
                    />
                  </div>
                </td>
                <td className="nameCol">
                  <div className="songName">
                    {song.name}
                  </div>
                </td>
                <td className="artistCol">
                  <div className="artistName">
                    {song.artists[0].name}
                  </div>
                </td>
                <td className="albumCol">
                  <div className="albumName">
                    {song.album.name}
                  </div>
                </td>
                <td className="tagCol">
                  <div className="tagName redTag">
                  Tag 1
                  </div>
                  <div className="tagName greenTag">
                  Tag 2
                  </div>
                  <div className="tagName blueTag">
                  Tag 3
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </table><div className="play-button-container">
      <button className="play-button" onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}

export default Home;
