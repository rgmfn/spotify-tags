import React from 'react';
import Popover from '@mui/material/Popover';
import AlbumIcon from '@mui/icons-material/Album';
import PersonIcon from '@mui/icons-material/Person';
import {ThemeProvider} from '@mui/material/styles';

import './SongCard.css';
import SongTagAdder from './SongTagAdder.jsx';
import {darkTheme} from './darkTheme.js';

/**
 * @param {object} song - the song being viewed in the SongCard, if there is
 *                        none, the SongCard does not show up
 * @param {function} setSongToView - sets the song being viewed in the SongCard,
 *                                   set to emptySong to make SongCard go away
 * @param {array} library - the current song library
 * @param {function} setLibrary - sets the current song library
 * @param {function} closeCard - called when clicking off of the SongCard
 * @param {function} expression - used inside SongTagAdder
 * @param {function} setExpression - used inside SongTagAdder
 * @return {object} JSX
 */
function SongCard({song, setSongToView, library, setLibrary, closeCard,
  expression, setExpression}) {
  const [addingTags, setAddingTags] = React.useState(false);

  /**
   * TODO
   */
  const clickedOnTagContainer = (() => {
    console.log('clicked tag container');
    setAddingTags(true);
  });

  /**
   * @param {object} event - event.currentTarget.textContent holds the
   *                         name of the tag to be removed
   * Removes the tag clicked from the song and from that song in the library.
   */
  const clickedOnTag = ((event) => {
    event.stopPropagation();
    const newTags = song.tags.filter((tag) =>
      tag.name !== event.currentTarget.textContent,
    );
    const newLibrary = library.map((newSong) => {
      if (newSong.id === song.id) {
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
        open={Boolean(song.id)}
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
                  {song.name}
                </p>
              </div>
              <div id="artist-container">
                <PersonIcon id="personIcon"/>
                <p id="artistName" className="tagName">
                  {song.artists[0].name}
                </p>
              </div>
              <div id="album-container">
                <AlbumIcon id="albumIcon"/>
                <p id="albumName" className="tagName">
                  {song.album.name}
                </p>
              </div>
            </div>
            <div id="right-half">
              <img
                src={song.album.images[0].url}
                alt={'[' + song.album.name + ' img]'}
                id="songImg"
              />
            </div>
          </div>
          <hr className="divider"/>
          <div id="bottom-half">
            <div id="tags-container"
              onClick={clickedOnTagContainer}
            >
              {song.tags.map((tag) => (
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
          open={addingTags}
          userID={''}
          expression={expression}
          setExpression={setExpression}
          setAddingTags={setAddingTags}
        />
      </Popover>
    </ThemeProvider>
  );
}

export default SongCard;
