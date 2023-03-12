const db = require('./db');

exports.getAll = async (req, res) => {
  let songs = null;
  songs = await db.selectAll(req.query.userid);
  if (songs.length === 0) {
    res.status(404).send();
  } else {
    res.status(200).json(songs);
  }
};

exports.getTags = async(req, res) => {
    let listTags = null;
    listTags  = await db.selectTags(req.query.spotifyid, req.query.userid);
    if (listTags.length === 0){
        res.status(404).send();
    } else {
        res.status(200).json(listTags);
    }
};

exports.postTags = async(req,res) => {
    try {
      await db.insertTags(req.body.userid, req.body.spotifyid, req.body.tags);
      res.status(200).send();
    } catch(err){
      console.log(err);
      res.status(500).send();
    }
};


exports.getAllTags = async(req,res) => {
    let tagList = null;
    tagList = await db.allTags(req.query.userid);
    if (tagList.length === 0){
      res.status(404).send();
    } else {
      res.status(200).json(tagList);
    }
};

exports.postUpdate = async(req, res) => {
    try {
      await db.updateTags(req.body.userid, req.body.spotifyid, req.body.tags);
      res.status(200).send();
    } catch(err){
      console.log(err);
      res.status(500).send();
    }
};