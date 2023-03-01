import React from 'react';
import Popover from '@mui/material/Popover';
import {ThemeProvider} from '@mui/material/styles';

import './TagPopover.css';
import {darkTheme} from './darkTheme.js';
import SearchBar from './SearchBar';

/**
 * @param {boolean} open - if the popover is open
 * @param {array} tagsToSelect - list of tags user can select
 * @param {function} setTagsToSelect
 * @param {array} targetsTags - tag list of an object to append to
 * @param {function} setTargetsTags - set the state of the object we appended to
 * @param {boolean} setAddingTags - sets if the tags are being added to
 *                                  (aka if SongTagAdder popover is open);
 * @return {JSX} thing
 */
function TagPopover({open, tagsToSelect, setTagsToSelect,
  targetsTags, setTargetsTags, setAddingTags}) {
  const [tagSearchQuery, setTagSearchQuery] = React.useState('');
  const [filteredTags, setFilteredTags] = React.useState([]);

  React.useEffect(() => {
    if (tagSearchQuery === '') {
      setFilteredTags(tagsToSelect);
    } else {
      setFilteredTags(
        tagsToSelect.filter((tag) =>
          tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase()),
        ));
    }
  }, [tagSearchQuery, tagsToSelect]);

  /**
   * Called when clicking outside of the TagPopover.
   *
   * Sets tagSelection to an empty array (makes the Popover go away).
   */
  const closeTagPopover = () => {
    setTagsToSelect([]);
    setAddingTags(false);
  };

  /**
   * Called when clicking on a tag in the list of tags (tagsToSelect).
   *
   * Adds clicked tags to the target objects list of tags (targetsTags).
   * Target object will either be the expression or a song's tags.
   *
   * @param {object} tag
   */
  const clickedOnTag = ((tag) => {
    setTargetsTags([...targetsTags, tag]); // populate array with new value.
    // setTagSearchQuery('');
  });

  /**
   * Function to add the first tag found in search by
   * by pressing Enter.
   *
   * @param {event} e
   */
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      setTargetsTags([...targetsTags, filteredTags[0]]);
      setTagSearchQuery('');
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Popover
        open={open} // if no tags, nothing to display.
        onClose={closeTagPopover}
        onKeyDown={(e) => handleKeyDown(e)}
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
            borderCollapse: 'separate',
            borderSpacing: '10px',
          }}>
            <tbody>
              {filteredTags.length === 0 ?
                <tr><td>No tags match your search</td></tr> :
                filteredTags.map((tag) => (
                  <tr onClick={clickedOnTag(tag)}>
                    <td>
                      <div
                        style={{backgroundColor: tag.color}}
                        className="tagName"
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
