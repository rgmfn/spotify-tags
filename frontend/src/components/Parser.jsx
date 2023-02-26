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
  for (let i=0; i<song.tags.length; i++) { // for all tags in the song
    if (song.tags[i].name === tagName) { // if there's a match
      return true;
    }
  }
  return false; // no match
}


/**
 * @param {object} song
 * @param {object} expression
 * @return {object}
 */
function parseExpression(song, expression) {
  let out = null; // output value, will be updated as we go
  let butnotOut = null; // output to use once but not tag has been seen
  let currOp = Operations.START; // current operation to execute between tags
  if (expression === null) return null;

  // for all the tags in expression
  for (let i=0; i<expression.length; i++) {
    const tagName = expression[i].name; // we only need the string name

    if (i === 0) { // should only run once at the first tag
      out = isTagInSong(tagName, song);
    } else if (Object.values(Operations).includes(tagName.toLowerCase())) { // if the tag is an op, store it
      currOp = tagName.toLowerCase(); // using to lowercase, meaning case doesn't matter.
    } else if (currOp === Operations.AND) {
      if (butnotOut != null) {
        butnotOut = butnotOut || isTagInSong(tagName, song);
      } else {
        out = out && isTagInSong(tagName, song);
      }
    } else if (currOp === Operations.OR) {
      if (butnotOut != null) {
        butnotOut = butnotOut || isTagInSong(tagName, song);
      } else {
        out = out || isTagInSong(tagName, song);
      }
    } else if (currOp === Operations.BUT_NOT) {
      butnotOut = isTagInSong(tagName, song);
    }
  }

  if (butnotOut != null) {
    return out && !butnotOut;
  }
  return out;
}

export default parseExpression;
