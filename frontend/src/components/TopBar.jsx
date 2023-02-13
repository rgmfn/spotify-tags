import React from 'react';

import Expression from './Expression.jsx';
import './TopBar.css';

const fakeExpression = [
  {name: 'classical', color: '#ff0000'},
  {name: 'AND', color: '#888888'},
  {name: 'instrumental', color: '#00ff00'},
];

/**
 * @return {object} JSX
 */
function TopBar() {
  return (
    <div id="top-bar">
      <Expression
        expression={fakeExpression}
      />
    </div>
  );
}

export default TopBar;
