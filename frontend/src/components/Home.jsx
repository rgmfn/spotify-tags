import React from 'react';

import './Home.css';

const clientId = '17276f6aa56b4f089a6321b0b6176513';
const clientSecret = '11cacfe4f6e64634a7097fecccbd356a';

const getToken = async () => {
  const result = await fetch('https://accounts.spotify.com/api/token', {
    // http post request, format specified by spotify
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
    },
    body: 'grant_type=client_credentials',
  });

  const data = await result.json();
  return data.access_token;
};

const getSearch = async (token, query) => {
  const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=20`, {
    // http get request to api.spotify.com/v1/search
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + token},
  });

  const data = await result.json();
  return data;
};

/**
 * @return {object} JSX
 */
function Home() {
  const [token, setToken] = React.useState(null);
  const [library, setLibrary] = React.useState([]);

  React.useEffect(() => {
    getToken().then((newToken) => {
      setToken(newToken);
    });
  }, []);
  // when getToken finishes (async), sets token to that token

  React.useEffect(() => {
    getSearch(token, 'cool').then((result) => {
      setLibrary(result.tracks.items);
    });
  }, [token]);
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

  const [isPlaying, setIsPlaying] = React.useState(false);
  // used to keep track of the current playing status 'isPlaying'
  const handleClick = () => {
    setIsPlaying(!isPlaying);
    // code to play or pause music here
    // called when the button is clicked,triggers the play or pause of the music
  };

  return (
    <><table>
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
                    className="songImg" />
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
    </div></>
  );
}

export default Home;
