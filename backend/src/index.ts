import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';

import socketHandler from './socket/index.js';
import connectDB from './config/database.js';
import AppRouter from './routes/index.js';

const PORT = process.env.PORT || 5001;
const app = express();
const router = new AppRouter(app);
const server = http.createServer(app);
const io = new Server(server, {
  // cors: {
  //   origin: 'http://localhost:5001',
  //   methods: ["GET", "POST"]
  // },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  }
});

app.use(express.json());

socketHandler(io);
connectDB();

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.get('/', (_, res) => res.send('Hello world!'));

router.init();

const start = async () => {
  try {
    server.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};

start();