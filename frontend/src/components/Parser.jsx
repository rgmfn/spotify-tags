const Operations = {
  START: 'start',
  AND: 'and', // AND tag
  OR: 'or', // OR tag
  BUT_NOT: 'but not', // BUT NOT tag
};

/**
 * @param {string} tagName
 * @param {object} song
 * @param {object} song.tags
 * @return {object}
 */
function isTagInSong(tagName, song) {

  console.log('check Tag searching for: '+ tagName);
  console.log(song.tags);
  for (let i=0; i<song.tags.length; i++) { // for all tags in the song
    if (song.tags[i].name === tagName) { // if there's a match
      console.log('tag found: '+ tagName);
      return true;
    }
  }
  return false; // no match
}


/**
 * @return {object}
 */
function ParseExpression(song, expression) {
  let out = null; // output value, will be updated as we go
  let currOp = Operations.START; // current operation to execute between tags
  console.log(song);
  console.log(expression);
  if (expression === null) return null;

  // for all the tags in expression
  for (let i=0; i<expression.length; i++) {
    const tagName = expression[i].name; // we only need the string name

    if (i === 0) { // should only run once at the first tag
      out = isTagInSong(tagName, song); 
    } else if (Object.values(Operations).includes(tagName.toLowerCase())) { // if the tag is an op, store it
      currOp = tagName.toLowerCase(); // using to lowercase right now, meaning case doesn't matter.
    } else if (currOp === Operations.AND) {
      out = out && isTagInSong(tagName, song);
    } else if (currOp === Operations.OR) {
      out = out || isTagInSong(tagName, song);
    } else if (currOp === Operations.BUT_NOT) {
      out = out && !isTagInSong(tagName, song);
    }
  }
  return out;
}

export default ParseExpression;