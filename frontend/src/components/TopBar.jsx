import React from 'react';

import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';

import Expression from './Expression.jsx';
import ExpressionTagAdder from './ExpressionTagAdder.jsx';
import Player from './Player.jsx';

import {ThemeProvider} from '@mui/material/styles';
import {theme} from './Theme.js';

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
      <div id="top-left-buttons">
        <ThemeProvider theme={theme}>
          {!props.accessToken ?
            <IconButton href='http://localhost:3010/login' color= 'secondary'>
              <LoginIcon color= 'secondary'/>
            </IconButton>:
            <IconButton onClick={props.logout}
              color= 'secondary'
            >
              <LogoutIcon color= 'secondary'/></IconButton>}
          <IconButton onClick={props.refreshList} color= 'secondary'>
            <RefreshIcon color= 'secondary'/></IconButton>
          {Boolean(props.selectedTag) ?
            null :
            <IconButton>
              <AddBoxIcon color='secondary'
                onClick={() => props.setIsPickingTag(true)}
                title='Click to select a tag'
              />
            </IconButton>
          }
        </ThemeProvider>
      </div>
      <div id="player-container">
        { (props.accessToken !== '') && <Player
          accessToken={props.accessToken}
          clickedTrackURI={props.clickedTrackURI}
          setPlayingTrackID={props.setPlayingTrackID}
          updatedLib={props.updatedLib}/> }
      </div>
      <div id="top-right-container">
        {Boolean(props.selectedTag) ?
          <div
            style={{backgroundColor: props.selectedTag.color}}
            className="tagName"
            onClick={() => props.setSelectedTag(null)}
          >
            {props.selectedTag.name}
          </div> :
          <Expression
            expression={props.expression}
            setExpression={props.setExpression}
            clickedOnExpression={clickedOnExpression}
          />
        }
      </div>
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
