import React from 'react';

import Button from '@mui/material/Button';
import {ThemeProvider} from '@mui/material/styles';

import TagPopover from './TagPopover';
import {theme} from './Theme.js';
import {getAllTags} from './httpCalls.js';
import {storeSong} from './backendWrapper.js';

const positioning = {
  anchorEl: 'songcard',
  anchorOrigin: {
    vertical: 'center',
    horizontal: 'right',
  },
  transformOrigin: {
    vertical: 'center',
    horizontal: 'left',
  },
  width: '400px',
  height: '550px',
  anchorReference: null,
};

/*
 * Rows that go before the tagsToSelect in the table.
 */
const preRows = (
  <>
    <tr id='create-new-tag'>
      <td>
        <ThemeProvider theme={theme}>
          <Button
            id='create-new-tag-button'
            variant='contained'
          >
            Create new tag
          </Button>
        </ThemeProvider>
      </td>
    </tr>
  </>
);

/**
 * @param {boolean} isOpen - if the TagPopover is open or not
 * @param {string} userID - spotify ID of current user
 * @param {array} expression - list of tag objects representing the expression
 *                             that controls the library
 * @param {function} setExpression - sets expression
 * @param {function} setAddingTags - sets if tags are being added to the
 *                                   SongCard or not
 * @return {JSX} thing
 */
function SongTagAdder({isOpen, userID, songToView, setSongToView,
  library, setLibrary, setIsAddingTags}) {
  const [tagsToSelect, setTagsToSelect] = React.useState([]);
  const targetTitle = `${songToView.name} by ${songToView.artists[0].name}`;
  // ^ title on prospective tags to add to songs

  /*
   * When the SongTagAdder is opened, it getsAllTags in the database for the
   * specified user and puts it in tagsToSelect.
   */
  React.useEffect(() => {
    if (isOpen) {
      getAllTags(userID).then((obj) => {
        setTagsToSelect([...obj.tags]);
      });
    }
  }, [isOpen, songToView, userID]);

  /**
   * @param {array} newTags -
   */
  const addTagToSongInLibrary = (newTags) => {
    const newLibrary = library.map((newSong) => {
      if (newSong.id === songToView.id) {
        newSong.tags = newTags;
        setSongToView(newSong);
        return newSong;
      } else {
        return newSong;
      }
    });
    setLibrary(newLibrary);
  };

  /**
   * @param {array} newTags -
   */
  const addTagToSongFromSpotify = (newTags) => {
    const newSongToView = {...songToView, tags: newTags};
    setSongToView(newSongToView);
    setLibrary([...library, newSongToView]);
  };

  /**
   * Called when clicking on a tag to add to the target.
   *
   * Sets the tags of songToView and songToView inside library to newTags.
   *
   * @param {array} newTags - list of tags to set the viewed songs tags to
   */
  const setSongsTags = (newTags) => {
    const songInLibrary = library.find((song) => song.id === songToView.id);
    if (songInLibrary) {
      // console.log('addTagToSongInLibrary');
      addTagToSongInLibrary(newTags);
    } else {
      // console.log('addTagToSongFromSpotify');
      addTagToSongFromSpotify(newTags);
    }
  };

  /**
   *
   */
  const updateSongToViewInDB = () => {
    storeSong(userID, songToView);
  };

  return (
    <TagPopover
      isOpen={isOpen}
      tagsToSelect={tagsToSelect}
      setTagsToSelect={setTagsToSelect}
      targetTitle={targetTitle}
      targetsTags={songToView.tags}
      setTargetsTags={setSongsTags}
      setIsAddingTags={setIsAddingTags}
      preRows={preRows}
      positioning={positioning}
      updateSongToViewInDB={updateSongToViewInDB}
    />
  );
}

export default SongTagAdder;
