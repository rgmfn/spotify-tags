/**
 *
 * @param {String} spotifyid
 * @param {String} accessToken
 *
 * @return {Object} track
 */
export default async function getTrack(spotifyid, accessToken) {
  const response = await fetch(`https://api.spotify.com/v1/tracks/${spotifyid}`, {
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'},
  });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data;
}
