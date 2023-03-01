import React from 'react';

import TagPopover from './TagPopover';
// import {getAllTags} from './httpCalls.js';

/**
 * TODO temporary until fetch to backend
 *
 * @param {string} id - id of user (fake data)
 * @return {array} ofTags
 */
const getAllTags = () => {
  return [
    {name: 'AND', color: '#888888'},
    {name: 'OR', color: '#888888'},
    {name: 'BUT NOT', color: '#888888'},
    {name: 'classical', color: '#c94f6d'},
    {name: 'instrumental', color: '#81b29a'},
    {name: 'guitar', color: '#719cd6'},
    {name: 'jazz', color: '#719cd6'},
  ];
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
function SongTagAdder({open, userID, expression,
  setExpression, setAddingTags}) {
  const [tagsToSelect, setTagsToSelect] = React.useState([]);

  React.useEffect(() => {
    if (open) {
      console.log('getting tags...');
      const tags = getAllTags();
      setTagsToSelect(tags);
    }
  }, [open]);

  return (
    <TagPopover
      open={open}
      tagsToSelect={tagsToSelect}
      setTagsToSelect={setTagsToSelect}
      targetsTags={expression}
      setTargetsTags={setExpression}
      setAddingTags={setAddingTags}
    />
  );
}

export default SongTagAdder;
