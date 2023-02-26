import React from 'react';

import Expression from './Expression.jsx';
import './TopBar.css';

/*
 * Used for the displaying the expression until expression building is
 * implemented.
 */

/**
 * @param {*} props
 *
 * @return {object} JSX
 */
function TopBar(props) {
  return (
    <div id="top-bar">
      <Expression
        expression={props.expression}
        setExpression={props.setExpression}
        clickedOnBar={props.clickedOnBar}
      />
    </div>
  );
}

export default TopBar;
