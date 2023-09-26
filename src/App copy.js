import { useState, useEffect, useContext, createContext } from 'react';

// pages for this product

// routes
import Router from './routes/index';

import GlobalStyles from './theme/globalStyles';
// o
import ScrollToTop from './components/Scroll/NavigationScroll';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
/*  */

// Import Swiper styles
import 'swiper/swiper-bundle.css';

import moment from '../node_modules/moment/moment';
import 'moment/locale/fr';

moment.locale('fr'); // default the locale to English

export default function App({ webSocket }) {
  return (
    <div>
      <GlobalStyles />
      <BaseOptionChartStyle />
      <ProvideAuth webSocket={webSocket}>
        <ScrollToTop>
          <Router />
        </ScrollToTop>
      </ProvideAuth>
    </div>
  );
}

const fakeAuth = {
  isAuthenticated: false,
  signin(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const authContext = createContext();

let callBackList = Array(0);

function useProvideAuth(webSocket) {
  const [user, setUser] = useState({ authentifing: true, is_auth: false });
  const [workplace, setWorkplace] = useState(null);
  const [profiles, setProfiles] = useState(null);
  const [profile, setCurrentProfile] = useState(null);
  const [peer, setPeer] = useState(null);
  const [remotePeers, setRemotePeers] = useState(null);

  const signin = (cb) => setUser(cb());

  const signout = (cb) =>
    fakeAuth.signout(() => {
      cb();
      setUser({
        authentifing: false,
        is_auth: false
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
    console.log(data);
    console.log(callBackList);
    callBackList.forEach((callBack) => {
      if (callBack.type.includes(data.type)) {
        callBack.run(data);
      }
    });
  };

  return {
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

function ProvideAuth({ webSocket, children }) {
  const auth = useProvideAuth(webSocket);
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}
