const express = require('express');
const app = express();
const ig = require('instagram-node').instagram();

const PORT = process.env.PORT || '8080';
const URL = process.env.URL || 'http://localhost';

const redirectUri = `${URL}:${PORT}/handleAuth`;
let accessToken;

app.use(express.static(`${__dirname}/public`));

ig.use({
    client_id: '',
    client_secret: ''
});

app.get('/authorize', (req, res) => {
  res.redirect(ig.get_authorization_url(redirectUri, { scope : ['public_content','likes']}) );
});

app.get('/handleAuth', (req, res) => {
  ig.authorize_user(req.query.code, redirectUri, (err, result) => {
    if(err) res.send( err );
    accessToken = result.access_token;
    res.redirect('/');
  });
})

app.get('/', (req, res) => {
   ig.use({
    access_token : accessToken
   });

   ig.user_media_recent(accessToken.split('.')[0], (err, result, pagination, remaining, limit) => {
      if(err) res.json(err);
      res.send({ media : result });
   });
});

app.listen(PORT);
