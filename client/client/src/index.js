import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './Pages/home/components/home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LobbySettings from './Pages/home/components/lobbySettings';
import Lobby from './Pages/Lobby/components/lobby';
import NameChoose from './Pages/namechoose/components/nameChoose';
import Screen from './Pages/screen/component/screen';
import EndScreen from './Pages/endScreen/components/endScreen';
import Host from './Pages/host/component/host';
import Player from './Pages/player/components/player';
import { WebSocketProvider } from './webSocket.js';
import ScreenLeft from './Pages/screenLeft/components/screenLeft.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <WebSocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/LobbySettings" element={<LobbySettings />} />
          <Route path="/Lobby" element={<Lobby />} />
          <Route path="/SelectName" element={<NameChoose />} />
          <Route path="/Screen" element={<Screen />} />
          <Route path="/EndScreen" element={<EndScreen />} />
          <Route path="/Host" element={<Host />} />
          <Route path="/Player" element={<Player />} />
          <Route path="/ScreenLeft" element={<ScreenLeft />} />
        </Routes>
      </BrowserRouter>
    </WebSocketProvider>
 
);

