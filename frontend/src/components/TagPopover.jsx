import React from 'react';
import Popover from '@mui/material/Popover';
import {ThemeProvider} from '@mui/material/styles';

import './TagPopover.css';
import {darkTheme} from './darkTheme';
import {tagColors} from './tagColors';
import SearchBar from './SearchBar';

/**
 * Returns true if toFind is present in list.
 *
 * @param {object} toFind - tag object to find in list
 * @param {array} list - list of tag objects to search
 * @return {boolean} if toFind is in list
 */
const tagIsInList = (toFind, list) => {
  return list.some((tag) => (
    tag.name === toFind.name && !tag.id
  ));
};

/**
 * @param {boolean} open - if the popover is open
 * @param {array} tagsToSelect - list of tags user can select
 * @param {function} setTagsToSelect
 * @param {array} targetsTags - tag list of an object to append to
 * @param {function} setTargetsTags - set the state of the object we appended to
 * @param {boolean} setAddingTags - sets if the tags are being added to
 *                                  (aka if SongTagAdder popover is open);
 * @param {array} preRows - any extra rows to include before the standard tags
 * @param {array} postRows - any extra rows not needed to be included after
 *                          the standard tags
 * @param {object} positioning - provides information on where to display the
 *                               popover (declared in SongTagAdder.jsx)
 * @return {JSX} thing
 */
function TagPopover({open, tagsToSelect, setTagsToSelect,
  targetsTags, setTargetsTags, setIsAddingTags,
  preRows, postRows, positioning}) {
  const [tagSearchQuery, setTagSearchQuery] = React.useState('');
  const [filteredTags, setFilteredTags] = React.useState([]);

  React.useEffect(() => {
    if (tagSearchQuery === '') {
      const tagsWithoutTargetsTags = tagsToSelect.filter((tag) => (
        !tagIsInList(tag, targetsTags)
      )); // dont include tags already in target
      setFilteredTags(tagsWithoutTargetsTags);
    } else {
      const tagsWithoutTargetsTags = tagsToSelect.filter((tag) =>
        tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase()) &&
        !tagIsInList(tag, targetsTags),
      );
      setFilteredTags(tagsWithoutTargetsTags);
      // dont include tags already in target
    }
  }, [targetsTags, tagSearchQuery, tagsToSelect]);

  /**
   * Called when clicking on a tag in the list of tags (tagsToSelect).
   *
   * Adds clicked tags to the target objects list of tags (targetsTags).
   * Target object will either be the expression or a song's tags.
   *
   * @param {object} tag
   */
  const clickedOnTag = ((tag) => {
    if (targetsTags.every((targTag) => targTag.name !== tag.name)) {
      setTargetsTags([...targetsTags, tag]); // populate array with new value.
      setTagSearchQuery('');
    }
  });


  React.useEffect(() => {
    if (open) {
      const addTagRow = document.getElementById('create-new-tag');
      if (addTagRow && tagSearchQuery !== '') {
        addTagRow.onclick = () => {
          const newTag = {
            name: tagSearchQuery,
            color: tagColors[Math.floor(Math.random() * tagColors.length)],
          };
          if (tagsToSelect.every((tag) => tagSearchQuery !== tag.name)) {
            setTagsToSelect([...tagsToSelect, newTag]);
            // ^ add to list of choices
            clickedOnTag(newTag); // add to target
            // TODO put tag in database
          } else {
            clickedOnTag(tagsToSelect.find(
              (tag) => tag.name === tagSearchQuery,
            )); // add to target
          }
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tagSearchQuery]);

  /**
   * Called when clicking outside of the TagPopover.
   *
   * Sets tagSelection to an empty array (makes the Popover go away).
   */
  const closeTagPopover = () => {
    setTagsToSelect([]);
    setIsAddingTags(false);
  };

  /**
   * Function to add the first tag found in search by
   * by pressing Enter.
   *
   * @param {event} e
   */
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      if (tagSearchQuery === '') {
        setTargetsTags([...targetsTags, filteredTags[2]]);
      } else {
        setTargetsTags([...targetsTags, filteredTags[0]]);
      }
      setTagSearchQuery('');
    } else if (e.key === 'Delete' && e.ctrlKey) {
      const tempTargetsTags = [...targetsTags];
      tempTargetsTags.pop();
      setTargetsTags(tempTargetsTags);
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Popover
        open={open} // if no tags, nothing to display.
        onClose={closeTagPopover}
        onKeyDown={(e) => handleKeyDown(e)}
        anchorEl={
          positioning.anchorEl === 'songcard' ?
            document.getElementById('songcard-container') :
            'none'
        }
        anchorReference={positioning.anchorReference}
        anchorOrigin={positioning.anchorOrigin}
        transformOrigin={positioning.transformOrigin}
        style={{
          // top: '45px',
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
              {preRows}
              {filteredTags.length === 0 ?
                <tr><td>No tags match your search</td></tr> :
                filteredTags.map((tag) => (
                  <tr onClick={(event) => {
                    event.stopPropagation();
                    clickedOnTag(tag);
                  }}>
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
