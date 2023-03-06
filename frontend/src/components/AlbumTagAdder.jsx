import React from 'react';
import MultiTagAdder from './MultiTagAdder';

import AlbumIcon from '@mui/icons-material/Album';
import PersonIcon from '@mui/icons-material/Person';

/**
 * @param {boolean} isOpen
 * @param {object} album
 * @param {object} artist
 * @return {JSX}
 */
function AlbumTagAdder({isOpen, album, artist}) {
  return (
    <MultiTagAdder
      imageURL={album.images[0].url}
      info={
        <>
          <div id="artist-container">
            <PersonIcon id="personIcon"/>
            <p id="artistName" className="tagName">
              {artist.name}
            </p>
          </div>
          <div id="album-container">
            <AlbumIcon id="albumIcon"/>
            <p id="albumName" className="tagName">
              {album.name}
            </p>
          </div>
        </>
      }
    />
  );
}

export default AlbumTagAdder;
