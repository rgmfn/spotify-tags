import React from 'react';

import Expression from './Expression.jsx';
import Player from './Player.jsx';
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
      <div />
      <Expression
        expression={props.expression}
        setExpression={props.setExpression}
      />
      { (props.accessToken !== '') && <Player
        accessToken={props.accessToken}
        clickedTrackURI={props.clickedTrackURI}
        updatedLib={props.updatedLib}}/> }
    </div>
  );
}

export default TopBar;
