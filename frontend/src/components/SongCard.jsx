import React from 'react';
import Popover from '@mui/material/Popover';
import AlbumIcon from '@mui/icons-material/Album';
import PersonIcon from '@mui/icons-material/Person';
import {ThemeProvider} from '@mui/material/styles';

import './SongCard.css';
import SongTagAdder from './SongTagAdder.jsx';
import {darkTheme} from './darkTheme.js';

/**
 * @param {object} songToView - the song being viewed in the SongCard, if
 *                              there is none, the SongCard does not show up
 * @param {function} setSongToView - sets the song being viewed in the SongCard,
 *                                   set to emptySong to make SongCard go away
 * @param {array} library - the current song library
 * @param {function} setLibrary - sets the current song library
 * @param {function} closeCard - called when clicking off of the SongCard
 * @param {function} expression - used inside SongTagAdder
 * @param {function} setExpression - used inside SongTagAdder
 * @return {object} JSX
 */
function SongCard({songToView, setSongToView, library,
  setLibrary, closeCard}) {
  const [isAddingTags, setIsAddingTags] = React.useState(false);

  /**
   * Called when clicked on the bottom half of the song card (technically the
   * 'bottom-half' element, not the 'tags-container' element).
   *
   * Sets isAddingTags to true, making the SongTagAdder appear.
   */
  const clickedOnTagContainer = (() => {
    setIsAddingTags(true);
  });

  /**
   * @param {object} event - event.currentTarget.textContent holds the
   *                         name of the tag to be removed
   * Removes the tag clicked from the song and from that song in the library.
   */
  const clickedOnTag = ((event) => {
    // TODO remove tag from database
    event.stopPropagation();
    const newTags = songToView.tags.filter((tag) =>
      tag.name !== event.currentTarget.textContent,
    );
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
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Popover
        id='songcard'
        open={Boolean(songToView.id)}
        onClose={closeCard}
        anchorReference='none'
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div id="songcard-container">
          <div id="top-half">
            <div id="left-half">
              <div id="name-container">
                <p id="songName" className="tagName">
                  {songToView.name}
                </p>
              </div>
              <div id="artist-container">
                <PersonIcon id="personIcon"/>
                <p id="artistName" className="tagName">
                  {songToView.artists[0].name}
                </p>
              </div>
              <div id="album-container">
                <AlbumIcon id="albumIcon"/>
                <p id="albumName" className="tagName">
                  {songToView.album.name}
                </p>
              </div>
            </div>
            <div id="right-half">
              <img
                src={songToView.album.images[0].url}
                alt={'[' + songToView.album.name + ' img]'}
                className="song-card-song-img"
              />
            </div>
          </div>
          <hr className="divider"/>
          <div id="bottom-half"
            onClick={clickedOnTagContainer}
            // eslint-disable-next-line max-len
            title={`Add tag to ${songToView.name} by ${songToView.artists[0].name}`}
          >
            <div id="tags-container">
              {!Boolean(songToView && songToView.tags) ?
                null :
                songToView.tags.map((tag) => (
                  <div
                    key={tag.name}
                    style={{backgroundColor: tag.color}}
                    className="tagName"
                    onClick={clickedOnTag}
                    // eslint-disable-next-line max-len
                    title={`Remove '${tag.name}' tag from ${songToView.name} by ${songToView.artists[0].name}`}
                  >
                    {tag.name}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <SongTagAdder
          isOpen={isAddingTags}
          // userID={'musicrag'}
          userID={'TEST_USER_ID_1'}
          songToView={songToView}
          setSongToView={setSongToView}
          library={library}
          setLibrary={setLibrary}
          setIsAddingTags={setIsAddingTags}
        />
      </Popover>
    </ThemeProvider>
  );
}

export default SongCard;
