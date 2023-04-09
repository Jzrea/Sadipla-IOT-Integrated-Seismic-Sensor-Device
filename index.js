const app = require('./server.js'),
  mongoose = require('mongoose'),
  http = require('http');

require('dotenv').config();

const port = process.env.PORT || 4000;

mongoose
  .connect(process.env.DB_URI, {})
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(client => {
    const server = http.createServer(app);
    app.io.attach(server);
    app.set('socketio', app.io);
    server.listen(port, () => {
      console.log(`listening on port: ${port}`);
    });
  });
