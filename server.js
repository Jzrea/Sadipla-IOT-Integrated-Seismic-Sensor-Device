const express = require('express');
// const cookieParser = require('cookie-parser');
const cors = require('cors');
// const http = require('http');
// const route = require("./routes/feeds.routes.js");

const app = express();

app.use(express.json());
// app.use(cookieParser());
app.use(
  cors({
    origin: [
      // 'https://192.168.1.6:3000',
      // 'http://192.168.1.6:4000',
      // 'https://localhost:4000',
      'http://localhost:4000',
    ],
    credentials: true,
  }),
);

app.io = require('socket.io')({
  cors: {
    origin: [
      // 'http://192.168.1.6:3000',
      // 'https://localhost:4000',
      'http://localhost:4000',
    ],
  },
  rejectUnauthorized: false,
  transports: ['websocket'],
});
const socketIORouter = require('./routes/socketIO.routes')(app.io);
const quakesRouter = require('./routes/quakes.routes');

app.use(socketIORouter);
app.use('/quakes', quakesRouter);
// app.use('/feeds',feedsRouter);
// app.use('/pens',pens.router);
// app.use('/logs',logsRouter);
app.use('*', (req, res) => {
  res.status(404).json({error: 'access'});
});

// app.setMaxListeners(0);
module.exports = app;
