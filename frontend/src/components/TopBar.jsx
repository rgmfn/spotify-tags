import React from 'react';

import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';

import ExpressionTagAdder from './ExpressionTagAdder.jsx';
import VolumeControl from './VolumeControl';
import Expression from './Expression.jsx';
import SortModal from './SortModal.jsx';
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
  const [playerVolume, setPlayerVolume] = React.useState(50);
  const [player, setPlayer] = React.useState(undefined);

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
            <IconButton
              href='http://localhost:3010/login'
              color= 'secondary'
              title='Log in'
            >
              <LoginIcon color= 'secondary'/></IconButton>:
            <IconButton
              onClick={props.logout}
              color= 'secondary'
              title='Log out'
            >
              <LogoutIcon color= 'secondary'/></IconButton>}
          {Boolean(props.selectedTag) ?
            null :
            <IconButton
              onClick={() => props.setIsPickingTag(true)}
              title='Click to select a tag to add to songs'
            >
              <AddBoxIcon color='secondary'
              />
            </IconButton>
          }
          <VolumeControl
            playerVolume={playerVolume}
            setPlayerVolume={setPlayerVolume}
            player={player}
          />
        </ThemeProvider>
        <SortModal library={props.library} setLibrary={props.setLibrary}/>
      </div>
      <div id="player-container">
        { Boolean(props.accessToken) && <Player
          accessToken={props.accessToken}
          clickedTrackID={props.clickedTrackID}
          setPlayingTrackID={props.setPlayingTrackID}
          setPlayer={setPlayer}
          updatedLib={props.updatedLib}/> }
      </div>
      <div id="top-right-container">
        {Boolean(props.selectedTag) ?
          <div
            style={{backgroundColor: props.selectedTag.color}}
            className="tagName"
            onClick={() => {
              props.setSelectedTag(null);
              props.setSearchQuery('');
            }}
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
        library={props.library}
      />
    </div>
  );
}

export default TopBar;
