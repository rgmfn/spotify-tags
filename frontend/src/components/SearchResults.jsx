import React from 'react';
import Popover from '@mui/material/Popover';
import {ThemeProvider} from '@mui/material/styles';

import {darkTheme} from './darkTheme.js';
import SpotifyResults from './SpotifyResults.jsx';
import LibraryResults from './LibraryResults.jsx';

import './SearchResults.css';

/**
 * @return {object} JSX
 */
function SearchResults(props) {
  return (
    <ThemeProvider theme={darkTheme}>
      <Popover
        open={Boolean(props.searchQuery)}
        anchorReference='none'
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div id="results-container">
          <SpotifyResults />
          <LibraryResults
            searchQuery={props.searchQuery}
            library={props.library}
          />
        </div>
      </Popover>
    </ThemeProvider>
  );
};

export default SearchResults;
