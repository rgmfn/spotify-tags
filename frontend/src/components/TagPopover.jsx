import React from 'react';
import Popover from '@mui/material/Popover';
import {ThemeProvider} from '@mui/material/styles';

import './TagPopover.css';
import {darkTheme} from './darkTheme.js';
import SearchBar from './SearchBar';

/**
 * 
 * @param {array} tags - list of tags user can select
 * @param {function} closeTagPopover
 * @param {array} objectTags - Tag list of an object to append to.
 * @param {function} setState - set the state of the object we appended to.
 * @returns 
 */
function TagPopover({tags , closeTagPopover, objectTags, setState}){
  const [tagSearchQuery, setTagSearchQuery] = React.useState('');

  
  const filteredTags = (tagSearchQuery === '') ? tags : tags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase()),
  );

  const clickedOnTag = ((tag) => {
    objectTags.push(tag);
    setState([...objectTags]); // populate array with new value.
  });

  return(
    <ThemeProvider theme={darkTheme}>
      {console.log(tags.length)}
        <Popover
        open={Boolean(tags.length)} // if no tags, nothing to display.
        onClose={closeTagPopover}
        anchorReference='none'
        style={{
          top: '45px',
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
            <table style={{
            borderCollapse: "separate",
            borderSpacing: "10px"
            }}>
              <tbody>
                {filteredTags.length === 0 ?
                <tr><td>No tags match your search</td></tr> : filteredTags.map(
                (tag) => (
                  <tr
                  onClick={((event) => clickedOnTag(tag))}
                  >
                    <td>
                      <div
                        style={{backgroundColor: tag.color}}
                        className="tagName"
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