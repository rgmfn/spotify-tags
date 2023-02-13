import React from 'react';

import {emptySong} from './emptySong.js';
import {getSong, getSearchByURL, getSearch} from './httpCalls.js';

// const emptyResults = {
//   tracks: {
//     items: [],
//   },
// };

/**
 * @return {object} JSX
 */
function SpotifyResults({searchQuery, accessToken,
  setAccessToken, refreshToken, refreshTokenFunc, setSongToView}) {
  const [songList, setSongList] = React.useState([emptySong]);
  // const [searchResults, setSearchResults] = React.useState([emptyResults]);
  const [nextSongsURL, setNextSongsURL] = React.useState([]);

  React.useEffect(() => {
    getSearch(accessToken, refreshToken, setAccessToken,
      refreshTokenFunc, searchQuery).then((results) => {
      setSongList(results.tracks.items);
      setNextSongsURL(results.tracks.next);
    });
  }, [searchQuery, accessToken, setAccessToken,
    refreshToken, refreshTokenFunc]);

  const clickedOnSong = ((event) => {
    if (event.currentTarget.id) {
      getSong(accessToken, refreshToken, setAccessToken,
        refreshTokenFunc, event.currentTarget.id).then((song) => {
        setSongToView(song);
      });
    }
  });

  const clickedMoreResults = (() => {
    getSearchByURL(accessToken, refreshToken, setAccessToken,
      refreshTokenFunc, nextSongsURL).then((results) => {
      setSongList(songList.concat(results.tracks.items));
      setNextSongsURL(results.tracks.next);
    });
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
          {songList.map(
            (result) => (
              <tr
                id={result.id}
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
          <tr id="more-results" onClick={clickedMoreResults}>
            <td/>
            <td/>
            <td>More results...</td>
            <td/>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SpotifyResults;
