import React from 'react';

import './Expression.css';
import ValidateExpression from './ValidateExpression';

/**
 * @param {array} expression - array of tag objects representing the current
 * @param {array} setExpression - sets the expression
 * @return {object} JSX
 */
function Expression({expression, setExpression}) {
  var validExpression = ValidateExpression(expression);

  // Removes tags from the expression when they are clicked.
  const removeExpression = ((event) => {
    setExpression(expression.filter((tag) =>
      tag.name !== event.currentTarget.textContent,
    ));
  });

  return (
    <div id="expression-container">
      <div 
        id="expression"
        style={{backgroundColor: validExpression ? '': '#c94f6d'}}
      >
        {expression.length === 0 ? 'Click to build expression...' :
          expression.map((tag) => (
            <div
              style={{backgroundColor: tag.color}}
              className="tagName"
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
