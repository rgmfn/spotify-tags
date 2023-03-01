import React from 'react';

import TagPopover from './TagPopover';
import {getAllTags} from './httpCalls.js';

import './SongTagAdder.css';

const positioning = {
  anchorEl: 'songcard',
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'right',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  anchorReference: null,
};

/**
 * @param {boolean} open - if the TagPopover is open or not
 * @param {string} userID - spotify ID of current user
 * @param {array} expression - list of tag objects representing the expression
 *                             that controls the library
 * @param {function} setExpression - sets expression
 * @param {function} setAddingTags - sets if tags are being added to the
 *                                   SongCard or not
 * @return {JSX} thing
 */
function SongTagAdder({open, userID, songToView, setSongToView,
  library, setLibrary, setIsAddingTags}) {
  const [tagsToSelect, setTagsToSelect] = React.useState([]);

  React.useEffect(() => {
    if (open) {
      getAllTags('TEST_USER_ID_1').then((obj) => {
        setTagsToSelect(obj.tags);
      });
    }
  }, [open, songToView]);

  /*
   * Rows that go before the tagsToSelect in the table.
   */
  const preRows = (
    <>
      <tr id='create-new-tag'>
        <td>Create new tag</td>
      </tr>
    </>
  );

  /**
   * Called when clicking on a tag to add to the target.
   *
   * @param {array} newTags - list of tags to set the viewed songs tags to
   */
  const setTargetsTags = (newTags) => {
    const newLibrary = library.map((newSong) => {
      if (newSong.id === songToView.id) {
        newSong.tags = newTags;
        setSongToView(newSong);
        return newSong;
      } else {
        return newSong;
      }
    });
    setLibrary(newLibrary);
  };

  return (
    <TagPopover
      open={open}
      tagsToSelect={tagsToSelect}
      setTagsToSelect={setTagsToSelect}
      targetsTags={songToView.tags}
      setTargetsTags={setTargetsTags}
      setIsAddingTags={setIsAddingTags}
      preRows={preRows}
      positioning={positioning}
    />
  );
}

export default SongTagAdder;
