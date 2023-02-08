import React from 'react';

/**
 * @return {object} JSX
 */
function LibraryResults({searchQuery, library}) {
  return (
    <div>
      <table>
        <tr>
          <td>LibraryResults</td>
        </tr>
        <tr>
          <td>songImg</td>
          <td>SpotifySong</td>
          <td>SpotifyArtist</td>
          <td>SpotifyAlbum</td>
        </tr>
      </table>
    </div>
  );
};

export default LibraryResults;
