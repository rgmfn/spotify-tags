const Operations = {
    START: 'start',
    AND: 'and', // AND tag
    OR: 'or', // OR tag
    BUT_NOT: 'but not', // BUT NOT tag
  };
  
/**
 * 
 * @param {object} expression 
 * @return {object}
 */
function ValidateExpression(expression) {
  console.log('Validating');

  for (let i=0; i<expression.length; i++) {
    const tagName = expression[i].name;
    let operandTag = Object.values(Operations).includes(tagName.toLowerCase());

    if (i % 2 == 0) { // on even tags
      if (operandTag){ // the tag should not be an operand
        return false;
      }
    }
    // check if expression is imcomplete
    // if (i + 1 === expression.length){ // if i + 1 == length incomplete expression.
    //   return(
    //     <h2 id='error message'>
    //       Error: Invalid Expression.{'\n'}
    //       Remove trailing boolean operator.
    //     </h2>
    //   );
    // }
    /**
     * check if operand tag is formated correctly,
     * not needed since tags are put into expression from
     * existing tags. 
     */
    // else { // Invalid Operation
    //   return(
    //     <h2 id='error message'>
    //       Error: Invalid Expression.{"\n"}
    //       "{tagName}" is not a valid boolean operator.
    //     </h2>
    //   );
    // }

  }
  return true;
}

export default ValidateExpression;
