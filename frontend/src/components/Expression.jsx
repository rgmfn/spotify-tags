import React from 'react';

import './Expression.css';

/**
 * @param {array} expression - array of tag objects representing the current
 *                             expression
 * @return {object} JSX
 */
function Expression({expression}) {
  return (
    <div id="expression-container">
      <div id="expression">
        {expression.length === 0 ? 'Click to build expression...' :
          expression.map((tag) => (
            <div
              style={{backgroundColor: tag.color}}
              className="tagName"
            >
              {tag.name}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Expression;