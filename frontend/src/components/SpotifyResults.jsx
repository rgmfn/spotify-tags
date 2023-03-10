import React from 'react';

import {emptySong} from './emptySong.js';
import {getSearchByURL, getSearch} from './httpCalls.js';

const noResults = (
  <tr>
    <td></td>
    <td>No query to search</td>
    <td></td>
  </tr>
);

/**
 * @return {object} JSX
 */
function SpotifyResults({searchQuery, accessToken, setAccessToken,
  refreshToken, refreshTokenFunc, clickedOnSong}) {
  const [songList, setSongList] = React.useState([emptySong]);
  const [nextSongsURL, setNextSongsURL] = React.useState([]);
  // nextSongsURL used for tracking the next group of songs when clicking
  //    to get for more songs at the bottom of the search results

  /**
   * When the searchQuery changes, use getSearch to get a list of search
   * results from spotify fitting the new searchQuery.
   */
  React.useEffect(() => {
    if (searchQuery) {
      getSearch(accessToken, refreshToken, setAccessToken,
        refreshTokenFunc, searchQuery).then((results) => {
        setSongList(results.tracks.items);
        setNextSongsURL(results.tracks.next);
      });
    }
  }, [searchQuery, accessToken, setAccessToken,
    refreshToken, refreshTokenFunc]);

  /**
   * Called when clicking 'More results...' at the bottom of the results.
   *
   * Gets the next list of songs (using nextSongsURL) from Spotify fitting the
   * searchQuery. Adds that next list of songs to the current list of displayed
   * songs.
   */
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
          {!Boolean(searchQuery) ? noResults : songList.map(
            (result) => (
              <tr
                id={result.id}
                key={result.id}
                onClick={() => clickedOnSong(result.id)}
                // eslint-disable-next-line max-len
                title={`View song details about ${result.name} by ${result.artists[0].name}`}
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
          {!Boolean(searchQuery) ? null :
            <tr id="more-results" onClick={clickedMoreResults}>
              <td/>
              <td/>
              <td>More results...</td>
              <td/>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
};

export default SpotifyResults;
