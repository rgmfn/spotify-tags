import React from 'react';

import TagPopover from './TagPopover';
import {getAllTags} from './httpCalls';

// where the TagPopover will be positioned
const positioning = {
  anchorEl: null,
  anchorReference: 'none',
};

/**
 * @param {boolean} isOpen -
 * @return {JSX}
 */
function TagSelector({isOpen, setSelectedTag, setIsPickingTag}) {
  const [tagsToSelect, setTagsToSelect] = React.useState([]);
  // ^ list of tags available to select in TagPopover

  /*
   * When the SongTagAdder is opened, it getsAllTags in the database for the
   * specified user and puts it in tagsToSelect. It also gets all artists and
   * albums of the songs in the library.
   */
  React.useEffect(() => {
    if (isOpen) {
      getAllTags('TEST_USER_ID_1').then((obj) => {
        setTagsToSelect(obj.tags); // gets all tags in DB
      });
    }
  }, [isOpen]);

  /**
   * Called by TagPopover, when clicking on a tag.
   *
   * Sets the selectedTag to be the one tag in the tags array.
   *
   * @param {array} tags - array with one tag
   */
  const setTargetsTags = (tags) => {
    if (tags.length <= 0) {
      return;
    }

    setSelectedTag(tags[0]);
    setIsPickingTag(false);
  };

  return (
    <TagPopover
      isOpen={isOpen}
      tagsToSelect={tagsToSelect}
      setTagsToSelect={setTagsToSelect}
      targetsTags={[]}
      setTargetsTags={setTargetsTags}
      setIsAddingTags={setIsPickingTag}
      positioning={positioning}
    />
  );
}

export default TagSelector;
