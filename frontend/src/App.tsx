import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.scss';
import { APP_ROTES } from './common/enums';
import { SocketContext } from './context/socket';
import { DashboardPage, LoginPage } from './pages';


const App: React.FC = () => {
  const io = React.useContext(SocketContext);

  React.useEffect(() => {
    io.on('message', (message) => {
      console.log(message);
    });
  }, [io]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={APP_ROTES.ROOT} element={<LoginPage />} />
      </Routes>
      <Routes>
        <Route path={APP_ROTES.DASHDOARD} element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
