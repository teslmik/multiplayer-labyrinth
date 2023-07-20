import React from 'react';
import type { Socket } from 'socket.io-client';
import io from 'socket.io-client';

import { SOCKET_URL } from '../constants';

const username = sessionStorage.getItem('username');

const socket = io(SOCKET_URL, { query: { username } });
const SocketContext = React.createContext<Socket>(socket);

export { socket, SocketContext };