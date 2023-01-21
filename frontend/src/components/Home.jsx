import React from 'react';

const songs = require('../data/songs.json');
// turns json file ../data/songs.json into js json obj

/**
 * @return {object} JSX
 */
function Home() {
  console.log(songs);

  return (
    <ul
      // start of list
    >
      {songs.map((song) => (
        // iterate through songs
        <li>{song.name}</li>
        // create list element with song name
      ))}
    </ul>
  );
}

export default Home;
