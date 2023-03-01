import React from 'react';

import TagPopover from './TagPopover';
import {getAllTags} from './httpCalls';

const positioning = {
  anchorEl: null,
  anchorReference: 'none',
};

const booleanOps = [
  'AND', 'OR', 'BUT NOT',
];

/**
 * @param {boolean} open - if the popover is open or not
 * @param {function} setIsBuildingExpression - sets if the expression is being
 *                                             built (aka if the popover is
 *                                             open or not)
 * @return {JSX} thing
 */
function ExpressionTagAdder({open, expression, setExpression,
  setIsAddingTags}) {
  const [boolOpID, setBoolOpID] = React.useState(0);
  // id assigned to the new boolean opererator added to the expression
  const [tagsToSelect, setTagsToSelect] = React.useState([]);

  React.useEffect(() => {
    if (open) {
      let tags = booleanOps.map((op) => ({name: op, color: '#888888'}));
      getAllTags('TEST_USER_ID_1').then((obj) => {
        tags = tags.concat(obj.tags); // gets all tags in DB
        // ...
        setTagsToSelect(tags);
      });
    }
  }, [open]);

  /**
   * @param {array} newExpression - new array of tag objects to set the
   *                                expression to
   */
  const setTargetTags = (newExpression) => {
    setExpression(newExpression.map((tag) => (
      booleanOps.includes(tag.name) && !tag.id ?
        {...tag, id: boolOpID} :
        tag
    )));
    setBoolOpID(boolOpID+1);
  };


  return (
    <TagPopover
      open={open}
      tagsToSelect={tagsToSelect}
      setTagsToSelect={setTagsToSelect}
      targetsTags={expression}
      setTargetsTags={setTargetTags}
      setIsAddingTags={setIsAddingTags}
      positioning={positioning}
    />
  );
}

export default ExpressionTagAdder;
