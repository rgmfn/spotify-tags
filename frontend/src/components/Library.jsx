import React from 'react';

import parseExpression from './Parser.jsx';
import validateExpression from './ValidateExpression';

/**
 * @param {array} library
 * @param {array} updatedLib - the library we will store songs that adhere
 *                             to the expression.
 * @param {function} clickedOnSong - in Home.jsx, when clicking on a <tr>
 *                                   representing a song
 * @param {function} clickedOnTags - in Home.jsx, when clicking on the tags
 *                                   column of a <tr> representing a song
 * @return {object} JSX
 */
function Library({library, updatedLib, setUpdatedLib,
  clickedOnSong, clickedOnTags, expression, playingTrackID}) {
  const validExpression = validateExpression(expression);
  // is expression valid

  let songMatches = [];

  // store all songs that match the expression criteria
  if (expression.length === 0) {
    songMatches = library;
  } else if (validExpression && library.length > 0) {
    songMatches = library.filter(function(song) {
      return parseExpression(song, expression);
    });
  }

  React.useEffect(() => {
    setUpdatedLib(songMatches);
  }, [library, expression]);

  return (
    <table>
      <tbody
      // tbody = table body
      >
        {library.length === 0 ?
          <tr><td>Loading...</td></tr> : updatedLib.length === 0 ?
          // render 'Loading...' if the library isn't loaded
            <tr><td>No match found.</td></tr> : updatedLib.map((song) => (
            // render 'No match found.' if the new library is now empty
              <tr
              // tr = table row
                onClick={clickedOnSong}
                id={song.id} // sets row id to Spotify ID of song
                key={song.id}
                title={song.uri}
                style={{
                  fontWeight: song.id === playingTrackID ? 'bold' : '',
                  color: song.id === playingTrackID ? '#719cd6' : '',
                }}
              >
                <td className="imgCol"
                // td = table data (data cell)
                >
                  <div className="imgContainer">
                    <img
                      src={song.album.images[0].url}
                      alt={'[' + song.album.name + ' img]'}
                      className="songImg"
                    />
                  </div>
                </td>
                <td className="nameCol">
                  <div className="songName">
                    {song.name}
                  </div>
                </td>
                <td className="artistCol">
                  <div className="artistName">
                    {song.artists[0].name}
                  </div>
                </td>
                <td className="albumCol">
                  <div className="albumName">
                    {song.album.name}
                  </div>
                </td>
                <td
                  className="tagCol"
                  onClick={clickedOnTags}
                >
                  {song.tags.map((tag) => (
                    <div
                      style={{backgroundColor: tag.color}}
                      className="tagName"
                    >
                      {tag.name}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
      </tbody>
    </table>
  );
}

export default Library;
