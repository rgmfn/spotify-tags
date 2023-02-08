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
function SearchResults({searchQuery}) {
  return (
    <ThemeProvider theme={darkTheme}>
      <Popover
        open={Boolean(searchQuery)}
        anchorReference='none'
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div id="results-container">
          <SpotifyResults />
          <LibraryResults />
        </div>
      </Popover>
    </ThemeProvider>
  );
};

export default SearchResults;
