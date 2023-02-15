import React from 'react';

/**
 * @param {array} library
 * @param {function} clickedOnSong - in Home.jsx, when clicking on a <tr>
 *                                   representing a song
 * @param {function} clickedOnTags - in Home.jsx, when clicking on the tags
 *                                   column of a <tr> representing a song
 * @return {object} JSX
 */
function Library({library, clickedOnSong, clickedOnTags}) {
  return (
    <table>
      <tbody
      // tbody = table body
      >
        {library.length === 0 ?
          <tr><td>Loading...</td></tr> : library.map((song) => (
          // render 'Loading...' if the library isn't loaded
            <tr
            // tr = table row
              onClick={clickedOnSong}
              id={song.id} // sets row id to Spotify ID of song
              key={song.id}
              title={song.uri}
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
