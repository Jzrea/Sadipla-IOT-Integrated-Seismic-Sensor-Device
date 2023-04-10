const quakesRouter = require('express').Router();
const { Socket } = require('socket.io');
const Quake = require('../models/quake.model');

//Write routes here
quakesRouter.route('/').get((req, res) => {
  const socketIORouter = require('./socketIO.routes')(app.io);
  console.log(socketIORouter.report)
  Quake.find()
    .sort('-createdAt')
    .skip(parseInt(req.query.offset))
    .limit(1)
    .then(quake => res.json(quake))
    .catch(err => res.status(400).json('err:' + err));
});

module.exports = quakesRouter;
    