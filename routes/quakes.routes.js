const quakesRouter = require('express').Router();
const Quake = require('../models/quake.model');

//Write routes here
quakesRouter.route('/').get((req, res) => {
  // console.log(req.query);
  Quake.find()
    .sort('-createdAt')
    .skip(parseInt(req.query.offset))
    .limit(1)
    .then(quake => res.json(quake))
    .catch(err => res.status(400).json('err:' + err));
});

module.exports = quakesRouter;
    