import React from 'react';

import TagPopover from './TagPopover';
import {getAllTags} from './httpCalls';
import {artistAlbumTags} from './artistAlbumTags.js';

// where the TagPopover will be positioned
const positioning = {
  anchorEl: null,
  anchorReference: 'none',
};

const booleanOps = [
  'AND', 'OR', 'BUT NOT',
];

/**
 * @param {boolean} isOpen - if the popover is open or not
 * @param {array} expression - list of tag objects used to filter library
 * @param {function} setExpression - sets the expression
 * @param {function} setIsAddingTags - sets if the expression is being
 *                                             built (aka if the popover is
 *                                             open or not)
 * @param {array} library - list of song objects in library
 * @return {JSX} thing
 */
function ExpressionTagAdder({isOpen, expression, setExpression,
  setIsAddingTags, library}) {
  const [boolOpID, setBoolOpID] = React.useState(1);
  // ^ id assigned to the new boolean opererator added to the expression
  //   needed so that boolean op tags with same name can be distinguished
  const [tagsToSelect, setTagsToSelect] = React.useState([]);
  // ^ list of tags available to select in TagPopover

  /*
   * When the SongTagAdder is opened, it getsAllTags in the database for the
   * specified user and puts it in tagsToSelect. It also gets all artists and
   * albums of the songs in the library.
   */
  React.useEffect(() => {
    if (isOpen) {
      let tags = booleanOps.map((op) => ({name: op, color: '#888888'}));
      getAllTags('TEST_USER_ID_1').then((obj) => {
        tags = tags.concat(obj.tags); // gets all tags in DB
        tags = tags.concat(artistAlbumTags(library));
        setTagsToSelect(tags);
      });
    }
  }, [isOpen, library]);

  /**
   * Called when clicking on a tag to add to the target.
   *
   * Changes all boolean op tags without ids into bool op tags with IDs.
   * Puts the result in expression state.
   *
   * @param {array} newExpression - new array of tag objects to set the
   *                                expression to
   */
  const setExpressionGiveBoolOpsIDs = (newExpression) => {
    setExpression(newExpression.map((tag) => (
      booleanOps.includes(tag.name) && !tag.id ?
        {...tag, id: boolOpID} :
        tag
    )));
    setBoolOpID(boolOpID+1);
  };

  return (
    <TagPopover
      isOpen={isOpen}
      tagsToSelect={tagsToSelect}
      setTagsToSelect={setTagsToSelect}
      targetsTags={expression}
      setTargetsTags={setExpressionGiveBoolOpsIDs}
      setIsAddingTags={setIsAddingTags}
      positioning={positioning}
    />
  );
}

export default ExpressionTagAdder;
