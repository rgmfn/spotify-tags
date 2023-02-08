import React from 'react';

/**
 * @return {object} JSX
 */
function SpotifyResults({searchQuery, accessToken}) {
  return (
    <div>
      <table>
        <tr>
          <td>SpotifyResults</td>
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

export default SpotifyResults;
