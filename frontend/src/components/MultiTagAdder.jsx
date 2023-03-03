import React from 'react';
import Popover from '@mui/material/Popover';
import {ThemeProvider} from '@mui/material/styles';

import {darkTheme} from './darkTheme';

/**
 * @param {boolean} isOpen - if the popover is open
 * @return {JSX} thing
 */
function MultiTagAdder({isOpen}) {
  const closeMultiTagAdder = () => {

  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Popover
        open={isOpen || true} // if no tags, nothing to display.
        onClose={closeMultiTagAdder}
        anchorReference='none'
        style={{
          // top: '45px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div id="popover-container">
          <div id="top-half">
            <div id="left-half"></div>
            <div id="right-half"></div>
          </div>
          <div id="bottom-half"></div>
        </div>
      </Popover>
    </ThemeProvider>
  );
}

export default MultiTagAdder;
