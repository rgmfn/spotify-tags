const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// selects all the songs for a user
exports.selectAll = async (userid) => {
  const select = 'SELECT * FROM songs WHERE userid = $1';
  const query = {
    text: select,
    values: [userid],
  };
  const {rows} = await pool.query(query);
  const ret = {userid: rows[0].userid, songs: []};
  for (const row of rows) {
    const song = {};
    song.spotifyid = row.spotifyid;
    song.tags = row.tags.tags; // don't ask
    ret.songs.push(song);
  }
  return ret;
};

// selects all the tags for a specific song and a given user
exports.selectTags = async (spotifyid, userid) => {
  const select = 'SELECT tags, userid, spotifyid FROM songs' +
    'WHERE spotifyid = $1 AND userid = $2';
  const query = {
    text: select,
    values: [spotifyid, userid],
  };
  const {rows} = await pool.query(query);
  const ret = {
    userid: rows[0].userid,
    spotifyid: rows[0].spotifyid,
    tags: rows[0].tags.tags,
  };
  return ret;
};

// returns a list of all the tags the user has
exports.allTags = async (userid) => {
  const select = 'SELECT DISTINCT tags, userid FROM songs WHERE userid = $1';
  const query = {
    text: select,
    values: [userid],
  };
  const {rows} = await pool.query(query);
  const ret = {userid: rows[0].userid, tags: []};

  // aggregate and get rid of duplicate tags
  ret.tags = [...new Set([].concat(
    ...rows.map((row) =>
      row.tags.tags.map((tag) =>
        JSON.stringify(tag))))),
  ];
  ret.tags = ret.tags.map((tag) => JSON.parse(tag));
  return ret;
};

// inserts a new song object into the database
exports.insertTags = async (userid, spotifyid, tags) => {
  const select = 'INSERT INTO songs(userid, spotifyid, tags)' +
    'VALUES ($1, $2, $3)';
  const query = {
    text: select,
    values: [userid, spotifyid, {tags: tags}],
  };
  await pool.query(query);
  return;
};

/**
 * @param {string} userid - spotify id of user to remove song from
 * @param {string} spotifyid - spotify id of song to remove from user
 */
exports.deleteSong = async (userid, spotifyid) => {
  const delet = 'DELETE FROM songs WHERE userid = $1 AND spotifyid = $2;';
  // cant use delete its a keyword lmao
  const query = {
    text: delet,
    values: [userid, spotifyid],
  };
  await pool.query(query);
  return;
};

console.log(`Connected to database '${process.env.POSTGRES_DB}'`);
