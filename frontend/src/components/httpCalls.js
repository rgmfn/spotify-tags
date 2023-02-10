import {emptySong} from './emptySong.js';
import {fakeTags} from './fakeTags.js';

const getSearch = async (accessToken, refreshToken, setAccessToken,
  refreshTokenFunc, query) => {
  let result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=25`, {
    // http get request to api.spotify.com/v1/search
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + accessToken},
  });

  if (!result.ok) {
    accessToken = await refreshTokenFunc(refreshToken, setAccessToken);
    result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=25`, {
    // http get request to api.spotify.com/v1/search
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + accessToken},
    });
  }

  const data = await result.json();
  return data;
};

const getSong = async (accessToken, refreshToken, setAccessToken,
  refreshTokenFunc, id) => {
  if (!id) {
    return emptySong;
  }

  let result = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    // http get request to api.spotify.com/v1/search
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + accessToken},
  });

  if (!result.ok) {
    accessToken = await refreshTokenFunc(refreshToken, setAccessToken);
    result = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      // http get request to api.spotify.com/v1/search
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + accessToken},
    });
  }

  const data = await result.json();
  data.tags = fakeTags;
  return data;
};


export {getSearch, getSong};
