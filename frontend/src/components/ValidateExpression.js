const Operations = {
    START: 'start',
    AND: 'and', // AND tag
    OR: 'or', // OR tag
    BUT_NOT: 'but not', // BUT NOT tag
  };

/**
 * @param {object} expression
 * @return {object}
 */
function validateExpression(expression) {
  console.log('Validating');

  let butnotTag = false;
  for (let i=0; i<expression.length; i++) {
    const tagName = expression[i].name.toLowerCase();
    const operandTag = Object.values(Operations).includes(tagName);

    // on even tags
    if (i % 2 == 0 && operandTag) { // the tag should not be an operand
        return false;
    } else if (i % 2 == 1 && !operandTag) { // on odd tags it should
        return false;
    }

    if (tagName === Operations.BUT_NOT) {
      if (!butnotTag) {
        butnotTag = true; // if this is the first BUT NOT tag in expression
      } else { 
        return false; // there can't be two but not tags
      }
    }
  }
  return true;
}

export default validateExpression;
