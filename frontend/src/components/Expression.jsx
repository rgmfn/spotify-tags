import React from 'react';

import './Expression.css';
import validateExpression from './ValidateExpression';

/**
 * @param {array} expression - array of tag objects representing the current
 * @param {function} setExpression - sets the expression
 * @param {function} clickedOnExpression - called when clicking on the
 *                                         expression (but not the tags of the
 *                                         expression)
 * @return {object} JSX
 */
function Expression({expression, setExpression, clickedOnExpression}) {
  const [isValidExpression, setIsValidExpression] = React.useState(true);

  React.useEffect(() => {
    setIsValidExpression(validateExpression(expression));
  }, [expression]);

  // TODO can only put 1 AND or OR

  /**
   * Called when clicking on a tag in the expression.
   *
   * Removes tags from the expression when they are clicked.
   *
   * @param {object} tagToRemove - the tag to remove from the expression
   */
  const removeFromExpression = ((tagToRemove) => {
    const filtered = expression.filter((tag) =>
      tag.id ?
        tag.id !== tagToRemove.id :
        tag.name !== tagToRemove.name,
    );
    setExpression(filtered);
  });

  return (
    <div id="expression-container">
      <div
        id="expression"
        style={{backgroundColor: isValidExpression ? '': '#c94f6d'}}
        onClick={clickedOnExpression}
      >
        {expression.length === 0 ? 'Click to build expression...' :
          expression.map((tag) => (
            <div
              style={{backgroundColor: tag.color}}
              className="tagName"
              id={tag.id}
              title={tag.color === '#888888' ?
                `Remove '${tag.name}' op from expression` :
                `Remove '${tag.name}' tag from expression`
              }
              onClick={(event) => {
                event.stopPropagation();
                // ^ prevents click from hitting expression div
                removeFromExpression(tag);
              }}
            >
              {tag.name}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Expression;
