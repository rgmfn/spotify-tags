const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const auth = require('./auth');
const songs = require('./songs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/', auth);

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec,
    validateRequests: true,
    validateResponses: true,
  }),
);

// routes go here
// e.g: app.get('/v0/mail', mail.getAll);
app.get('/v0/songs', songs.getAll);
app.get('/v0/single', songs.getTags);
app.post('/v0/tagsPost', songs.postTags);
app.get('/v0/tagList', songs.getAllTags);
app.post('/v0/postUpdate', songs.postUpdate);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
