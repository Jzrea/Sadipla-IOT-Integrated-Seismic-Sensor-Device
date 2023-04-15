const express = require('express');
const Quake = require('../models/quake.model');
const socketAuth = require('../middleware/socketAuth');
const admin = require('../utils/fcm');
// const tokens = require('../utils/tokens')

const router = express.Router();

require('dotenv').config();

module.exports = function (io) {
  io.use(socketAuth);

  let roomClient = [];
  let iotClient;

  let tokens = [];
  let ground = [];
  let second = [];
  let third = [];
  let t0 = Date.now();
  let t1 = Date.now();
  io.on('connection', function (socket) {
    console.log('client establishing connection...');

    io.to(socket.id).emit('auth');
    //SOCKET NETWORK AUTHENTICATIONS
    const socketKey = process.env.SOCKETIO_KEY;
    // console.log(password);
    socket.on('auth', ({id, password, token}) => {
      console.log('client authenticated');
      if (tokens.length > 20) {
        tokens = [];
        io.to('appClient').emit('auth');
        return;
      }
      // console.log(;
      if (socketKey === password) {
        if (!tokens.includes(token) && (token != null || token != undefined)) {
          tokens.push(token);
        }
        if (roomClient.includes(`${socket.id}`)) {
          return;
        }
        socket.join('clients');
        if (id === 'appClient') {
          socket.join('appClient');
        } else if (id === 'iotClient') {
          socket.join('iotClient');
          iotClient = socket.id;
          io.to('appClient').emit('iotStatus', {isOnline: true});
        }
        roomClient.push(socket.id);
      } else {
        console.log('client is not permitted');
        socket.disconnect();
      }

      let updateStarted = true;
      //AUTHENTICATED LISTENERS
      socket.on('quakeUpdate', async payload => {
        // sendMessage();

        ground.push(payload.ground);
        second.push(payload.second);
        third.push(payload.third);
        // const date = new Date();
        // console.log(`compare: ${Date.now()<t0}`)
        if (updateStarted && tokens.length > 0) {
          t0 = Date.now();
          updateStarted = false;
          const message = {
            tokens, // ['token_1', 'token_2', ...]
            data: {type: 'emergency'},
          };
          await admin.messaging().sendMulticast(message);
        }
        t1 = Date.now();
        // duration =  (t1 - t0 ) / 1000;
      });
      socket.on('quakeUpdateTest', async payload => {
        if (updateStarted && tokens.length > 0) {
          const message = {
            tokens, // ['token_1', 'token_2', ...]
            data: {type: 'emergency'},
          };
          console.log(tokens);
          await admin.messaging().sendMulticast(message);
        }
        // duration =  (t1 - t0 ) / 1000;
      });

      socket.on('subscribe', ({token}) => {
        // console.log('subscribed:', token);
        if (!tokens.includes(token)) {
          tokens.push(token);
        }
        console.log('subscribers:', tokens);
      });

      socket.on('quakeUpdateDone', () => {
        // console.log(ground);
        // console.log(second);
        const duration = (t1 - t0) / 1000;

        // console.log((t1 - t0) / 1000);

        Quake.create({
          time: t0,
          duration: duration,
          groundFloor: ground,
          secondFloor: second,
          thirdFloor: third,
        })
          .then(async newQuake => {
            // duration = 0;
            updateStarted = true;
            ground = [];
            second = [];
            third = [];
            // console.log(newQuake);
            io.to('appClient').emit('quakeUpdate', newQuake);
          })
          .catch(err => console.log('error: ' + err));
      });

      socket.on('iotStatus', res => {
        io.to('appClient').emit('iotStatus', {
          isOnline: iotClient !== undefined ? true : false,
        });
      });
      //ON Events
      socket.on('alarmOff', function () {
        // console.log('alarmOff');
        io.to('iotClient').emit('alarmOff');
      });

      socket.on('toggleDetect', function (payload) {
        // console.log('toggleOff');
        if (socket.id === iotClient) {
          io.to('appClient').emit('toggleDetect', {
            toggleVal: payload.toggleVal,
          });
        } else {
          io.to('iotClient').emit('toggleDetect');
        }
      });
    });

    // socket.emit('auth');
    //End ON Events
    socket.on('disconnect', () => {
      console.log('Client disconnected');
      if (socket.id === iotClient) {
        // console.log('iotRoom: ' + iotRoomClient.length);
        iotClient = undefined;
        io.to('appClient').emit('iotStatus', {isOnline: false});
      }
      socket.removeAllListeners();
    });
  });

  return router;
};
