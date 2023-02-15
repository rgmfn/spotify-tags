import React from 'react';

import './Expression.css';

/**
 * @param {array} expression - array of tag objects representing the current
 *                             expression
 * @return {object} JSX
 */
function Expression({expression}) {
  // New state to update the expression as tags are filtered.
  const [newExpression, setExpression] = React.useState(expression);
  // Removes tags from the expression when they are clicked.
  const removeExpression = ((event) => {
    setExpression(newExpression.filter((tag) =>
      tag.name !== event.currentTarget.textContent,
    ));
  });
  return (
    <div id="expression-container">
      <div id="expression">
        {newExpression.length === 0 ? 'Click to build expression...' :
          newExpression.map((tag) => (
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
