import React from 'react';

/**
 * @return {object} JSX
 */
function LibraryResults({searchQuery, library, setSongToView}) {
  const filteredLibrary = library.filter((song) =>
    song.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const clickedOnSong = ((event) => {
    if (event.currentTarget.id) {
      const foundSong=library.find((song)=>song.id===event.currentTarget.id);
      setSongToView(foundSong);
    };
  });
  return (
    <div className="search-results">
      <div className="results-title">
        Songs In Library
        <hr className="divider"/>
      </div>
      <table>
        <tbody>
          {filteredLibrary.length === 0 ?
            <tr><td>No songs match your search</td></tr> : filteredLibrary.map(
              (result) => (
                <tr
                  id={result.id}
                  onClick={clickedOnSong}
                >
                  <td className="search-img-col">
                    <div className="imgContainer">
                      <img
                        className="search-img"
                        src={result.album.images[0].url}
                        alt={'[' + result.album.name + ' img]'}
                      />
                    </div>
                  </td>
                  <td className="search-name-col">
                    {result.name}
                  </td>
                  <td className="search-artist-col">
                    {result.artists[0].name}
                  </td>
                  <td className="search-album-col">
                    {result.album.name}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default LibraryResults;
