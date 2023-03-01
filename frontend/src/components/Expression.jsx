import React from 'react';

import './Expression.css';
import validateExpression from './ValidateExpression';

/**
 * @param {array} expression - array of tag objects representing the current
 * @param {function} setExpression - sets the expression
 * @return {object} JSX
 */
function Expression({expression, setExpression, clickedOnBar}) {
  const validExpression = validateExpression(expression);

  // Removes tags from the expression when they are clicked.
  const removeExpression = ((event) => {
    event.stopPropagation();
    const filtered = expression.filter((tag) =>
      tag.id ?
        tag.id !== parseInt(event.currentTarget.id) :
        tag.name !== event.currentTarget.textContent,
    );
    setExpression(filtered);
  });

  return (
    <div id="expression-container">
      <div
        id="expression"
        style={{backgroundColor: validExpression ? '': '#c94f6d'}}
        onClick={clickedOnBar}
      >
        {expression.length === 0 ? 'Click to build expression...' :
          expression.map((tag) => (
            <div
              style={{backgroundColor: tag.color}}
              className="tagName"
              id={tag.id}
              // Remove tag from Expression if clicked.
              onClick={removeExpression}
            >
              {tag.name}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Expression;
