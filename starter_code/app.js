const express = require("express");
const hbs = require("hbs");
const app = express();

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const clientId = "888c79e33b8749ce8dbb4817915a9a77",
  clientSecret = "cb201abfce9742c29e85db4f80164392";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artists/", (req, res) => {
  const q = req.query.search;
  console.log(q);
  spotifyApi
    .searchArtists(q)
    .then(data => {
      console.log("The received data from the API: ", data);
      const items = data.body.artists.items;

      res.render("artists", { artistList: items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      const items = data.body.items;

      res.render("albums", { albumList: items });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/tracks/:albumId", (req, res) => {
  const albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      const items = data.body.items;
      res.render("tracks", { items });
    })
    .catch(err => {
      console.log(err);
    });
});
app.listen(3001, () =>
  console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊")
);
