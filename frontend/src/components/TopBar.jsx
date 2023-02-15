import React from 'react';

import Expression from './Expression.jsx';
import './TopBar.css';

/*
 * Used for the displaying the expression until expression building is
 * implemented.
 */
const fakeExpression = [
  {name: 'classical', color: '#c94f6d'},
  {name: 'AND', color: '#888888'},
  {name: 'instrumental', color: '#81b29a'},
  {name: 'BUT NOT', color: '#888888'},
  {name: 'guitar', color: '#719cd6'},
];

/**
 * @param {array} expression - not passed in yet, will probably be passed in
 *                             from Home.jsx once you can build expressions
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
