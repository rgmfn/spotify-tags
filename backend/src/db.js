const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// ensures that there is only one unique combination pair with userid, spotifyid
// in other words, only one song with that given spotifyid for that user
(async () => {
  // eslint-disable-next-line max-len
  await pool.query('ALTER TABLE songs ADD CONSTRAINT unique_user_spotify UNIQUE (userid, spotifyid)');
})();

// selects all the songs for a user
exports.selectAll = async (userid) => {
  const select = 'SELECT * FROM songs WHERE userid = $1';
  const query = {
    text: select,
    values: [userid],
  };
  const {rows} = await pool.query(query);
  const ret = {userid: userid, songs: []};
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
  const select = 'SELECT tags, userid, spotifyid FROM songs ' +
    'WHERE spotifyid = $1 AND userid = $2';
  const query = {
    text: select,
    values: [spotifyid, userid],
  };
  const {rows} = await pool.query(query);
  if (rows.length === 0) {
    return {userid: userid, spotifyid: spotifyid, tags: []};
  }
  const ret = {userid: userid, spotifyid: spotifyid, tags: rows[0].tags.tags};
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
  const ret = {userid: userid, tags: []};

  // aggregate and get rid of duplicate tags
  ret.tags = [...new Set([].concat(...rows.map((row) =>
    row.tags.tags.map((tag) =>
      JSON.stringify(tag)))))];
  ret.tags = ret.tags.map((tag) => JSON.parse(tag));
  return ret;
};

// inserts a new song object into the database
exports.insertTags = async (userid, spotifyid, tags) => {
  const select = 'INSERT INTO songs(userid, spotifyid, tags)' +
    'VALUES ($1, $2, $3) ON CONFLICT (userid, spotifyid) DO '+
    'UPDATE SET userid=$1, spotifyid=$2, tags=$3;';
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

// updates the given song object if the userid, spotifyid
// are already in the db
exports.updateTags = async (userid, spotifyid, tags) => {
  const select = 'UPDATE songs SET tags = $1 '+
    'WHERE userid = $2 and spotifyid = $3';
  const query = {
    text: select,
    values: [{tags: tags}, userid, spotifyid],
      };
  await pool.query(query);
  return;
};

//updates the given song object if the userid, spotifyid
//are already in the db
exports.updateTags = async (userid, spotifyid, tags) => {
  const select = 'UPDATE songs SET tags = $1 WHERE userid = $2 and spotifyid = $3';
  const query = {
      text: select,
      values: [{tags: tags}, userid, spotifyid],
  };
  await pool.query(query);
  return;
};

console.log(`Connected to database '${process.env.POSTGRES_DB}'`);
