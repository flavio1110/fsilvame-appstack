const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');


/**
 * MongoDB setup
 */
let mongoDbUrl = 'mongo:27017';

mongoose.connect(`mongodb://${mongoDbUrl}/api`);

const User = mongoose.model('User', { name: String });


/**
 * Express setup
 */
const app = express();

app.use(bodyParser.json());
app.use(morgan());


/**
 * Routes
 */
app.get('/users', (req, res) => {
  const startTime = Date.now();

  User.find((err, users) => {
    if (err)  {
      return res.send('API: Something went wrong ' + err);
    }

    const timestamp = Date.now() - startTime;

    res.send({
      time: timestamp,
      data: users
    });
  });
});

app.post('/users', (req, res) => {
  const startTime = Date.now();
  const name = req.body.name;

  const user = new User({ name });
  user.save((err) => {
    if (err)  {
      return res.send('API: Something went wrong ' + err);
    }

    const timestamp = Date.now() - startTime;

    res.send({
      time: timestamp,
      data: user
    });
  });
});

app.put('/users/:id', (req, res) => {
  const startTime = Date.now();
  const name = req.body.name;

  User.findOneAndUpdate({ _id: req.params.id }, { name }, (err, user) => {
    if (err) {
      return res.send('API: Something went wrong ' + err);
    }

    const timestamp = Date.now() - startTime;

    res.send({
      time: timestamp,
      data: user
    });
  });
});

app.delete('/users/:id', (req, res) => {
  const startTime = Date.now();

  User.findOneAndRemove(req.params.id, (err, user) => {
    if (err) {
      return res.send('API: Something went wrong ' + err);
    }

    const timestamp = Date.now() - startTime;

    res.send({
      time: timestamp,
      data: user
    });
  });
});

app.get('/healthz', (req, res) => {
    res.send({
        time: Date.now(),
        status: "Don't worry be happy!!!!!"
    });
});


// Start server
const server = app.listen(5000, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});
