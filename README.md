<h1 align="center">
    SpotifyTags
    <img src="https://drive.google.com/uc?export=view&id=1QvrWXQcThh3hZQ9U057ttBaap-23wgKA" alt="SpotifyTags">
</h1>

SpotifyTags is a tag-based music streaming service. This means that instead of the user filling playlists with songs, the user fills songs with tags. A boolean expression using these tags then filters which songs should be played. For example, selecting "rock AND instrumental" or "sad AND slow BUT NOT classical" only plays the songs that you have tagged that fit the criteria.

Requirements
------------

* docker-compose
* npm (latest stable release recommended)
* a Spotify account with Spotify Premium

Installation Guide
------------------

After cloning the repo, in the project root, run `npm install`. This will call `npm install` inside the frontend/ and backend/ folders, installing all of the packages needed.

Go into the backend/ folder and run `docker-compose up -d` to start the database. Later you will run `docker-compose down` to stop running the database.

Before you run the program, make sure the database is running. Then, run `npm start` in the project root. This will call npm start inside the frontend/ and backend/ folders, starting the frontend and backend.

Go to 'localhost:3000' in a browser to begin using.

Quick Start Guide
-----------------

* Logging in
    - Click the top left most icon of an arrow pointing into a box (when hovered, it should say 'Log in')
    - This should take you to the Spotify Login page where you can log in with your Spotify Premium account

* Adding a song to your library (and creating a tag)
    - Your library is full of all of the songs you have added tags to, so we will add a tag to the song we want to add for it to appear in the library
    - Click the search bar
    - Enter the name of a song
    - In the right column ('Spotify Results'), click on the song you want to add
    - Click on the bottom half of the popup
    - In the new side popup, type the name of a tag to add into the search bar
    - Click 'CREATE NEW TAG' button
    - Exit both the side popup and main popup (press ESC) or click off of both popups

* Building an expression
    - **NOTE**: This requires you to have created a tag. If there are no songs in your library (and therefore no tags), there will be no tags to choose from.
    - Click 'Click to build expression...'
    - Select a tag from the list of possible tags
