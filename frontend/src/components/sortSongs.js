

/**
 *
 * @param {*} reverse
 * @param {*} primary
 * @param {*} secondary
 *
 * @return {Number}
 */
function songSort(reverse, primary, secondary) {
  // created to return an anon func. to be used
  // to sort the mapped variable
  return function(a, b) {
    let comparison = 0; // will store all the given comparisons

    // sorting by primary attribute
    if (typeof a[primary] === 'string' &&
          typeof b[primary] === 'string') {
      comparison = a[primary].localeCompare(b[primary]);
    } else if (typeof a[primary] === 'number' &&
          typeof b[primary] === 'number') {
      comparison = a[primary] > b[primary] ? 1 : -1;
    }

    // if primary attributes are the same, sort by secondary attribute
    if (comparison === 0 && secondary) {
      if (typeof a[secondary] === 'string' &&
               typeof b[secondary] === 'string') {
        comparison = a[secondary].localeCompare(b[secondary]);
      } else if (typeof a[secondary] === 'number' &&
               typeof b[secondary] === 'number') {
        comparison = a[secondary] > b[secondary] ? 1 : -1;
      }
    }

    return reverse ? -comparison : comparison;
  };
}

/**
 *
 * @param {*} reverse
 * @param {*} primary
 * @param {*} secondary
 * @param {*} library
 * @param {*} setLibrary
 *
 */
export default function mainSort(reverse,
  primary, secondary, library, setLibrary) {
  // creating a new object for each attribute we want to sort
  // in order to have the same depths for all
  const mapped = library.map(function(el, i) {
    return {
      index: i,
      trackName: el.name.toLowerCase(),
      artistName: el.artists[0].name.toLowerCase(),
      albumName: el.album.name.toLowerCase(),
      releaseDate: el.album.release_date.toLowerCase(),
      songLength: el.duration_ms,
      popularity: el.popularity,
    };
  });
  const sortedSongs = mapped.sort(songSort(reverse, primary, secondary));
  const result = sortedSongs.map(function(el) {
    return library[el.index];
  });
  setLibrary(result);
}
