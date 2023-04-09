require('dotenv').config();

// const password = process.env.SOCKETIO_KEY;
const iot = process.env.SOCKETIOHIOT_KEY;
const app = process.env.SOCKETIOHAPP_KEY;
    
module.exports = (socket, next) => {
    if((
        socket.handshake.headers.id !== undefined ||
        socket.handshake.headers.password !== undefined
      ) && (
        (socket.handshake.headers.id === 'appClient' && app === socket.handshake.headers.password)
        || (socket.handshake.headers.id === 'iotClient' && iot === socket.handshake.headers.password)
        )){
        console.log('connected... authenticating')
        next();
    }else{
        console.log('permission denied');
        socket.disconnect();
    }

}