import React from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TagPopover from './TagPopover.jsx';
import {ThemeProvider} from '@mui/material/styles';

import {darkTheme} from './darkTheme';

import './MultiTagAdder.css';

/**
 * @param {boolean} isOpen - if the popover is open
 * @param {JSX} nameInfo - if album, name of album and artist (like
 *                         SongCard.jsx), if artist, name of artist
 * @param {JSX} image - HTML image tag associated with the artist/song
 * @param {function} addTags - adds an array of tags to the current song/album
 *                             and clears the current tagsToAdd
 * @param {function} removeTags - removes an array of tags from the current
 *                                song/album and clears the current tagsToRemove
 * @return {JSX}
 */
function MultiTagAdder({isOpen, nameInfo, image, addTags, removeTags}) {
  const [tagsToAdd, setTagsToAdd] = React.useState([]);
  const [tagsToRemove, setTagsToRemove] = React.useState([]);
  const [isAddingTags, setIsAddingTags] = React.useState(false);

  /**
   * TODO
   */
  const closeMultiTagAdder = () => {

  };

  /**
   * TODO
   */
  const clickedMakeChanges = () => {
    addTags(tagsToAdd, setTagsToAdd);
    removeTags(tagsToRemove, setTagsToRemove);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Popover
        open={isOpen || true} // if no tags, nothing to display.
        onClose={closeMultiTagAdder}
        anchorReference='none'
        style={{
          // top: '45px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div id="popover-container">
          <div id="top-half">
            <div id="left-half">
              {nameInfo}
            </div>
            <div id="right-half">
              {image}
            </div>
          </div>
          <div id="tags-to-add-container">
            <p>To Add</p>
            <div id="tags-to-add">
            </div>
          </div>
          <div id="tags-to-remove-container">
            <p>To Remove</p>
            <div id="tags-to-remove">
            </div>
          </div>
          <div id="make-changes-container">
            <Button
              variant='contained'
              onClick={clickedMakeChanges}
            >
              Make Changes
            </Button>
          </div>
          <TagPopover
            isOpen={isAddingTags}
            tagsToSelect={}
          />
        </div>
      </Popover>
    </ThemeProvider>
  );
}

export default MultiTagAdder;
