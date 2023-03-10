import React from 'react';

import SpotifyResults from './SpotifyResults.jsx';
import LibraryResults from './LibraryResults.jsx';

import './SearchResults.css';

/**
 * @param {object} props
 * @return {object} JSX
 */
function SearchResults(props) {
  return (
    <div id="results-container">
      <LibraryResults
        library={props.library}
        searchQuery={props.searchQuery}
        clickedOnSong={props.clickedOnSong}
      />
      <SpotifyResults
        searchQuery={props.searchQuery}
        accessToken={props.accessToken}
        setAccessToken={props.setAccessToken}
        refreshToken={props.refreshToken}
        refreshTokenFunc={props.refreshTokenFunc}
        clickedOnSong={props.clickedOnSong}
      />
    </div>
  );
};

export default SearchResults;
