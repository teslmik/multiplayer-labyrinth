import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import socketHandler from './socket/index.js';

const PORT = 5001;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use(express.json());
app.get('/', (_, res) => res.send('Hello world!'));

socketHandler(io);

const start = async () => {
  try {
    server.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};

start();