import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';


import Loadable from '../components/Loadable';
//


import Pass from './Pass';
import DrivePage from '../pages/drive';
import PrelevementHistory from '../pages/prelevement';
// ----------------------------------------------------------------------

const Login = Loadable(lazy(() => import('../pages/Login')));
const Logout = Loadable(lazy(() => import('../pages/Logout')));
const SiginUp = Loadable(lazy(() => import('../pages/SiginUp')));
const Home = Loadable(lazy(() => import('../pages/home')));

const NotFound = Loadable(lazy(() => import('../pages/Page404')));



export default function Router() {
  return useRoutes([
    {
      path: '/app',
      element: <Pass />,
      children: [
        { path: '', element: <Navigate to="home" replace /> },
        { path: 'home', element: <Home /> },
        { path: 'drive', element: <DrivePage /> },
        { path: 'prelevement', element: <Pass />, children: [
          { path: '', element: <Navigate to="reports" replace /> },
          { path: 'reports', element: <PrelevementHistory /> },
          { path: 'histories', element: <PrelevementHistory /> }
        ] }
      ]
    },
    {
      path: '/',
      element: <Pass />,
      children: [
        { path: '', element: <Navigate to="/app/home" replace /> },
        { path: 'login', element: <Login /> },
        { path: 'logout', element: <Logout webSocket={null} /> },
        { path: 'siginup', element: <SiginUp webSocket={null} /> },
        { path: '404', element: <NotFound /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
