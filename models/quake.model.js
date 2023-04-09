const mongoose = require('mongoose');

const quakeSchema = new mongoose.Schema(
  {
    time: {type: Date, immutable: true, require: true},
    duration: {type: Number, immutable: true, require: true},
    groundFloor: {type: Array, immutable: true, require: true},
    secondFloor: {type: Array, immutable: true, require: true},
    thirdFloor: {type: Array, immutable: true, require: true},
  },
  {timestamps: true},
);

module.exports = mongoose.model('Quake', quakeSchema);
