/**
 * Called by Ryan's wrapper for Victor's expression builder pop-up module.
 *
 * Makes list of artists and albums from all library songs (no duplicates).
 * Then, it transforms that list into a list of properly formatted artist
 * and album tags.
 *
 * @param {array} library - list of song objects
 *  @return {array} - list of artist and album tag objects for each library
 *                    song
 */
const artistAlbumTags = ((library) => {
  // creates no-duplicate list of artists and albums for each library song
  let artistsAlbums = [];
  let artist = '';
  let album = '';

  library.forEach((song) => {
    artist = song.artists[0].name;
    album = song.album.name;

    artistsAlbums = (artistsAlbums.includes(artist)) ? (artistsAlbums) :
      [...artistsAlbums, artist];
    artistsAlbums = (artistsAlbums.includes(album)) ? (artistsAlbums) :
      [...artistsAlbums, album];
  });

  // transforms artistsAlbums list into properly formatted list of tags
  const artistAlbumTags = [];
  artistsAlbums.forEach((artistAlbumName) => {
    artistAlbumTags.push({name: artistAlbumName, color: '#dddddd'});
  });

  return artistAlbumTags;
});

export {artistAlbumTags};
