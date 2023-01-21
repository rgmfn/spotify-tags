const APIController = (function () {
  const clientId = '17276f6aa56b4f089a6321b0b6176513';
  const clientSecret = '11cacfe4f6e64634a7097fecccbd356a';

  const _getToken = async () => {

    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      // mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
      },
      body: 'grant_type=client_credentials',
    });

    const data = await result.json();
    return data.access_token;
  }

  const _getSearch = async (token, query) => {
    // const limit = 10;
    await token;
    // console.log(token);

    const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + token},
    });

    const data = await result.json();
    return data;
  }

  return {
    getToken() {
      return _getToken();
    },
    getSearch(token, query) {
      return _getSearch(token, query);
    },
  }
})();

// console.log('hello');

// const token = APIController.getToken();
// const search = APIController.getSearch('cool');

// console.log(search);
