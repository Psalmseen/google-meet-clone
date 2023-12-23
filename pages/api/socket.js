import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  console.log('Called apui');
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Server is connected');
    });
  }
  res.end();
};

export default SocketHandler;