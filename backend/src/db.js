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
    values: [userid]
  };
  const {rows} = await pool.query(query);
//   console.log(rows);
  const ret = {userid: rows[0].userid, songs: []};
  for (const row of rows) {
    let song = {};
    song.spotifyid = row.spotifyid;
    song.tags = row.tags.tags; // don't ask
    ret.songs.push(song);
  }
  return ret;
};

//selects all the tags for a specific song and a given user
exports.selectTags = async (spotifyid, userid) => {
    const select = 'SELECT tags, userid, spotifyid FROM songs WHERE spotifyid = $1 AND userid = $2';
    const query = {
        text: select,
        values: [spotifyid, userid]
    };
    const {rows} = await pool.query(query);
    const ret = {userid: rows[0].userid, spotifyid: rows[0].spotifyid, listTags: []};
    for (const row of rows){
        let tag = {};
        tag.tags = row.tags.tags;
        ret.listTags.push(tag);
    }
    
    //ret.listTags = rows.tags;
    return ret;
};

 

//returns a list of all the tags the user has
exports.allTags = async (userid) => {
    const select = 'SELECT DISTINCT tags, userid FROM songs WHERE userid = $1';
    const query = {
        text: select,
        values: [userid]
    };
    const {rows} = await pool.query(query);
    const ret = {userid: rows[0].userid, tagList: []};
    
    //iterating through the nested arrays to extract the distinct tags for each user
    tempArr = [...new Set(rows.map(row => row.tags.tags))];
    for (let i = 0; i < tempArr.length; i++){
      for (let j = 0; j < tempArr[i].length; j++){
        if (ret.tagList.includes(tempArr[i][j])){
        } else {
          ret.tagList.push(tempArr[i][j]);
        }
      }
    }
    return ret;
};

//inserts a new song object into the database
exports.insertTags = async (userid, spotifyid, tags) => {
  const select = 'INSERT INTO songs(userid, spotifyid, tags) VALUES ($1, $2, $3)';
  const query = {
      text: select,
      values: [userid, spotifyid, tags]
  };
  await pool.query(query);
  return;
};



console.log(`Connected to database '${process.env.POSTGRES_DB}'`);