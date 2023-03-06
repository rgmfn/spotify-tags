import React from 'react';

import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';

import Expression from './Expression.jsx';
import ExpressionTagAdder from './ExpressionTagAdder.jsx';
import Player from './Player.jsx';
import './TopBar.css';

/**
 * @param {*} props
 *
 * @return {object} JSX
 */
function TopBar(props) {
  const [isBuildingExpression, setIsBuildingExpression] = React.useState(false);
  // ^ sets if the expression is being built (aka if the popover is open or not)

  /**
   * Called when expression in clicked (but not the tags of the expression).
   *
   * If ctrl-clicked, deletes expression, otherwise begins expression building.
   *
   * @param {object} event
   */
  const clickedOnExpression = (event) => {
    if (event.ctrlKey) {
      props.setExpression([]);
    } else {
      setIsBuildingExpression(true);
    }
  };

  return (
    <div id="top-bar">
      <div>
        <IconButton onClick={props.setIsPickingTag} color= 'secondary'>
          <AddBoxIcon color= 'secondary'/>
        </IconButton>
      </div>
      { (props.accessToken !== '') && <Player
        accessToken={props.accessToken}
        clickedTrackURI={props.clickedTrackURI}
        setPlayingTrackID={props.setPlayingTrackID}
        updatedLib={props.updatedLib}/> }
      <Expression
        expression={props.expression}
        setExpression={props.setExpression}
        clickedOnExpression={clickedOnExpression}
      />
      <ExpressionTagAdder
        isOpen={isBuildingExpression}
        expression={props.expression}
        setExpression={props.setExpression}
        setIsAddingTags={setIsBuildingExpression}
        updatedLib={props.updatedLib}
      />
    </div>
  );
}

export default TopBar;
