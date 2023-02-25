import React from 'react';
import Popover from '@mui/material/Popover';
import {ThemeProvider} from '@mui/material/styles';

import './TagPopover.css';
import {darkTheme} from './darkTheme.js';
import SearchBar from './SearchBar';

/**
 * 
 * @param {object} tags
 * @param {function} closeTagPopover 
 * @returns 
 */
function TagPopover({tags , closeTagPopover}){
  const [tagSearchQuery, setTagSearchQuery] = React.useState('');

  const clickedOnTag = ((tag) => {
    closeTagPopover();
    return tag;
  });

  return(
    <ThemeProvider theme={darkTheme}>
      {console.log(tags.length)}
        <Popover
        open={Boolean(tags.length)} // if no tags, nothing to display.
        onClose={closeTagPopover}
        anchorReference='none'
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <div id="search-bar">
            <SearchBar
            searchQuery={tagSearchQuery}
            setSearchQuery={setTagSearchQuery}
            />
          </div>
          <div id="popover-container">
            <table
            style={{borderCollapse: "separate",
            borderSpacing: "10px"}}
            >
              <tbody>
                {tags.map((tag) => (
                  <tr>
                    <td>
                      <div
                        style={{backgroundColor: tag.color}}
                        className="tagName"
                        onClick={((event) => clickedOnTag(tag))}
                        // Remove tag from Expression if clicked.
                        // onClick={removeExpression}
                      >
                        {tag.name}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </Popover>
    </ThemeProvider>
  );
}

export default TagPopover;