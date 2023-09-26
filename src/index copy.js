/*!

=========================================================
* Akelax Technologie React - v1.9.0
=========================================================

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { lazy } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import makeStyles from '@mui/styles/makeStyles';
import CircularProgress from '@mui/material/CircularProgress';
import PortableWifiOffIcon from '@mui/icons-material/PortableWifiOff';

import Button from '@mui/material/Button';
// theme
import ThemeConfig from './theme';

// core components
import reportWebVitals from './reportWebVitals';
// import 'assets/css/material-dashboard-react.css';
import Loadable from 'layouts/Loadable';
import { WS_BASE_URL } from 'Config';

// window.process = {};

const App = Loadable(lazy(() => import('./App')));

const place = window.location.pathname.split('/');

const Init = () => {
  const [connectWebSocket, setConnectWebSocket] = React.useState(null);
  const [connecting, setConnecting] = React.useState(true);
  const [wsState, setWsState] = React.useState('');

  return (
    <>
      <HelmetProvider>
        <BrowserRouter>
          <ThemeConfig>
            <App webSocket={connectWebSocket} />
            <WsSupport connectWebSocket={connectWebSocket} setConnectWebSocket={setConnectWebSocket} setWsState={setWsState} />
          </ThemeConfig>
        </BrowserRouter>
      </HelmetProvider>
    </>
  );
};

function WsSupport({ setConnectWebSocket, setWsState, connectWebSocket }) {
  const useStyles = makeStyles({
    root: {
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
    }
  });
  const classes = useStyles();

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
    const webSocket = new WebSocket(`${WS_BASE_URL}/ws/workplace/`);
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
      <div className={classes.root}>
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

ReactDOM.render(<Init />, document.getElementById('root'));

serviceWorkerRegistration.register();

// serviceWorker.unregister();
reportWebVitals();
