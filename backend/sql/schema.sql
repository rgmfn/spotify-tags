-- create schema

--
-- All SQL statements must be on a single line and end in a semicolon.
--

-- Your database schema goes here --

DROP TABLE IF EXISTS songs;
CREATE TABLE songs(userid VARCHAR(32), spotifyid VARCHAR(32), tags jsonb);
