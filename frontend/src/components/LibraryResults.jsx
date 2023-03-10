import React from 'react';

const selectedTagInSong = (selectedTag, result) => {
  return selectedTag && result.tags.some((tag) =>
    selectedTag.name === tag.name);
};

/**
 * @return {object} JSX
 */
function LibraryResults({searchQuery, library, clickedOnSong, selectedTag}) {
  const filteredLibrary = library.filter((song) =>
    song.name.normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
                  key={result.id}
                  onClick={() => clickedOnSong(result.id)}
                  title={!selectedTag ?
                    // eslint-disable-next-line max-len
                    `View song details about ${result.name} by ${result.artists[0].name}` :
                    selectedTagInSong(selectedTag, result) ?
                      // eslint-disable-next-line max-len
                      `Remove '${selectedTag.name}' tag from ${result.name} by ${result.artists[0].name}` :
                      // eslint-disable-next-line max-len
                      `Add '${selectedTag.name}' tag to ${result.name} by ${result.artists[0].name}`
                  }
                  style={{
                    color: selectedTagInSong(selectedTag, result) ?
                      '#81b29a' : '',
                  }}
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
