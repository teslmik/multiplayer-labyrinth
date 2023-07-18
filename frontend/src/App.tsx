import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainLayout from './layout';
import { APP_ROTES } from './common/enums';
import { PrivateRoute, PublicRoute } from './components/components';
import { SocketContext } from './context/socket';
import { DashboardPage, LoginPage } from './pages';

import './App.scss';

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
        <Route path={APP_ROTES.ROOT} element={<MainLayout />}>
          <Route path='' element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path={APP_ROTES.DASHDOARD} element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
