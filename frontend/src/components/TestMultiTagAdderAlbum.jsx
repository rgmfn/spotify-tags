import React from 'react';

import PersonIcon from '@mui/icons-material/Person';
import AlbumIcon from '@mui/icons-material/Album';

import MultiTagAdder from './MultiTagAdder.jsx';

const nameInfo = (
  <>
    <div id="name-container">
      <AlbumIcon id="albumIcon"/>
      <p id="albumName" className="tagName">
        {/* {album.name} */}
        BALLADS 1
      </p>
    </div>
    <div id="artist-container">
      <PersonIcon id="personIcon"/>
      <p id="artistName" className="tagName">
        {/* {artist.name} */}
        Joji
      </p>
    </div>
  </>
);

const image = (
  <img
    // src={album.images[0].url}
    src='https://i.scdn.co/image/ab67616d0000b27360ba1d6104d0475c7555a6b2'
    // alt={'[' + album.name + ' img]'}
    alt='BALLADS 1 img'
    className="song-card-song-img"
  />
);

/**
 * @return {JSX}
 */
function TestMultiTagAdderAlbum() {
  // const [album, setAlbum] = React.getState(emptyAlbum);

  /**
   *
   */
  const addTags = () => {

  };

  /**
   *
   */
  const removeTags = () => {

  };

  return (
    <MultiTagAdder
      isOpen={true}
      nameInfo={nameInfo}
      image={image}
      addTags={addTags}
      removeTags={removeTags}
    />
  );
}

export default TestMultiTagAdderAlbum;
