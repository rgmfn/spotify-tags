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
   * TODO
   */
  const clickedOnTagContainer = (() => {
    console.log('clicked tag container');
    setIsAddingTags(true);
  });

  /**
   * @param {object} event - event.currentTarget.textContent holds the
   *                         name of the tag to be removed
   * Removes the tag clicked from the song and from that song in the library.
   */
  const clickedOnTag = ((event) => {
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
                id="songImg"
              />
            </div>
          </div>
          <hr className="divider"/>
          <div id="bottom-half"
            onClick={clickedOnTagContainer}
          >
            <div id="tags-container">
              {songToView.tags.map((tag) => (
                <div
                  style={{backgroundColor: tag.color}}
                  className="tagName"
                  onClick={clickedOnTag}
                >
                  {tag.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <SongTagAdder
          open={isAddingTags}
          userID={''}
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
