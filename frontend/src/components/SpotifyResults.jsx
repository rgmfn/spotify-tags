import React from 'react';

import {emptySong} from './emptySong.js';
import {getSong, getSearch} from './httpCalls.js';

/**
 * @return {object} JSX
 */
function SpotifyResults({searchQuery, accessToken,
  setAccessToken, refreshToken, refreshTokenFunc, setSongToView}) {
  const [searchResults, setSearchResults] = React.useState([emptySong]);

  React.useEffect(() => {
    getSearch(accessToken, refreshToken, setAccessToken,
      refreshTokenFunc, searchQuery).then((results) => {
      setSearchResults(results.tracks.items);
    });
  }, [searchQuery, accessToken, setAccessToken,
    refreshToken, refreshTokenFunc]);

  const clickedOnSong = ((event) => {
    if (event.currentTarget.id) {
      getSong(accessToken, refreshToken, setAccessToken,
        refreshTokenFunc, event.currentTarget.id).then((song) => {
        console.log(song);
        setSongToView(song);
      });
    }
  });

  return (
    // css is in SearchResults.css, so it can apply to LibraryResults too
    <div className="search-results">
      <div className="results-title">
        Songs on Spotify
        <hr className="divider"/>
      </div>
      <table>
        <tbody>
          {searchResults.map((result) => (
            <tr
              id={result.id}
              uri={result.uri}
              onClick={clickedOnSong}
            >
              <td className="search-img-col">
                <div className="imgContainer">
                  <img
                    className="search-img"
                    src={result.album.images[0].url}
                    alt={'[' + result.album.name + ' img]'}
                  />
                </div>
              </td>
              <td className="search-name-col">
                {result.name}
              </td>
              <td className="search-artist-col">
                {result.artists[0].name}
              </td>
              <td className="search-album-col">
                {result.album.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpotifyResults;
