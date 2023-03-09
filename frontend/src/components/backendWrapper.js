/**
 *
 * @param {String} userid
 * @param {Object} song
 */
export async function storeSong(userid, song) {
  await fetch(`http://localhost:3010/v0/tagsPost`, {
    // http get request to api.spotify.com/v1/search
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      {userid: userid, spotifyid: song.id,
        tags: song.tags}),
  });
}
/**
 *
 * @param {String} userid
 */
export async function retrieveAllSongs(userid) {
  const response = await fetch(`http://localhost:3010/v0/songs?${new URLSearchParams({
    userid: userid,
  })}`);
  const data = await response.json();
  // console.log('dat', data);
  return data;
}


