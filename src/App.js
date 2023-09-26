

/*!

=========================================================
* Akelax Technologie React - v1.9.0
=========================================================

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import CircularProgress from '@mui/material/CircularProgress';
import PortableWifiOffIcon from '@mui/icons-material/PortableWifiOff';

import Button from '@mui/material/Button';
// theme
import ThemeConfig from './theme';

import { WS_BASE_URL } from './Config';

// window.process = {};

import Router from './routes';

const place = window.location.pathname.split('/');


function App() {
  const [connectWebSocket, setConnectWebSocket] = React.useState(null);
  const [connecting, setConnecting] = React.useState(true);
  const [wsState, setWsState] = React.useState('');

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ProvideData webSocket={connectWebSocket}>
            <ThemeConfig>
              <Router />
              {false && <WsSupport connectWebSocket={connectWebSocket} setConnectWebSocket={setConnectWebSocket} setWsState={setWsState} />}
            </ThemeConfig>
        </ProvideData>
      </BrowserRouter>
    </HelmetProvider>
  );
}

//---------------------------------------

const dataContext = createContext();


const fakeData = {
  isDataenticated: false,
  signin(cb) {
    fakeData.isDataenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeData.isDataenticated = false;
    setTimeout(cb, 100);
  }
};


let callBackList = Array(0);

const initData = {
  prelevements: null,

}

function useProvideData(webSocket) {
  const [user, setUser] = useState({ dataentifing: true, is_data: false });
  const [workplace, setWorkplace] = useState(null);
  const [profiles, setProfiles] = useState(null);
  const [profile, setCurrentProfile] = useState(null);
  const [peer, setPeer] = useState(null);
  const [remotePeers, setRemotePeers] = useState(null);

  const signin = (cb) => setUser(cb());

  const signout = (cb) =>
    fakeData.signout(() => {
      cb();
      setUser({
        dataentifing: false,
        is_data: false
      });
      setProfiles(null);
      setCurrentProfile(null);
    });

  const addCallBack = (callBack) => {
    console.log('add callBack fun !!!!!');
    callBackList.push(callBack);
  };

  const deleteCallBack = (callBackId) => {
    console.log(`delete callBack func${callBackId} !!!!!`);
    callBackList = callBackList.filter((callBack) => callBack.id !== callBackId);
    console.log(callBackList);
  };

  useEffect(() => {
    if (webSocket) {
      webSocket.onmessage = handleWsmessage;
    }
  }, [webSocket]);

  const handleWsmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log('WS RECEIVE_DATA: ', data);
    console.log(callBackList);
    callBackList.forEach((callBack) => {
      if (callBack.type.includes(data.type)) {
        callBack.run(data);
      }
    });
  };

  return {
    ...initData,
    user,
    setUser,
    signin,
    signout,
    workplace,
    profile,
    profiles,
    setWorkplace,
    setProfiles,
    setCurrentProfile,
    addCallBack,
    deleteCallBack,
    ws: webSocket,
    wsSend: (data) => {
      console.log('SEND DATA IN WS: ', typeof data === 'string' ? JSON.parse(data) : data);
      webSocket?.send(typeof data === 'string' ? data : JSON.stringify(data));
    },
    peer,
    setPeer,
    remotePeers,
    setRemotePeers
  };
}

function ProvideData({ webSocket, children }) {
  const data = useProvideData(webSocket);
  return <dataContext.Provider value={data}>{children}</dataContext.Provider>;
}

export function useData() {
  return useContext(dataContext);
}



function WsSupport({ setConnectWebSocket, setWsState, connectWebSocket }) {

  const [counter, setCounter] = React.useState(0);
  const [connecting, setConnecting] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      if (!connectWebSocket) setCounter((c) => c + 1);
    }, 999);
  }, [counter]);

  React.useEffect(() => {
    setTimeout(() => {
      if (!connectWebSocket) handleRetry();
    }, 200);

    window.addEventListener('online', () => handleRetry());
    window.addEventListener('offline', () => setConnecting(false));
  }, []);

  const handleRetry = () => {
    setConnecting(true);
    setCounter(0);
    const webSocket = new WebSocket(`${WS_BASE_URL}/ws/app/main/`);
    webSocket.onopen = () => {
      setConnectWebSocket(webSocket);
      setWsState('connect');
      console.log('-------------connect websocket--------------');
      setConnecting(false);
    };
    webSocket.onerror = () => {
      setWsState('error');
      console.log('error websocket');
    };
    webSocket.onclose = () => {
      setConnectWebSocket(null);
      setWsState('disconnect');
      setConnecting(false);
      console.log('close websocket');
      /* webSocket.close(); */
      setTimeout(() => {
        if (window.navigator.onLine) handleRetry();
      }, 500);
    };
  };

  return (
    !connectWebSocket && (
      <div style={{
        position: 'fixed',
        zIndex: 100000,
        bottom: 20,
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#ffffffBB',
        alignItems: 'center'
      }}>
        {!connecting ? (
          <>
            <PortableWifiOffIcon style={{ fontSize: 100 }} />
            <h3>{counter}s passées</h3>
            <p>{window.navigator.onLine ? 'Vous étes deconnectés de la plateforme !' : 'Pas de connexion internet'}</p>
            <Button variant="outlined" color="primary" onClick={handleRetry}>
              Réessayer
            </Button>
          </>
        ) : (
          <>
            <CircularProgress disableShrink />
            <p>Chargement...</p>
          </>
        )}
      </div>
    )
  );
}

export default App;
