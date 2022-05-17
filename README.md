# 101010 (WIP)
Welcome to my little Spotify integration!
Over the years I have collected quite some music through Spotify all scattered over more than a hundred playlists.
Some of them have hundreds of songs and are a bit polluted. 
That is why I thought this project could be a perfect moment to combine my passion for coding and building with music. 

The goal of the app is to provide users with playlists that always consist of 10 songs. 
They can play the music through the website that integrates with their Spotify Premium (!) account. 
Users can also subscribe to receive playlists and in a later phase it might be fun to co-create the playlists with subscribers. 

Not everything is there yet. 

### Important todo's before launch of V1: 
- Landing and Settings page
- Encryption 
- Better Playlist Selection module
- Users can save playlists to their Spotify account
- Better error handling
- Integration with email program on production
- Get a VPS and create deployment strategy (either quick n dirty through docker-compose or kubernetes on a VM)

### Steps before running the app locally: 

**1. Create Spotify Developer account**
- When registering your app set callback uri to http://localhost:3000/api/callback
- Fill in `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in the .env file 

**2. Create Mailtrap account** <br />
Fill in `MAIL_USER` and `MAIL_PASSWORD` in the .env file

**3. Run migrations in seed file** <br />
npm run migrate

**4. Start servers**
- Run `docker-compose up -d` in the /docker folder
- Run `npm run build dev`






