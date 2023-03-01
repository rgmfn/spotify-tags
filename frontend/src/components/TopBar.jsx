import React from 'react';

import Expression from './Expression.jsx';
import ExpressionTagAdder from './ExpressionTagAdder.jsx';
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
  const [isBuildingExpression, setIsBuildingExpression] = React.useState(false);

  /**
   * @param {object} event
   */
  const clickedOnBar = (event) => {
    if (event.ctrlKey) {
      props.setExpression([]);
    } else {
      setIsBuildingExpression(true);
    }
  };

  return (
    <div id="top-bar">
      <div />
      <Expression
        expression={props.expression}
        setExpression={props.setExpression}
        clickedOnBar={clickedOnBar}
      />
      { (props.accessToken !== '') && <Player
        accessToken={props.accessToken}
        clickedTrackURI={props.clickedTrackURI}
        setPlayingTrackID={props.setPlayingTrackID}
        updatedLib={props.updatedLib}/> }
      <ExpressionTagAdder
        open={isBuildingExpression}
        expression={props.expression}
        setExpression={props.setExpression}
        setIsAddingTags={setIsBuildingExpression}
      />
    </div>
  );
}

export default TopBar;
