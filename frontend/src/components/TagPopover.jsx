import React from 'react';
import Popover from '@mui/material/Popover';
import {ThemeProvider} from '@mui/material/styles';

import './TagPopover.css';
import {darkTheme} from './darkTheme';
import {tagColors} from './tagColors';
import SearchBar from './SearchBar';

const boolOpColor = '#888888';

/**
 * Returns true if toFind is present in list.
 *
 * @param {object} toFind - tag object to find in list
 * @param {array} list - list of tag objects to search
 * @return {boolean} if toFind is in list
 */
const tagIsInList = (toFind, list) => {
  return list.some((tag) => (
    (tag.name === toFind.name) && !tag.id
  ));
};

/**
 * @param {boolean} isOpen - if the popover is open
 * @param {array} tagsToSelect - list of tags user can select
 * @param {function} setTagsToSelect
 * @param {string} targetTitle - titles when hovering over tags/ ops (string
 *                               is different when adding tags to songs v.
 *                               adding tags/ ops to expression)
 * @param {array} targetsTags - tag list of an object to append to
 * @param {function} setTargetsTags - set the state of the object we appended to
 * @param {boolean} setIsAddingTags - sets if the targets tags are being added
 *                                    to (aka if SongTagAdder popover is open)
 * @param {array} preRows - any extra rows to include before the standard tags
 * @param {object} positioning - provides information on where to display the
 *                               popover (declared in SongTagAdder.jsx)
 * @return {JSX} thing
 */
function TagPopover({isOpen, tagsToSelect, setTagsToSelect, targetTitle,
  targetsTags, setTargetsTags, setIsAddingTags,
  preRows, positioning}) {
  const [tagSearchQuery, setTagSearchQuery] = React.useState('');
  // ^ string used to query the tagsToSelect
  const [filteredTags, setFilteredTags] = React.useState([]);
  // ^ tagsToSelect - all tags in targetsTags and fitting tagSearchQuery
  const [boolOpID, setBoolOpID] = React.useState(1);
  // ^ id assigned to the new boolean opererator added to the expression
  //   needed so that boolean op tags with same name can be distinguished

  /*
   * Filtered out all tags in the targets tags. If the tagSearchQuery is not
   * empty, also filters out all tags that doesn't fit the tagSearchQuery.
   * Puts the result into filteredTags
   */
  React.useEffect(() => {
    let tagsToSelectFiltered = tagsToSelect.filter((tag) => (
      !tagIsInList(tag, targetsTags)
    ));

    if (tagSearchQuery !== '') {
      tagsToSelectFiltered = tagsToSelectFiltered.filter((tag) => (
        tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
      ));
    }

    setFilteredTags(tagsToSelectFiltered);
  }, [targetsTags, tagSearchQuery, tagsToSelect]);

  /**
   * Adds speicified tag to the target objects list of tags (targetsTags).
   * Target object will either be the expression or a song's tags.
   *
   * @param {object} tag
   */
  const addTagToTarget = ((tag) => {
    const tagToAdd = {...tag};
    if (tagToAdd.color === boolOpColor) {
      tagToAdd.id = boolOpID;
      setBoolOpID(boolOpID+1);
    }

    if (!tagIsInList(tagToAdd, targetsTags)) {
      setTargetsTags([...targetsTags, tagToAdd]);
      // ^ populate array with new value.
      setTagSearchQuery('');
    }
  });

  /**
   * Adds the tag object newTag to the list of tagsToSelect.
   *
   * @param {object} newTag - tag to add to the list of tagsToSelect
   */
  const createTag = ((newTag) => {
    newTag.name = newTag.name.toLowerCase();
    setTagsToSelect([...tagsToSelect, newTag]);
    addTagToTarget(newTag); // add to target
    // store song in DB
  });

  /**
   * If the tag doesn't exist yet, create the tag specified by tagSearchQuery.
   * If the tag does exist, add that tag specified by tagSearchQuery to the
   * target.
   */
  const clickedCreateTag = (() => {
    if (tagsToSelect.every((tag) => tagSearchQuery !== tag.name)) {
      createTag(
        {
          name: tagSearchQuery,
          color: tagColors[Math.floor(Math.random() * tagColors.length)],
          // ^ select random color from possible tagColors
        },
      );
    } else {
      addTagToTarget(tagsToSelect.find(
        (tag) => tag.name === tagSearchQuery,
      ));
    }
  });

  /*
   * When the TagPopover is opened, if the addTagRow button is visible, give
   * it the specified onClick function.
   *
   * Not great programming practice because is only used by the SongTagAdder,
   * but seemed less complicated.
   *
   * Not sure how to give create-new-tag its onClick and have that onClick
   * reference tagSearchQuery, so this seemed like the other option.
   */
  React.useEffect(() => {
    if (isOpen) {
      const addTagRow = document.getElementById('create-new-tag');
      if (
        addTagRow && tagSearchQuery !== '' &&
        !['and', 'or', 'but not'].includes(tagSearchQuery.toLowerCase())
      ) {
        addTagRow.onclick = () => {
          clickedCreateTag();
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, tagSearchQuery]);

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
    if (e.key === 'Enter' && filteredTags.length > 0) {
      setTargetsTags([...targetsTags, filteredTags[0]]);
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
        open={isOpen} // if no tags, nothing to display.
        onClose={closeTagPopover}
        onKeyDown={(e) => handleKeyDown(e)}
        anchorEl={
          positioning.anchorEl === 'songcard' ?
            document.getElementById('songcard-container') :
            null
        }
        anchorReference={positioning.anchorReference}
        anchorOrigin={positioning.anchorOrigin}
        transformOrigin={positioning.transformOrigin}
        style={{
          // top: '45px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: positioning.width,
          height: positioning.height,
        }}
      >
        <div id="search-bar">
          <SearchBar
            searchQuery={tagSearchQuery}
            setSearchQuery={setTagSearchQuery}
            placeholder="Search a Tag"
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
                  <tr
                    key={tag.name}
                    onClick={(event) => {
                      event.stopPropagation();
                      addTagToTarget(tag);
                    }}
                    title={`Add '${tag.name}' `
                      .concat(tag.color === '#888888' ? 'op' : 'tag')
                      .concat(' to ').concat(targetTitle)
                    }
                  >
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
