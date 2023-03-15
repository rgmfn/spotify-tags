import React from 'react';

import IconButton from '@mui/material/IconButton';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

/**
 * @return {JSX}
 */
function VolumeControl({playerVolume, setPlayerVolume, player}) {
  /**
   * Called after mouse clicks 'Down' button.
   *
   * Lowers volume.
   */
  const lowerVolume = () => {
    console.log(`Toggled "Down" button to lower volume!`);

    player.getVolume().then((volume) => {
      volume *= 100;
      const pVolume = Math.round(volume - 5);

      if (pVolume >= 0) {
        player.setVolume(pVolume/100);
        setPlayerVolume(pVolume);
      } else {
        console.log(` Volume is already at minimum level; ` +
          `cannot go any lower!`);
      }
    });
  };

  /**
  * Called after mouse clicks 'Up' button.
  *
  * Raises volume.
  */
  const raiseVolume = () => {
    console.log(`Toggled "Up" button to raise volume!`);

    player.getVolume().then((volume) => {
      volume *= 100;
      const pVolume = Math.round(volume + 5);

      if (pVolume <= 100) {
        player.setVolume(pVolume/100);
        setPlayerVolume(pVolume);
      } else {
        console.log(` Volume is already at maximum level; ` +
          `cannot go any higher!`);
      }
    });
  };

  return (
    <div
      className="volume-control-container">
      <IconButton
        id='down-button'
        className='down-button'
        color='secondary'
        type='button'
        title='Lower volume'
        onClick={lowerVolume}
      >
        <VolumeDownIcon
          style={{fontSize: 30}}
          color='secondary'/>
      </IconButton>

      <p
        id="volume-display"
        className="volume-display"
      >
        Volume: {playerVolume}%
      </p>

      <IconButton
        id='up-button'
        className='up-button'
        color='secondary'
        type='button'
        title='Raise volume'
        onClick={raiseVolume}
      >
        <VolumeUpIcon
          style={{fontSize: 30}}
          color='secondary'/>
      </IconButton>
    </div>
  );
}

export default VolumeControl;
