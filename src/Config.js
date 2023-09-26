const HTTP_BASE_URL = window.location.port
  ? `${window.location.protocol}//${window.location.hostname}:8000`
  : `${window.location.protocol}//${window.location.hostname}`;

const WS_BASE_URL = window.location.port
  ? `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:8000`
  : `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}`;

/* const HTTP_BASE_URL = 'https://www.laxmedical.pro';
const WS_BASE_URL = 'wss://www.laxmedical.pro'; */

export { HTTP_BASE_URL, WS_BASE_URL };
